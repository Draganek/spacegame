import { useEffect, useRef, useState } from 'react'
import './MainComp.css'

interface Bullet {
    element: HTMLDivElement;
}

export const MainComp = () => {
    const [bullets, setBullets] = useState<Bullet[]>([]);
    const [enemies, setEnemies] = useState<Bullet[]>([]);
    const playerRef = useRef<HTMLDivElement>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.addEventListener('keydown', handleMove);
        const bulletInterval = setInterval(moveBullets, 50);
        const enemyInterval = setInterval(createEnemy, 1000);
        const moveEnemiesInterval = setInterval(moveEnemies, 200);
    
        return () => {
            clearInterval(bulletInterval);
            clearInterval(enemyInterval);
            clearInterval(moveEnemiesInterval);
        };
    }, []);

    

    const handleMove = (e: any) => {
        if (!playerRef.current || !boardRef.current) return;

        const playerElement = playerRef.current;
        const boardElement = boardRef.current;

        switch (e.code) {
            case 'Space': createBullet(playerElement, boardElement); break;
            case 'ArrowLeft': movePlayer(playerElement, boardElement, -1); break;
            case 'ArrowRight': movePlayer(playerElement, boardElement, 1);
        }
    }

    const createBullet = (playerElement: HTMLDivElement, boardElement: HTMLDivElement) => {
        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        bullet.style.left = `${playerElement.offsetLeft}px`;
        bullet.style.bottom = `${playerElement.offsetHeight}px`;
        boardElement.appendChild(bullet);
        setBullets(prevBullets => [...prevBullets, { element: bullet }]);
    }

    const moveBullets = () => {
        setBullets(prevBullets => {
            const updatedBullets: Bullet[] = [];
            prevBullets.forEach(bullet => {
                if (bullet.element.offsetTop >= 0) {
                    const newTop = bullet.element.offsetTop - 5;
                    bullet.element.style.top = `${newTop}px`;
                    updatedBullets.push(bullet);
                    checkBulletCollision(bullet);
                } else {
                    bullet.element.remove();
                }
            });
            return updatedBullets;
        });
    };



    const checkBulletCollision = (bullet: Bullet) => { 
        setEnemies(prevEnemies => {
            const updatedEnemies = prevEnemies.filter(enemy => {
                const bulletPosition = bullet.element.getBoundingClientRect();
                const enemyPosition = enemy.element.getBoundingClientRect();
                if (
                    bulletPosition.left < enemyPosition.right &&
                    bulletPosition.right > enemyPosition.left &&
                    bulletPosition.top < enemyPosition.bottom &&
                    bulletPosition.bottom > enemyPosition.top
                ) {
                    enemy.element.remove();
                    bullet.element.remove();
                    return false; // Return false to remove the enemy from the updatedEnemies array
                }
                return true; // Return true to keep the enemy in the updatedEnemies array
            });
            return updatedEnemies;
        });
    };

    const movePlayer = (playerElement: HTMLDivElement, boardElement: HTMLDivElement, direction: number) => {
        const newPosition: number = playerElement.offsetLeft + direction * 10
        const { left, right } = boardElement.getBoundingClientRect();
        const minLeft = playerElement.offsetWidth / 2;
        const maxRight = right - left - minLeft;

        if (newPosition >= minLeft && newPosition < maxRight) {
            playerElement.style.left = `${newPosition}px`
        }
    }

    const createEnemy = () => {
        const shouldCreate = Math.round(Math.random());
        if (shouldCreate) {
            const enemy = document.createElement('div');
            enemy.className = "enemy";
            enemy.style.top = '-40px';
            enemy.style.left = `${Math.floor(Math.random() * (boardRef.current!.offsetWidth - 120) + 60)}px`

            boardRef.current!.append(enemy);
            setEnemies(prevEnemies => [...prevEnemies, { element: enemy }]);
        }
    }

    const moveEnemies = () => {
        setEnemies(prevEnemies => {
            const updatedEnemies: Bullet[] = [];
            prevEnemies.forEach(enemy => {
                const newTop = enemy.element.offsetTop + 5;
                enemy.element.style.top = `${newTop}px`;
                if (newTop < boardRef.current!.offsetHeight) {
                    updatedEnemies.push(enemy);
                } else {
                    enemy.element.remove();
                    alert("Koniec gry!")
                }
            });
            return updatedEnemies;
        });
    };

    return (
        <div>
            <h1>Space defender</h1>
            <div ref={boardRef} id='game-board'>
                <div ref={playerRef} id="player"></div>
            </div>
        </div>

    )

}
