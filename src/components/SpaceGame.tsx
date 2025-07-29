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

export const SpaceGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    carbon: 0,
    energy: 100,
    credits: 1000,
    telescope: {
      range: 3,
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
            return {
              ...rocket,
              missionProgress: Math.min(100, rocket.missionProgress + 2)
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

  const ResourceBar = () => (
    <div className="flex gap-6 items-center p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-carbon-glow rounded-full animate-carbon-sparkle"></div>
        <span className="text-foreground font-mono">{Math.floor(gameState.carbon)} Carbon</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-energy-core rounded-full animate-pulse-glow"></div>
        <span className="text-foreground font-mono">{Math.floor(gameState.energy)}/100 Energy</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 bg-scanner-beam rounded-full"></div>
        <span className="text-foreground font-mono">{Math.floor(gameState.credits)} Credits</span>
      </div>
    </div>
  );

  const NavigationBar = () => (
    <div className="flex gap-2 p-4">
      <Button 
        variant={gameState.currentView === 'galaxy' ? 'default' : 'secondary'}
        onClick={() => updateGameState({ currentView: 'galaxy' })}
        className="flex items-center gap-2"
      >
        🌌 Galaxy
      </Button>
      <Button 
        variant={gameState.currentView === 'telescope' ? 'default' : 'secondary'}
        onClick={() => updateGameState({ currentView: 'telescope' })}
        className="flex items-center gap-2"
      >
        🔭 Telescope
      </Button>
      <Button 
        variant={gameState.currentView === 'rockets' ? 'default' : 'secondary'}
        onClick={() => updateGameState({ currentView: 'rockets' })}
        className="flex items-center gap-2"
      >
        🚀 Rockets
      </Button>
      <Button 
        variant={gameState.currentView === 'market' ? 'default' : 'secondary'}
        onClick={() => updateGameState({ currentView: 'market' })}
        className="flex items-center gap-2"
      >
        💰 Market
      </Button>
      <Button 
        variant={gameState.currentView === 'upgrades' ? 'default' : 'secondary'}
        onClick={() => updateGameState({ currentView: 'upgrades' })}
        className="flex items-center gap-2"
      >
        ⚡ Upgrades
      </Button>
    </div>
  );

  const renderCurrentView = () => {
    switch (gameState.currentView) {
      case 'galaxy':
        return <GalaxyView gameState={gameState} updateGameState={updateGameState} />;
      case 'telescope':
        return <TelescopeView gameState={gameState} updateGameState={updateGameState} />;
      case 'rockets':
        return <RocketView gameState={gameState} updateGameState={updateGameState} />;
      case 'market':
        return <MarketView gameState={gameState} updateGameState={updateGameState} />;
      case 'upgrades':
        return <UpgradesView gameState={gameState} updateGameState={updateGameState} />;
      default:
        return <GalaxyView gameState={gameState} updateGameState={updateGameState} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-void via-space-deep to-space-nebula">
      <div className="container mx-auto p-4">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-foreground mb-2 text-center">
            Deep Space Carbon Explorer
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