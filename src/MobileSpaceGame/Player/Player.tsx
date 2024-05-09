import { RefObject, Dispatch, SetStateAction } from 'react';
import { Howl } from 'howler';
const soundShot = require('../sounds/light_shot.ogg');
const soundHit = require('../sounds/hit.wav');

export const playerMove = (e: TouchEvent, boardRef: RefObject<HTMLDivElement>, playerRef: RefObject<HTMLDivElement>, setShipPosition: Dispatch<{ x: string; y: string; }>) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch.clientY > boardRef.current!.offsetHeight || touch.clientY - playerRef.current!.offsetHeight < 0 || touch.clientX > boardRef.current!.offsetWidth || touch.clientX < 0) {
    }
    else {
        setShipPosition({ x: `${touch.clientX}px`, y: `${-touch.clientY + boardRef.current!.offsetHeight}px` });
    }
};

export const createBullet = (boardRef: RefObject<HTMLDivElement>, playerRef: RefObject<HTMLDivElement>, setBullets: Dispatch<SetStateAction<HTMLDivElement[]>>) => {
    let file = new Howl({
        src: [soundShot]
    });
    file.play();

    const bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.left = `${playerRef.current!.offsetLeft}px`;
    bullet.style.top = `${playerRef.current!.offsetTop}px`;
    boardRef.current!.appendChild(bullet);

    setBullets(prevBullets => [...prevBullets, bullet]);

}

export const moveBullets = (setBullets: Dispatch<SetStateAction<HTMLDivElement[]>>, setEnemies: Dispatch<SetStateAction<HTMLDivElement[]>>, boardRef: RefObject<HTMLDivElement>, setScore: Dispatch<SetStateAction<number>>) => {
    setBullets(prevBullets => {
        const updatedBullets: HTMLDivElement[] = [];
        prevBullets.forEach(bullet => {
            if (bullet.offsetTop >= 0) {
                const newTop = bullet.offsetTop - 5;
                bullet.style.top = `${newTop}px`;
                updatedBullets.push(bullet);
                checkBulletCollision(bullet, setEnemies, boardRef, setScore);
            } else {
                bullet.remove();
            }
        });
        return updatedBullets;
    });
};

const checkBulletCollision = (bullet: HTMLDivElement, setEnemies: Dispatch<SetStateAction<HTMLDivElement[]>>, boardRef: RefObject<HTMLDivElement>, setScore: Dispatch<SetStateAction<number>>) => {
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
                makeExplosion(enemy.offsetLeft, enemy.offsetTop, boardRef);
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

const makeExplosion = (left: number, top: number, boardRef: RefObject<HTMLDivElement>) => {
    let file = new Howl({
        src: [soundHit]
    });
    file.play();
    const explosion = document.createElement('div');
    explosion.className = 'explosion';
    explosion.style.left = `${left}px`
    explosion.style.top = `${top}px`
    boardRef.current!.appendChild(explosion)

    setTimeout(() => {
        explosion.remove();
    }, 500)

}
