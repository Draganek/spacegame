import { levelConfigurations } from '../../gameConfig/levelConfigurations';
import { RefObject, Dispatch, SetStateAction, useEffect, useState } from 'react';
const hurt = require('../sounds/hurt.mp3');

interface Enemy extends HTMLDivElement {
    velocityX: number;
    velocityY: number;
  }

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
        const moveDistance =(0.004 + (speed * 0.0005)) * boardHeight;

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
    const [slanters, setSlanters] = useState<Enemy[]>([]);
    const [slantersNumber, setSlanterNumber] = useState<number>(0);
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

    useEffect(() => {
        const enemyInterval = setInterval(() => createSlanter(boardRef, setSlanters, setEnemiesNumber), 1100 - (100 * levelConfigurations[level].frequency));
        const moveEnemiesInterval = setInterval(() => moveSlanter(boardRef, setSlanters, setLifes, levelConfigurations[level].speed, setEnemiesNumber), 25);
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

    return null;
}



export const createSlanter = (boardRef: RefObject<HTMLDivElement>, setSlanters: Dispatch<SetStateAction<Enemy[]>>, setEnemiesNumber: Dispatch<SetStateAction<number>>) => {
    if (!boardRef.current) return;
    const shouldCreate = Math.round(Math.random());
    if (shouldCreate) {
        setEnemiesNumber(prevCount => prevCount + 1)
        const enemy = document.createElement('div') as Enemy;
        enemy.className = "slanter";
        enemy.style.top = '-40px';
        enemy.style.left = `${Math.floor(Math.random() * (boardRef.current!.offsetWidth - 120) + 60)}px`
        enemy.velocityX = (Math.random() * 2 - 1) || 0.5; // Losowa prędkość w zakresie od -1 do 1, ale nie 0
    enemy.velocityY = Math.random() * 2; // Prędkość pionowa (w dół)

        boardRef.current!.append(enemy);
        setSlanters(prevEnemies => [...prevEnemies, enemy])
    }
}

export const moveSlanter = (boardRef: RefObject<HTMLDivElement>, setEnemies: Dispatch<SetStateAction<Enemy[]>>, setLifes: Dispatch<SetStateAction<number>>, speed: number, setEnemiesNumber: Dispatch<SetStateAction<number>>) => {
    setEnemies(prevEnemies => {
    const updatedEnemies: Enemy[] = [];
    const boardWidth = boardRef.current!.offsetWidth;
    const boardHeight = boardRef.current!.offsetHeight;
    const moveDistance = (0.004 + speed * 0.0005) * boardHeight;

    prevEnemies.forEach(enemy => {
      // Oblicz nową pozycję
      const newTop = enemy.offsetTop + enemy.velocityY * moveDistance;
      const newLeft = enemy.offsetLeft + enemy.velocityX * moveDistance;

      // Sprawdź kolizję z krawędziami
      if (newLeft <= 0 || newLeft >= boardWidth - enemy.offsetWidth) {
        enemy.velocityX *= -1; // Zmień kierunek w osi X
        enemy.velocityY += (Math.random() - 0.5) * 0.2; // Dodaj losowe odchylenie w osi Y
      }

      if (Math.abs(enemy.velocityX) < 0.1) {
        enemy.velocityX = 0.5 * Math.sign(enemy.velocityX);
      }

      enemy.style.top = `${newTop}px`;
      enemy.style.left = `${newLeft}px`;

      if (newTop < boardHeight) {
        updatedEnemies.push(enemy);
      } else {
        enemy.remove();
        setEnemiesNumber(prevCount => prevCount - 1);
        setLifes(prevLifes => prevLifes - 1);
        let file = new Howl({
          src: [hurt],
          volume: 8,
        });
        file.play();
      }
    });
    return updatedEnemies;
    });
};
