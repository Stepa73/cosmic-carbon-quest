import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GalaxyView } from './game/GalaxyView';
import { TelescopeView } from './game/TelescopeView';
import { RocketView } from './game/RocketView';
import { MarketView } from './game/MarketView';
import { UpgradesView } from './game/UpgradesView';
import { GameState, Sector, Rocket } from '@/types/game';
import { generateInitialSectors, generateInitialRockets } from '@/utils/gameData';
import { saveGameState, loadGameState, clearGameState, hasSavedGame } from '@/utils/storage';

export const SpaceGame = () => {
  const [gameState, setGameState] = useState<GameState>(() => {
    // Try to load saved game state, otherwise use initial state
    const savedState = loadGameState();
    if (savedState) {
      return savedState;
    }
    
    // Initial game state
    return {
      carbon: 0,
      energy: 100,
      credits: 1000,
      telescope: {
        range: 1,
        accuracy: 60,
        scanning: false,
        scanProgress: 0,
      },
      rockets: generateInitialRockets(),
      sectors: generateInitialSectors(),
      telescopeUpgrades: [],
      rocketUpgrades: [],
      currentView: 'galaxy',
      scanningX: 0,
      scanningY: 0,
      carbonPrice: 10,
      priceHistory: [10, 9, 11, 10, 12],
    };
  });

  const [previousState, setPreviousState] = useState<GameState | null>(null);

  // Auto-save game state whenever it changes
  useEffect(() => {
    // Save game state
    saveGameState(gameState);
    setPreviousState(gameState);
  }, [gameState, previousState]);

  // Game loop for missions and energy regeneration
  useEffect(() => {
    const gameLoop = setInterval(() => {
      setGameState(prev => {
        const newState = { ...prev };
        
        // Regenerate energy slowly
        if (newState.energy < 100) {
          newState.energy = Math.min(100, newState.energy + 1);
        }

        // Update rocket missions
        newState.rockets = newState.rockets.map(rocket => {
          if (rocket.launched && rocket.missionProgress < 100) {
            // Consume fuel during mission
            const fuelConsumption = Math.max(1, Math.floor(rocket.maxFuel / 20)); // Consume fuel over 5 seconds
            const newFuel = Math.max(0, rocket.fuel - fuelConsumption);
            
            return {
              ...rocket,
              missionProgress: Math.min(100, rocket.missionProgress + 20),
              fuel: newFuel
            };
          }
          return rocket;
        });

        // Update carbon price slowly
        if (Math.random() < 0.1) {
          const priceChange = (Math.random() - 0.5) * 2;
          newState.carbonPrice = Math.max(5, Math.min(20, newState.carbonPrice + priceChange));
          newState.priceHistory = [...newState.priceHistory.slice(-9), newState.carbonPrice];
        }

        return newState;
      });
    }, 1000);

    return () => clearInterval(gameLoop);
  }, []);

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const handleResetGame = () => {
    if (window.confirm('Are you sure you want to reset your progress? This cannot be undone.')) {
      clearGameState();
      // Reset to initial state immediately
      setGameState({
        carbon: 0,
        energy: 100,
        credits: 1000,
        telescope: {
          range: 1,
          accuracy: 60,
          scanning: false,
          scanProgress: 0,
        },
        rockets: generateInitialRockets(),
        sectors: generateInitialSectors(),
        telescopeUpgrades: [],
        rocketUpgrades: [],
        currentView: 'galaxy',
        scanningX: 0,
        scanningY: 0,
        carbonPrice: 10,
        priceHistory: [10, 9, 11, 10, 12],
      });
    }
  };

  const ResourceBar = () => (
    <div className="flex gap-6 items-center p-4 glass-effect rounded-lg">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-carbon-glow rounded-full animate-carbon-sparkle"></div>
        <span className="text-foreground font-mono">{Math.floor(gameState.carbon)} Carbon</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-energy-core rounded-full animate-pulse-glow"></div>
        <span className="text-foreground font-mono">{Math.floor(gameState.energy)}/100 Energy</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-scanner-beam rounded-full animate-pulse"></div>
        <span className="text-foreground font-mono">{Math.floor(gameState.credits)} Credits</span>
      </div>
      <div className="ml-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={handleResetGame}
          className="text-destructive hover:text-destructive-foreground"
        >
          🔄 Reset Game
        </Button>
      </div>
    </div>
  );

  const NavigationBar = () => (
    <div className="flex gap-2 p-4 glass-effect rounded-lg">
      <Button 
        variant={gameState.currentView === 'galaxy' ? 'default' : 'secondary'}
        onClick={() => updateGameState({ currentView: 'galaxy' })}
        className="flex items-center gap-2 hover:glow-cosmic transition-all duration-300"
      >
        🌌 Galaxy
      </Button>

      <Button 
        variant={gameState.currentView === 'market' ? 'default' : 'secondary'}
        onClick={() => updateGameState({ currentView: 'market' })}
        className="flex items-center gap-2 hover:glow-cosmic transition-all duration-300"
      >
        💰 Market
      </Button>
      <Button 
        variant={gameState.currentView === 'upgrades' ? 'default' : 'secondary'}
        onClick={() => updateGameState({ currentView: 'upgrades' })}
        className="flex items-center gap-2 hover:glow-cosmic transition-all duration-300"
      >
        ⚡ Upgrades
      </Button>
    </div>
  );

  const renderCurrentView = () => {
    const handleNavigate = (view: string) => {
      updateGameState({ currentView: view as any });
    };

    switch (gameState.currentView) {
      case 'galaxy':
        return <GalaxyView gameState={gameState} updateGameState={updateGameState} onNavigate={handleNavigate} />;

      case 'market':
        return <MarketView gameState={gameState} updateGameState={updateGameState} />;
      case 'upgrades':
        return <UpgradesView gameState={gameState} updateGameState={updateGameState} />;
      default:
        return <GalaxyView gameState={gameState} updateGameState={updateGameState} onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-void via-space-deep to-space-nebula nebula-bg">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gradient-cosmic mb-2 text-center">
            🌌 Deep Space Carbon Explorer
            {hasSavedGame() && (
              <span className="text-sm text-muted-foreground block mt-2">
                💾 Saved Game Loaded
              </span>
            )}
          </h1>
          <p className="text-muted-foreground text-center">
            Scan, mine, and prosper in the vast cosmos
          </p>
        </div>
        
        <ResourceBar />
        <NavigationBar />
        
        <div className="mt-6">
          {renderCurrentView()}
        </div>
      </div>
    </div>
  );
};