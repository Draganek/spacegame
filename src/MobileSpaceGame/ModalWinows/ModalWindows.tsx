import { RefObject, Dispatch, SetStateAction } from 'react';
const soundLevelWin = require('../sounds/level_win.wav');
const soundNextLevel = require('../sounds/next_level.wav');
const soundGameLose = require('../sounds/game_lose.wav');



export const GameLose = ({ lifes, reset, level, record }: { lifes: number; reset: () => void; level: number; record: number }) => {
    if(!lifes) {
        let file = new Howl({
            src: [soundGameLose]
        });
        file.play();
    }
    return (
        <div id='game-end' className='card' hidden={Boolean(lifes)}>
            <h2>Koniec gry :(</h2>
            <h4>Udało ci się dojść do {level} poziomu! (Rekord: {record})</h4>
            Kosmiczne statki przedostały się na Ziemię...
            <br /><br />
            <button className='button' onClick={reset}>Zacznij od nowa</button>
        </div>
    )
}
export const StartMenu = ({ gameStarted, reset, record }: { gameStarted: boolean; reset: () => void; record: number }) => {
    return (
        <div id='game-start' className='card' hidden={gameStarted}>
            <h2>Zostań obrońcą ziemi!</h2>
            Nie pozwól, aby kosmiczne statki przedostały sie na Ziemię.
            <br /><br />
            <code>Poruszanie</code> - dotyk<br />
            <code>Strzał</code> - automatyczny<br />
            <br />
            <code>Twój rekord to: {record}</code>
            <br /> <br />
            <button className='button' onClick={reset}>Rozpocznij grę</button>
        </div>
    )
}
export const LevelWon = ({ newLevel, level, setLevel, setNewLevel, boardRef, playerRef, enemies, bullets }: { newLevel: boolean, level: number, setLevel: Dispatch<SetStateAction<number>>, boardRef: RefObject<HTMLDivElement>, playerRef: RefObject<HTMLDivElement>, setNewLevel: Dispatch<SetStateAction<boolean>>, enemies: HTMLDivElement[], bullets: HTMLDivElement[] }) => {
    if (newLevel) {
        let file = new Howl({
            src: [soundLevelWin]
        });
        file.play();
    }
    const playSound = () => {
        let file = new Howl({
            src: [soundNextLevel]
        });
        file.play();
    }
    const changeLevel = (setLevel: Dispatch<SetStateAction<number>>, boardRef: RefObject<HTMLDivElement>, playerRef: RefObject<HTMLDivElement>, setNewLevel: Dispatch<SetStateAction<boolean>>, enemies: HTMLDivElement[], bullets: HTMLDivElement[]) => {
        setLevel(oldLevel => (oldLevel + 1));
        setNewLevel(false);
        enemies.forEach(enemy => enemy.remove());
        bullets.forEach(bullet => bullet.remove())
        playerRef.current!.style.left = "50%";
        playerRef.current!.style.bottom = "0%";
        boardRef.current!.style.animation = 'moveBg 1.5s infinite linear';
    }
    return (
        <div className='card' hidden={!newLevel}>
            <h2>Udało ci się przejść poziom {level}!</h2>
            <br /><br />

            <button className='button' onClick={() => {
                changeLevel(setLevel, boardRef, playerRef, setNewLevel, enemies, bullets);
                playSound();
            }}>Następny poziom!</button>
        </div>
    )
}
