import { useState, useEffect } from "react";
import scoreImage from "../../img/coin.png"

export const Points = ({ score }: { score: number }) => {
    return (
        <div className='points'>
            <img src={scoreImage}></img>
            <span>{score}</span>
        </div>);
};

export const ShowLifes = ({ lifes }: { lifes: number }) => {
    return (
        <div id='lifes'>
            {Array(lifes).fill(null).map((_, index) => (
                <div className="life" key={index}></div>
            ))}
        </div>
    );
};

export const LevelShow = ({ gameStarted, newLevel, level }: { gameStarted: boolean, newLevel: boolean, level: number }) => {
    const [showLevel, setShowLevel] = useState<boolean>(false);

    useEffect(() => {
        if (gameStarted || newLevel) {
            setShowLevel(true);
            const timeout = setTimeout(() => {
                setShowLevel(false);
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [gameStarted, level])

    return (
        <div className='level' hidden={!showLevel}>
            <span>Poziom {level}</span>
        </div>
    )
}
