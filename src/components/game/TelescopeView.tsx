import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GameState } from '@/types/game';
import { calculateScanAccuracy } from '@/utils/gameData';

interface TelescopeViewProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export const TelescopeView: React.FC<TelescopeViewProps> = ({ gameState, updateGameState }) => {
  const [scanTargetX, setScanTargetX] = useState(0);
  const [scanTargetY, setScanTargetY] = useState(0);

  const startScan = () => {
    if (gameState.energy < 20 || gameState.telescope.scanning) return;

    // Start scanning
    updateGameState({
      energy: gameState.energy - 20,
      telescope: {
        ...gameState.telescope,
        scanning: true,
        scanProgress: 0,
      },
      scanningX: scanTargetX,
      scanningY: scanTargetY,
    });

    // Complete scan after 3 seconds
    setTimeout(() => {
      const updatedSectors = gameState.sectors.map(sector => {
        const distance = Math.sqrt(
          Math.pow(sector.x - scanTargetX, 2) + 
          Math.pow(sector.y - scanTargetY, 2)
        );
        
        if (distance <= gameState.telescope.range) {
          const accuracy = calculateScanAccuracy(sector.depth, gameState.telescope.accuracy);
          const revealedDensity = sector.carbonDensity + (Math.random() - 0.5) * (100 - accuracy);
          
          return {
            ...sector,
            scanned: true,
            discovered: true,
            carbonDensity: Math.max(0, Math.min(100, revealedDensity)),
          };
        }
        return sector;
      });

      updateGameState({
        sectors: updatedSectors,
        telescope: {
          ...gameState.telescope,
          scanning: false,
          scanProgress: 100,
        },
      });

      // Reset progress after a moment
      setTimeout(() => {
        updateGameState({
          telescope: {
            ...gameState.telescope,
            scanProgress: 0,
          },
        });
      }, 1000);
    }, 3000);
  };

  const getScanPreview = () => {
    return gameState.sectors.filter(sector => {
      const distance = Math.sqrt(
        Math.pow(sector.x - scanTargetX, 2) + 
        Math.pow(sector.y - scanTargetY, 2)
      );
      return distance <= gameState.telescope.range;
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Deep Space Telescope</h2>
        <p className="text-muted-foreground mb-6">
          Use your telescope to scan sectors for carbon deposits. Higher accuracy reveals more precise data.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Telescope Status</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Range:</span>
                <span className="text-scanner-beam">{gameState.telescope.range} sectors</span>
              </div>
              <div className="flex justify-between">
                <span>Accuracy:</span>
                <span className="text-scanner-beam">{gameState.telescope.accuracy}%</span>
              </div>
              <div className="flex justify-between">
                <span>Energy Cost:</span>
                <span className="text-energy-core">20 per scan</span>
              </div>
            </div>

            {gameState.telescope.scanning && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Scanning Progress:</span>
                  <span>{Math.floor(gameState.telescope.scanProgress)}%</span>
                </div>
                <Progress value={gameState.telescope.scanProgress} className="w-full" />
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Scan Target</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">X Coordinate</label>
                <input
                  type="number"
                  value={scanTargetX}
                  onChange={(e) => setScanTargetX(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
                  min="-10"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Y Coordinate</label>
                <input
                  type="number"
                  value={scanTargetY}
                  onChange={(e) => setScanTargetY(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground"
                  min="-10"
                  max="10"
                />
              </div>
              <Button
                onClick={startScan}
                disabled={gameState.energy < 20 || gameState.telescope.scanning}
                className="w-full"
              >
                {gameState.telescope.scanning ? 'Scanning...' : 'Start Scan'}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Scan Preview</h3>
        <p className="text-muted-foreground mb-4">
          Preview of sectors that will be scanned at coordinates ({scanTargetX}, {scanTargetY})
        </p>
        
        <div className="grid grid-cols-10 gap-1 max-w-md mx-auto">
          {Array.from({ length: 100 }, (_, i) => {
            const x = (i % 10) - 5 + scanTargetX;
            const y = Math.floor(i / 10) - 5 + scanTargetY;
            const distance = Math.sqrt(Math.pow(x - scanTargetX, 2) + Math.pow(y - scanTargetY, 2));
            const inRange = distance <= gameState.telescope.range;
            const sector = gameState.sectors.find(s => s.x === x && s.y === y);
            
            return (
              <div
                key={i}
                className={`w-6 h-6 border border-border/20 rounded-sm ${
                  inRange 
                    ? 'bg-scanner-beam/40 animate-pulse-glow' 
                    : sector?.discovered 
                      ? 'bg-space-deep' 
                      : 'bg-space-void'
                }`}
                title={`${x},${y} ${inRange ? '(Will scan)' : ''}`}
              />
            );
          })}
        </div>

        <div className="mt-4 text-center text-sm text-muted-foreground">
          Scan range: {gameState.telescope.range} sectors | {getScanPreview().length} sectors will be scanned
        </div>
      </Card>
    </div>
  );
};