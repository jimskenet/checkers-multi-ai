import React, { createContext, useContext, useState } from 'react';

export type GameMode = 'singleplayer' | 'multiplayer';
export type PlayerColor = 'WHITE' | 'BLACK';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type TurnDuration = 180 | 300 | 600; // in seconds (3, 5, 10 minutes)

interface GameSettings {
  gameMode: GameMode;
  playerColor: PlayerColor;
  difficulty: Difficulty ;
  turnDuration: TurnDuration | undefined;
}

interface GameSettingsContextType extends GameSettings {
  setGameSettings: (mode: GameMode, color: PlayerColor, turnDuration: TurnDuration | undefined, difficulty?: Difficulty) => void;
  resetGameSettings: () => void;
  clearGameSettings: () => void;
}

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

export function GameSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>({
    gameMode: 'singleplayer',
    playerColor: 'WHITE',
    difficulty: 'medium',
    turnDuration: undefined
  });

  const updateGameSettings = (mode: GameMode, color: PlayerColor, turnDuration: TurnDuration | undefined, difficulty?: Difficulty) => {
    setSettings({ 
      gameMode: mode, 
      playerColor: color,
      turnDuration: turnDuration,
      difficulty: difficulty || settings.difficulty 
    });
  };

  const resetGameSettings = () => {
    setSettings({ gameMode: 'singleplayer', playerColor: 'WHITE', turnDuration: undefined, difficulty: 'medium' });
  };

  const clearGameSettings = () => {
    setSettings({ gameMode: 'singleplayer', playerColor: 'WHITE', turnDuration: undefined, difficulty: 'medium' });
  };
  
  return (
    <GameSettingsContext.Provider 
      value={{
        ...settings,
        setGameSettings: updateGameSettings,
        resetGameSettings,
        clearGameSettings
      }}
    >
      {children}
    </GameSettingsContext.Provider>
  );
}

export function useGameSettings() {
  const context = useContext(GameSettingsContext);
  if (!context) {
    throw new Error('useGameSettings must be used within a GameSettingsProvider');
  }
  return context;
}

export default GameSettingsProvider;