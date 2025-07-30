import { GameState } from '@/types/game';

const GAME_STORAGE_KEY = 'cosmic-carbon-quest-save';

export const saveGameState = (gameState: GameState): void => {
  try {
    localStorage.setItem(GAME_STORAGE_KEY, JSON.stringify(gameState));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

export const loadGameState = (): GameState | null => {
  try {
    const savedState = localStorage.getItem(GAME_STORAGE_KEY);
    if (savedState) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Failed to load game state:', error);
  }
  return null;
};

export const clearGameState = (): void => {
  try {
    localStorage.removeItem(GAME_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
};

export const hasSavedGame = (): boolean => {
  try {
    return localStorage.getItem(GAME_STORAGE_KEY) !== null;
  } catch (error) {
    console.error('Failed to check for saved game:', error);
    return false;
  }
}; 