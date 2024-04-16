import { useEffect, useRef, useState } from 'react'
import './MainComp.css'
import scoreImage from "../img/coin.png"

export const MainComp = () => {
    const [bullets, setBullets] = useState<HTMLDivElement[]>([]);
    const [enemies, setEnemies] = useState<HTMLDivElement[]>([]);
    const [lifes, setLifes] = useState<number>(3);
    const [score, setScore] = useState<number>(0);
    const playerRef = useRef<HTMLDivElement>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.addEventListener('keydown', handleMove);
        const bulletInterval = setInterval(moveBullets, 50);
        const enemyInterval = setInterval(createEnemy, 1000);
        const moveEnemiesInterval = setInterval(moveEnemies, 100);

        if (lifes === 0) {
            clearInterval(moveEnemiesInterval);
            clearInterval(bulletInterval);
            clearInterval(enemyInterval);
            boardRef.current!.style.animation = 'none';
        }

        return () => {
            clearInterval(bulletInterval);
            clearInterval(enemyInterval);
            clearInterval(moveEnemiesInterval);
        };
    }, [lifes]);





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
                    return false; // Return false to remove the enemy from the updatedEnemies array
                }
                return true; // Return true to keep the enemy in the updatedEnemies array
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
            setEnemies(prevEnemies => [...prevEnemies, enemy]);
        }
    }

    const moveEnemies = () => {
        setEnemies(prevEnemies => {
            const updatedEnemies: HTMLDivElement[] = [];
            prevEnemies.forEach(enemy => {
                const newTop = enemy.offsetTop + 5;
                enemy.style.top = `${newTop}px`;
                if (newTop < boardRef.current!.offsetHeight) {
                    updatedEnemies.push(enemy);
                } else {
                    enemy.remove();
                    setLifes(prevLifes => prevLifes - 1)
                }
            });
            return updatedEnemies;
        });
    };

    const showLifes = () => {
        return Array(lifes).fill(null).map((_, index) => (
            <div className="life" key={index}></div>
        ));
    }

    return (
        <div>
            <h1>Space defender</h1>
            <div ref={boardRef} id='game-board'>
                <div ref={playerRef} id="player"></div>
                <div className='points'>
                    <img src={scoreImage}></img>
                    <span>{score}</span>
                </div>
                <div id='lifes'>{showLifes()}</div>
                <div id='game-end' hidden={Boolean(lifes)}>
                    <h2>Koniec gry :(</h2>
                    Kosmiczne statki przedostały się na Ziemię...
                    <br/><br/>
                    <button className='button' onClick={() => {}}>Zacznij od nowa</button>
                </div>
            </div>
        </div>

    )

}
