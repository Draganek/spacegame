import { useEffect, useRef, useState } from 'react'
import './MobileSpaceGame.css'
import { PlayerMove } from './Player/Player'
import { createEnemy, moveEnemies } from './Enemies/Enemies'
import scoreImage from "../img/coin.png"


export const MobileSpaceGame = () => {
    const [bullets, setBullets] = useState<HTMLDivElement[]>([]);
    const [enemies, setEnemies] = useState<HTMLDivElement[]>([]);
    const [level, setLevel] = useState<number>(3);
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
        const bulletShotInterval = setInterval(createBullet, 1000 * bulletSpeed);
        const bulletInterval = setInterval(moveBullets, 50);
        const handleTouchMove = (e: TouchEvent) => {
            const newPosition = PlayerMove(e, boardRef, playerRef);
            if (newPosition) {
                setShipPosition(newPosition);
              }
        };
        window.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            window.removeEventListener('touchmove', handleTouchMove);
            clearInterval(bulletInterval);
            clearInterval(enemyInterval);
            clearInterval(moveEnemiesInterval);
            clearInterval(bulletShotInterval);
        };
    }, [lifes, gameStarted, newLevel, level, bulletSpeed]);


    const createBullet = () => {
        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        bullet.style.left = `${playerRef.current!.offsetLeft}px`;
        bullet.style.top = `${playerRef.current!.offsetTop}px`;
        boardRef.current!.appendChild(bullet);
        setBullets(prevBullets => [...prevBullets, bullet]);
    }

    const moveBullets = () => {
        setBullets(prevBullets => {
            const updatedBullets: HTMLDivElement[] = [];
            prevBullets.forEach(bullet => {
                if (bullet.offsetTop >= 0) {
                    const newTop = bullet.offsetTop - 5;
                    bullet.style.top = `${newTop}px`;
                    updatedBullets.push(bullet);
                    checkBulletCollision(bullet);
                } else {
                    bullet.remove();
                }
            });
            return updatedBullets;
        });
    };

    const checkBulletCollision = (bullet: HTMLDivElement) => {
        setEnemies(prevEnemies => {
            const updatedEnemies = prevEnemies.filter(enemy => {
                const bulletPosition = bullet.getBoundingClientRect();
                const enemyPosition = enemy.getBoundingClientRect();
                if (
                    bulletPosition.left < enemyPosition.right &&
                    bulletPosition.right > enemyPosition.left &&
                    bulletPosition.top < enemyPosition.bottom &&
                    bulletPosition.bottom > enemyPosition.top
                ) {
                    makeExplosion(enemy.offsetLeft, enemy.offsetTop);
                    setScore(prevScore => prevScore + 1);
                    enemy.remove();
                    bullet.remove();
                    return false;
                }
                return true;
            });
            return updatedEnemies;
        });
    };

    const makeExplosion = (left: number, top: number) => {
        const explosion = document.createElement('div');
        explosion.className = 'explosion';
        explosion.style.left = `${left}px`
        explosion.style.top = `${top}px`
        boardRef.current!.appendChild(explosion)

        setTimeout(() => {
            explosion.remove();
        }, 500)

    }

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
            </div>
        </div >
    )
}
