import { useEffect, useRef, useState } from 'react'
import './PCSpaceGame.css'
import scoreImage from "../img/coin.png"

export const PCSpaceGame = () => {
    const [bullets, setBullets] = useState<HTMLDivElement[]>([]);
    const [enemies, setEnemies] = useState<HTMLDivElement[]>([]);
    const [level, setLevel] = useState<number>(1);
    const [lifes, setLifes] = useState<number>(3);
    const [score, setScore] = useState<number>(0);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [newLevel, setNewLevel] = useState<boolean>(false);
    const playerRef = useRef<HTMLDivElement>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.addEventListener('keydown', handleMove);
        const bulletInterval = setInterval(moveBullets, 50);
        const enemyInterval = setInterval(createEnemy, 1000 - 5 * level);
        const moveEnemiesInterval = setInterval(moveEnemies, 50 - 5 * level);

        if (lifes === 0 || !gameStarted || newLevel) {
            clearInterval(moveEnemiesInterval);
            clearInterval(bulletInterval);
            clearInterval(enemyInterval);
            boardRef.current!.style.animation = 'none';
            document.removeEventListener('keydown', handleMove)
        }

        return () => {
            clearInterval(bulletInterval);
            clearInterval(enemyInterval);
            clearInterval(moveEnemiesInterval);
            document.removeEventListener('keydown', handleMove)
        };
    }, [lifes, gameStarted, newLevel, level]);

    useEffect(() => {
        if (score >= 10 * level) {
            setNewLevel(true);
        }
    }, [score])

    const resetGame = () => {
        setGameStarted(true);
        setScore(0);
        setLifes(3);
        enemies.forEach(enemy => enemy.remove());
        bullets.forEach(bullet => bullet.remove())
        playerRef.current!.style.left = "50%";
        playerRef.current!.style.bottom = "0%";
        boardRef.current!.style.animation = 'moveBg 1.5s infinite linear';
    }

    const handleMove = (e: any) => {
        if (!playerRef.current || !boardRef.current) return;

        const playerElement = playerRef.current;
        const boardElement = boardRef.current;

        switch (e.code) {
            case 'Space': createBullet(playerElement, boardElement); break;
            case 'ArrowLeft': movePlayerX(playerElement, boardElement, -1); break;
            case 'ArrowRight': movePlayerX(playerElement, boardElement, 1); break;
            case 'ArrowUp': movePlayerY(playerElement, boardElement, -1); break;
            case 'ArrowDown': movePlayerY(playerElement, boardElement, 1); break;
        }
    }

    const createBullet = (playerElement: HTMLDivElement, boardElement: HTMLDivElement) => {
        const bullet = document.createElement('div');
        bullet.className = 'bullet';
        bullet.style.left = `${playerElement.offsetLeft}px`;
        bullet.style.top = `${playerElement.offsetTop}px`;
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

    const movePlayerX = (playerElement: HTMLDivElement, boardElement: HTMLDivElement, direction: number) => {
        const newPosition: number = playerElement.offsetLeft + direction * 10
        const { left, right } = boardElement.getBoundingClientRect();
        const minLeft = playerElement.offsetWidth / 2;
        const maxRight = right - left - minLeft;
        if (newPosition >= minLeft && newPosition < maxRight) {
            playerElement.style.left = `${newPosition}px`
        }
    }

    const movePlayerY = (playerElement: HTMLDivElement, boardElement: HTMLDivElement, direction: number) => {
        const newPosition: number = playerElement.offsetTop + direction * 10
        const maxTop = boardElement.offsetHeight - playerElement.offsetHeight;
        if (newPosition >= 0 && newPosition < maxTop) {
            playerElement.style.top = `${newPosition}px`
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
                const newTop = enemy.offsetTop + 2;
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

    const changeLevel = (level:number) => {
        setLevel(oldLevel => (oldLevel + level));
        setNewLevel(false);
        boardRef.current!.style.animation = 'moveBg 1.5s infinite linear';
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
                <div className='level' hidden={!gameStarted}>
                    <span>Poziom {level}</span>
                </div>
                <div id='lifes'>{showLifes()}</div>
                <div id='game-end' className='card' hidden={Boolean(lifes)}>
                    <h2>Koniec gry :(</h2>
                    Kosmiczne statki przedostały się na Ziemię...
                    <br /><br />
                    <button className='button' onClick={() => resetGame()}>Zacznij od nowa</button>
                </div>
                <div id='game-start' className='card' hidden={gameStarted}>
                    <h2>Zostań obrońcą ziemi!</h2>
                    Nie pozwól, aby kosmiczne statki przedostały sie na Ziemię.
                    <br /><br />
                    <code>Strzałki</code> - poruszanie<br />
                    <code>Spacja</code> - strzał<br />
                    <br /><br />
                    <button className='button' onClick={() => resetGame()}>Rozpocznij grę</button>
                </div>
                <div className='card' hidden={!newLevel}>
                    <h2>Udało ci się przejść poziom {level}!</h2>
                    <br /><br />
                    <button className='button' onClick={() => changeLevel(1)}>Następny poziom!</button>
                </div>
            </div>
        </div>
    )
}
