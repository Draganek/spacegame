import React, { createContext, useContext, useState, ReactNode } from 'react';

const defaultGameStateContextValue: GameStateContextType = {
  gameState: {
    level: 1,
    lifes: 3,
    score: 0
  },
  setGameState: () => {} // Pusta funkcja aktualizująca stan, możesz ją zmienić w dowolnym momencie
};

const GameStateContext = createContext(defaultGameStateContextValue);

interface GameStateContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

export const useGameState = (): GameStateContextType => useContext(GameStateContext);

interface GameState {
  level: number;
  lifes: number;
  score: number;
}

interface GameStateProviderProps {
  children: ReactNode;
}

export const GameStateProvider = ({ children }: GameStateProviderProps) => {
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    lifes: 3,
    score: 0
  });

  const value: GameStateContextType = { gameState, setGameState };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
};
