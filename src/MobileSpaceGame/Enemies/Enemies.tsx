import { RefObject, Dispatch, SetStateAction } from 'react';
const hurt = require('../sounds/hurt.mp3');

export const createEnemy = (boardRef: RefObject<HTMLDivElement>, setEnemies: Dispatch<SetStateAction<HTMLDivElement[]>>) => {
    const shouldCreate = Math.round(Math.random());
    if (shouldCreate) {
        const enemy = document.createElement('div');
        enemy.className = "enemy";
        enemy.style.top = '-40px';
        enemy.style.left = `${Math.floor(Math.random() * (boardRef.current!.offsetWidth - 120) + 60)}px`

        boardRef.current!.append(enemy);
        setEnemies(prevEnemies => [...prevEnemies, enemy])
    }
}

export const moveEnemies = (boardRef: RefObject<HTMLDivElement>, setEnemies: Dispatch<SetStateAction<HTMLDivElement[]>>, setLifes: Dispatch<SetStateAction<number>>) => {
    setEnemies(prevEnemies => {
        const updatedEnemies: HTMLDivElement[] = [];
        const boardHeight = boardRef.current!.offsetHeight;
        const moveDistance = 0.0025 * boardHeight;

        prevEnemies.forEach(enemy => {
            const newTop = enemy.offsetTop + moveDistance;
            enemy.style.top = `${newTop}px`;
            if (newTop < boardRef.current!.offsetHeight) {
                updatedEnemies.push(enemy);
            } else {
                enemy.remove();
                setLifes(prevLifes => prevLifes - 1)
                let file = new Howl({
                    src: [hurt],
                    volume: 8
                });
                file.play();
            }
        });
        return updatedEnemies;
    });
};
