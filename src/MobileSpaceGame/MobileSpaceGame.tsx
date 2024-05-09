import { useEffect, useRef, useState } from 'react'
import './MobileSpaceGame.css'
import { playerMove, createBullet, moveBullets } from './Player/Player'
import { createEnemy, moveEnemies } from './Enemies/Enemies'
import { Points, ShowLifes, LevelShow } from './InterfaseIcon/InterfaseIcon'
import { GameLose, LevelWon, StartMenu } from './ModalWinows/ModalWindows'
const defaultMusic = require('./music/intro.mp3');


export const MobileSpaceGame = () => {
    const [bullets, setBullets] = useState<HTMLDivElement[]>([]);
    const [enemies, setEnemies] = useState<HTMLDivElement[]>([]);
    const [level, setLevel] = useState<number>(1);
    const [lifes, setLifes] = useState<number>(3);
    const [score, setScore] = useState<number>(0);
    const [bulletSpeed, SetBulletSpeed] = useState<number>(1);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [newLevel, setNewLevel] = useState<boolean>(false);
    const playerRef = useRef<HTMLDivElement>(null);
    const boardRef = useRef<HTMLDivElement>(null);
    const [shipPosition, setShipPosition] = useState({ x: "50%", y: '0%' });

    useEffect(() => {
        const enemyInterval = setInterval(() => createEnemy(boardRef, setEnemies), 1000 - 15 * level);
        const moveEnemiesInterval = setInterval( () => moveEnemies(boardRef, setEnemies, setLifes), 50 - 5 * level);
        const bulletShotInterval = setInterval(() => createBullet(boardRef, playerRef, setBullets), 1000 * bulletSpeed);
        const bulletInterval = setInterval(() => moveBullets(setBullets, setEnemies, boardRef, setScore), 50);
        const handleTouchMove = (e: TouchEvent) => playerMove(e, boardRef, playerRef, setShipPosition);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });
        
        if (lifes === 0 || !gameStarted || newLevel ) {
            clearInterval(enemyInterval);
            clearInterval(moveEnemiesInterval);
            clearInterval(bulletShotInterval);
            clearInterval(bulletInterval);
            
            boardRef.current!.style.animation = 'none';
            window.removeEventListener('touchmove', handleTouchMove)
            window.addEventListener('touchmove', (e) => {e.preventDefault()}, { passive: false });
        }

        return () => {
            window.removeEventListener('touchmove', handleTouchMove);
            clearInterval(bulletInterval);
            clearInterval(enemyInterval);
            clearInterval(moveEnemiesInterval);
            clearInterval(bulletShotInterval);
        };
    }, [lifes, gameStarted, newLevel, level, bulletSpeed]);

    useEffect(() => {
        if (score >= 10 * level) {
            setNewLevel(true);
        }
    }, [score])

    const resetGame = () => {
        setGameStarted(true);
        setScore(0);
        setLifes(3);
        setLevel(1);
        enemies.forEach(enemy => enemy.remove());
        bullets.forEach(bullet => bullet.remove())
        playerRef.current!.style.left = "50%";
        playerRef.current!.style.bottom = "0%";
        boardRef.current!.style.animation = 'moveBg 1.5s infinite linear';
        backgroundMusic();
    }
    
    const backgroundMusic = () => {
        const backgroundMusic = new Howl({
            src: [defaultMusic],
            volume: 0.3, // Ustawienie głośności na 50% (wartość od 0 do 1)
            loop: true // Zapętlenie muzyki
        });
    
        // Automatyczne rozpoczęcie odtwarzania po załadowaniu
        backgroundMusic.once('load', () => {
            backgroundMusic.play();
        });
    
        return null; // Nie renderujemy niczego, ponieważ ten komponent jest odpowiedzialny tylko za odtwarzanie muzyki
    };

    return (
        <div>
            <div ref={boardRef} id='game-board-mobile'>
                <div
                    ref={playerRef}
                    id="player"
                    style={{
                        position: 'absolute',
                        left: shipPosition.x,
                        bottom: shipPosition.y,
                    }}>
                </div>
                <LevelShow gameStarted={gameStarted} newLevel={newLevel} level={level}/>
                <Points score={score}/>
                <ShowLifes lifes={lifes}/>
                <GameLose lifes={lifes} reset={resetGame}/>
                <StartMenu gameStarted={gameStarted} reset={resetGame}/>
                <LevelWon newLevel={newLevel} level={level} setLevel={setLevel} setNewLevel={setNewLevel} boardRef={boardRef} playerRef={playerRef} enemies={enemies} bullets={bullets}/>
            </div>
        </div >
    )
}
