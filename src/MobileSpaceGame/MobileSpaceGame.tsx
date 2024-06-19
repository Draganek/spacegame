import { useEffect, useRef, useState } from 'react'
import useStorage from '../hooks/useStorage'
import './MobileSpaceGame.css'
import { playerMove, createBullet, moveBullets } from './Player/Player'
import { Enemies } from './Enemies/Enemies'
import { Points, ShowLifes, LevelShow, GameAllert } from './InterfaseIcon/InterfaseIcon'
import { GameLose, LevelWon, StartMenu } from './ModalWinows/ModalWindows'
import { levelConfigurations } from '../gameConfig/levelConfigurations'
const defaultMusic = require('./music/intro.mp3');
const soundGameLose = require("./sounds/game_lose.wav");

interface UpgradesType {
    name: string;
    price: number;
    image: string;
    available: boolean;
    level: number;
}

export const MobileSpaceGame = () => {
    const [record, setRecord] = useStorage<number>('record', 0);

    const [bullets, setBullets] = useState<HTMLDivElement[]>([]);
    const [enemies, setEnemies] = useState<HTMLDivElement[]>([]);

    const [gameInterface, setGameInterface] = useState({ pause: true, startModal: true, levelModal: false })

    const [level, setLevel] = useState<number>(1);
    const [lifes, setLifes] = useState<number>(3);
    const [score, setScore] = useState<number>(0);
    const [previousScore, setPreviousScore] = useState(0);
    const [money, setMoney] = useState<number>(0);
    const [upgrades, setUpgrades] = useState<UpgradesType[]>([
        { "name": "Szybkość", "price": 20, "image": "frequency.jpg", "available": true, "level": 1 },
        { "name": "Strzały", "price": 50, "image": "ilosc.jpg", "available": true, "level": 1 },
        { "name": "Max HP", "price": 30, "image": "heart-max.jpg", "available": true, "level": 3 },
        { "name": "Heal", "price": 10, "image": "heart-heal.jpg", "available": true, "level": 1 }])

    const [bulletSpeed, SetBulletSpeed] = useState<number>(1);

    const [shipPosition, setShipPosition] = useState({ x: "50%", y: '0%' });

    const playerRef = useRef<HTMLDivElement>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const bulletShotInterval = setInterval(() => createBullet(boardRef, playerRef, setBullets, upgrades[1].level), 1400 - 200 * upgrades[0].level);
        
        const bulletInterval = setInterval(() => moveBullets(setBullets, setEnemies, boardRef, setScore), 10);
        const handleTouchMove = (e: TouchEvent) => playerMove(e, boardRef, playerRef, setShipPosition);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });


        if (gameInterface.pause) {

            clearInterval(bulletShotInterval);
            clearInterval(bulletInterval);
            boardRef.current!.style.animation = 'none';
            window.removeEventListener('touchmove', handleTouchMove)
            window.addEventListener('touchmove', (e) => { e.preventDefault() }, { passive: false });
        }

        return () => {
            window.removeEventListener('touchmove', handleTouchMove);
            clearInterval(bulletInterval);
            clearInterval(bulletShotInterval);
        };
    }, [gameInterface.pause, level]);

    useEffect(() => {
        if (record < level) {
            setRecord(level);
        }
        if (score > previousScore) {
            setMoney(prevMoney => prevMoney + 1);
            setPreviousScore(score);
        }
        if (score >= levelConfigurations[level].count) {
            setGameInterface(prev => ({ ...prev, pause: true, levelModal: true , startModal: false}));
            setPreviousScore(0);
            setScore(0);
        }
        if (!lifes) {
            setGameInterface(prev => ({ ...prev, pause: true}));
            let file = new Howl({
                src: [soundGameLose],
            });
            file.play();
        }
    }, [score, previousScore, record, lifes])

    const resetGame = () => {
        setGameInterface(prev => ({ ...prev, pause: false, newLevel: false, startModal: false }));
        setScore(0);
        setLifes(3);
        setLevel(1);
        setMoney(0);
        setUpgrades(prevUpgrades =>
            prevUpgrades.map(upgrade => {
                if (upgrade.name === "Max HP") {
                    return { ...upgrade, level: 3 };
                } else {
                    return { ...upgrade, level: 1 };
                }
            })
        );

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
            volume: 0.2, // Ustawienie głośności na 50% (wartość od 0 do 1)
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
                <Enemies boardRef={boardRef} setEnemies={setEnemies} gameInterface={gameInterface} setLifes={setLifes} level={level}/>
                <LevelShow gameStarted={gameInterface.startModal} newLevel={gameInterface.levelModal} level={level} />
                <GameAllert gameStarted={gameInterface.startModal} newLevel={gameInterface.levelModal} level={level} />
                <Points score={money} />
                <ShowLifes lifes={lifes} />
                <GameLose lifes={lifes} reset={resetGame} level={level} record={record}/>
                <StartMenu startModal={gameInterface.startModal} reset={resetGame} record={record} />
                <LevelWon setLifes={setLifes} lifes={lifes} setMoney={setMoney} money={money} newLevel={gameInterface.levelModal} level={level} setLevel={setLevel} setNewLevel={setGameInterface} boardRef={boardRef} playerRef={playerRef} enemies={enemies} bullets={bullets} setUpgrades={setUpgrades} upgrades={upgrades} />
            </div>
        </div >
    )
}
