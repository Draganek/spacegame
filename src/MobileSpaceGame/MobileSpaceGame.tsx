import { useEffect, useRef, useState } from 'react'
import './MobileSpaceGame.css'
import scoreImage from "../img/coin.png"


export const MobileSpaceGame = () => {
    const [bullets, setBullets] = useState<HTMLDivElement[]>([]);
    const [enemies, setEnemies] = useState<HTMLDivElement[]>([]);
    const [level, setLevel] = useState<number>(1);
    const [lifes, setLifes] = useState<number>(3);
    const [score, setScore] = useState<number>(0);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [newLevel, setNewLevel] = useState<boolean>(false);
    const playerRef = useRef<HTMLDivElement>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    const [shipPosition, setShipPosition] = useState({ x: "50%", y: '0%' });

    useEffect(() => {
        const handleTouchMove = (e: TouchEvent) => {
            e.preventDefault();
            const touch = e.touches[0];
            if (touch.clientY > boardRef.current!.offsetHeight || touch.clientY - playerRef.current!.offsetHeight < 0 || touch.clientX > boardRef.current!.offsetWidth || touch.clientX < 0) {
            }
            else {
                setShipPosition({ x: `${touch.clientX}px`, y: `${-touch.clientY + boardRef.current!.offsetHeight}px` });
            }

        };

        window.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    return (
        <div>
            <div ref={boardRef} id='game-board-mobile'>
                <div
                    ref={playerRef}
                    id="player"
                    style={{
                        position: 'absolute',
                        left: shipPosition.x,
                        bottom: shipPosition.y,
                    }}>
                </div>
            </div>
        </div >
    )
}
