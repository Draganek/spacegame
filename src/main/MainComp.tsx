import { useEffect, useRef } from 'react'
import './MainComp.css'

export const MainComp = () => {
    const playerRef = useRef<HTMLDivElement>(null);
    const boardRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.addEventListener('keydown', handleMove);
    }, [])

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



    return (
        <div>
            <h1>Space defender</h1>
            <div ref={boardRef} id='game-board'>
                <div ref={playerRef} id="player"></div>
            </div>
        </div>

    )

}
