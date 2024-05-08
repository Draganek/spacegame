import { RefObject } from 'react';

export const PlayerMove = (e: TouchEvent, boardRef: RefObject<HTMLDivElement>, playerRef: RefObject<HTMLDivElement> ) => {
    e.preventDefault();
    const touch = e.touches[0];
    if (touch.clientY > boardRef.current!.offsetHeight || touch.clientY - playerRef.current!.offsetHeight < 0 || touch.clientX > boardRef.current!.offsetWidth || touch.clientX < 0) {
    }
    else {
        return({ x: `${touch.clientX}px`, y: `${-touch.clientY + boardRef.current!.offsetHeight}px` });
    }
};
