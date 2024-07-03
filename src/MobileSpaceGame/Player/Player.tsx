import { RefObject, Dispatch, SetStateAction } from 'react';
import { Howl } from 'howler';
const soundShot = require('../sounds/light_shot.ogg');
const soundHit = require('../sounds/hit.wav');

interface Enemy extends HTMLDivElement {
    velocityX: number;
    velocityY: number;
  }

export const playerMove = (e: TouchEvent, boardRef: RefObject<HTMLDivElement>, playerRef: RefObject<HTMLDivElement>, setShipPosition: Dispatch<{ x: string; y: string; }>) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch.clientY > boardRef.current!.offsetHeight || touch.clientY - playerRef.current!.offsetHeight < 0 || touch.clientX > boardRef.current!.offsetWidth || touch.clientX < 0) {
    }
    else {
        setShipPosition({ x: `${touch.clientX}px`, y: `${-touch.clientY + boardRef.current!.offsetHeight}px` });
    }
};

export const createBullet = (boardRef: RefObject<HTMLDivElement>, playerRef: RefObject<HTMLDivElement>, setBullets: Dispatch<SetStateAction<HTMLDivElement[]>>, bulletLevel: number) => {
    let file = new Howl({
        src: [soundShot]
    });
    file.play();

    switch (bulletLevel) {
        case 1:
            configureBullet(-4, 5, boardRef, playerRef, setBullets)
            break;

        case 2:
            configureBullet(-18, 0, boardRef, playerRef, setBullets)
            configureBullet(10, 0, boardRef, playerRef, setBullets)
            break;
        case 3:
            configureBullet(-4, 5, boardRef, playerRef, setBullets)
            configureBullet(-18, 0, boardRef, playerRef, setBullets)
            configureBullet(10, 0, boardRef, playerRef, setBullets)
            break;
        case 4:
            configureBullet(-18, 0, boardRef, playerRef, setBullets)
            configureBullet(10, 0, boardRef, playerRef, setBullets)
            configureBullet(-30, -5, boardRef, playerRef, setBullets)
            configureBullet(23, -5, boardRef, playerRef, setBullets)
            break;
        case 5:
            configureBullet(-4, 5, boardRef, playerRef, setBullets)
            configureBullet(-18, 0, boardRef, playerRef, setBullets)
            configureBullet(10, 0, boardRef, playerRef, setBullets)
            configureBullet(-30, -5, boardRef, playerRef, setBullets)
            configureBullet(23, -5, boardRef, playerRef, setBullets)
            break;
    }
}

const configureBullet = (width: number, hight: number, boardRef: RefObject<HTMLDivElement>, playerRef: RefObject<HTMLDivElement>, setBullets: Dispatch<SetStateAction<HTMLDivElement[]>>) => {
    let bullet = document.createElement('div');
    bullet.className = 'bullet';
    bullet.style.left = `${playerRef.current!.offsetLeft + width}px`;
    bullet.style.top = `${playerRef.current!.offsetTop - hight}px`;
    boardRef.current!.appendChild(bullet);
    setBullets(prevBullets => [...prevBullets, bullet]);
}

export const moveBullets = (setBullets: Dispatch<SetStateAction<HTMLDivElement[]>>, setEnemies: Dispatch<SetStateAction<HTMLDivElement[]>>, boardRef: RefObject<HTMLDivElement>, setScore: Dispatch<SetStateAction<number>>, setSlanters: Dispatch<SetStateAction<Enemy[]>>) => {
    setBullets(prevBullets => {
        const updatedBullets: HTMLDivElement[] = [];
        const boardHeight = boardRef.current!.offsetHeight;
        const moveDistance = 0.004 * boardHeight;

        prevBullets.forEach(bullet => {
            if (bullet.offsetTop >= 0) {
                const newTop = bullet.offsetTop - moveDistance;
                bullet.style.top = `${newTop}px`;
                updatedBullets.push(bullet);
                checkBulletCollision(bullet, setEnemies, boardRef, setScore, setSlanters);
            } else {
                bullet.remove();
            }
        });
        return updatedBullets;
    });
};

const checkBulletCollision = (bullet: HTMLDivElement, setEnemies: Dispatch<SetStateAction<HTMLDivElement[]>>, boardRef: RefObject<HTMLDivElement>, setScore: Dispatch<SetStateAction<number>>, setSlanters: Dispatch<SetStateAction<Enemy[]>>) => {
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
    setSlanters(prevEnemies => {
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
