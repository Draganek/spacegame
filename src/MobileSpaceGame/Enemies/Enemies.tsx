import { levelConfigurations } from '../../gameConfig/levelConfigurations';
import { RefObject, Dispatch, SetStateAction, useEffect, useState } from 'react';
const hurt = require('../sounds/hurt.mp3');

export const createEnemy = (boardRef: RefObject<HTMLDivElement>, setEnemies: Dispatch<SetStateAction<HTMLDivElement[]>>, setEnemiesNumber: Dispatch<SetStateAction<number>>) => {
    if (!boardRef.current) return;
    const shouldCreate = Math.round(Math.random());
    if (shouldCreate) {
        setEnemiesNumber(prevCount => prevCount + 1)
        const enemy = document.createElement('div');
        enemy.className = "enemy";
        enemy.style.top = '-40px';
        enemy.style.left = `${Math.floor(Math.random() * (boardRef.current!.offsetWidth - 120) + 60)}px`

        boardRef.current!.append(enemy);
        setEnemies(prevEnemies => [...prevEnemies, enemy])
    }
}

export const moveEnemies = (boardRef: RefObject<HTMLDivElement>, setEnemies: Dispatch<SetStateAction<HTMLDivElement[]>>, setLifes: Dispatch<SetStateAction<number>>, speed: number, setEnemiesNumber: Dispatch<SetStateAction<number>>) => {
    setEnemies(prevEnemies => {
        const updatedEnemies: HTMLDivElement[] = [];
        const boardHeight = boardRef.current!.offsetHeight;
        const moveDistance =(0.001 + (speed * 0.0003)) * boardHeight;

        prevEnemies.forEach(enemy => {
            const newTop = enemy.offsetTop + moveDistance;
            enemy.style.top = `${newTop}px`;
            if (newTop < boardRef.current!.offsetHeight) {
                updatedEnemies.push(enemy);
            } else {
                enemy.remove();
                setEnemiesNumber(prevCount => prevCount - 1)
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

export const Enemies = ({ boardRef, setEnemies, gameInterface, setLifes, level }: { boardRef: RefObject<HTMLDivElement>, setEnemies: Dispatch<SetStateAction<HTMLDivElement[]>>, gameInterface: any, setLifes: Dispatch<SetStateAction<number>>, level: number }) => {
    const [enemiesNumber, setEnemiesNumber] = useState<number>(0);
    const [pauseEnemy, setPauseEnemy] = useState<boolean>(true)
    const [previousLevel, setPreviousLevel] = useState<number>(0)

    useEffect(() => {
        const enemyInterval = setInterval(() => createEnemy(boardRef, setEnemies, setEnemiesNumber), 1100 - (100 * levelConfigurations[level].frequency));
        const moveEnemiesInterval = setInterval(() => moveEnemies(boardRef, setEnemies, setLifes, levelConfigurations[level].speed, setEnemiesNumber), 25);
        if (gameInterface.pause || pauseEnemy) {
            clearInterval(enemyInterval);
            clearInterval(moveEnemiesInterval);
        }
        if (enemiesNumber >= levelConfigurations[level].count) {
            clearInterval(enemyInterval);
        }
        return () => {
            clearInterval(enemyInterval);
            clearInterval(moveEnemiesInterval);
        }
    }, [gameInterface, enemiesNumber, pauseEnemy])

    useEffect(() => {
        if (level > previousLevel) {
            setPreviousLevel(level);
            setTimeout(() => setPauseEnemy(false), 3000)
        }
        setEnemiesNumber(0);
        setPauseEnemy(true);
    }, [level, previousLevel]);

    return null;
}
