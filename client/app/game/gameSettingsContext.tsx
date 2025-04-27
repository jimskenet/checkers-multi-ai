import React, { createContext, useContext, useState } from 'react';

export type GameMode = 'singleplayer' | 'multiplayer';
export type PlayerColor = 'WHITE' | 'BLACK';
export type Difficulty = 'easy' | 'medium' | 'hard';

interface GameSettings {
  gameMode: GameMode;
  playerColor: PlayerColor;
  difficulty: Difficulty;
}

interface GameSettingsContextType extends GameSettings {
  setGameSettings: (mode: GameMode, color: PlayerColor, difficulty?: Difficulty) => void;
  resetGameSettings: () => void;
}

const GameSettingsContext = createContext<GameSettingsContextType | undefined>(undefined);

export function GameSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>({
    gameMode: 'singleplayer',
    playerColor: 'WHITE',
    difficulty: 'medium'
  });

  const updateGameSettings = (mode: GameMode, color: PlayerColor, difficulty?: Difficulty) => {
    setSettings({ 
      gameMode: mode, 
      playerColor: color,
      difficulty: difficulty || settings.difficulty 
    });
    console.log('Game settings updated:', { mode, color, difficulty });
  };

  const resetGameSettings = () => {
    setSettings({ gameMode: 'singleplayer', playerColor: 'WHITE', difficulty: 'medium' });
  };

  return (
    <GameSettingsContext.Provider 
      value={{
        ...settings,
        setGameSettings: updateGameSettings,
        resetGameSettings
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