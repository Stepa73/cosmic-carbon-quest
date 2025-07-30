import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameState, Rocket } from '@/types/game';

interface RocketViewProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export const RocketView: React.FC<RocketViewProps> = ({ gameState, updateGameState }) => {
  const launchRocket = (rocketId: string, targetSectorId: string) => {
    const rocket = gameState.rockets.find(r => r.id === rocketId);
    const sector = gameState.sectors.find(s => s.id === targetSectorId);
    
    if (!rocket || !sector || rocket.launched) return;
    
    // Check if rocket has enough fuel
    if (rocket.fuel < 20) {
      alert('Not enough fuel! Rocket needs at least 20 fuel to launch.');
      return;
    }

    const updatedRockets = gameState.rockets.map(r =>
      r.id === rocketId
        ? { 
            ...r, 
            launched: true, 
            targetSector: targetSectorId, 
            missionProgress: 0,
            fuel: r.fuel - 20 // Consume fuel on launch
          }
        : r
    );

    const updatedSectors = gameState.sectors.map(s =>
      s.id === targetSectorId ? { ...s, mining: true, marked: false } : s
    );

    updateGameState({ 
      rockets: updatedRockets, 
      sectors: updatedSectors,
      energy: gameState.energy - 30 
    });
  };

  const recallRocket = (rocketId: string) => {
    const rocket = gameState.rockets.find(r => r.id === rocketId);
    if (!rocket || !rocket.launched) return;

    const sector = gameState.sectors.find(s => s.id === rocket.targetSector);
    if (sector) {
      // Calculate carbon collected
      const carbonCollected = (rocket.missionProgress / 100) * sector.carbonDensity * rocket.drillPower;
      
      const updatedRockets = gameState.rockets.map(r =>
        r.id === rocketId
          ? { 
              ...r, 
              launched: false, 
              targetSector: undefined, 
              missionProgress: 0, 
              cargo: Math.min(r.maxCargo, carbonCollected),
              fuel: Math.max(0, r.fuel) // Keep remaining fuel
            }
          : r
      );

      const updatedSectors = gameState.sectors.map(s =>
        s.id === rocket.targetSector ? { 
          ...s, 
          mining: false, 
          mined: true,
          carbonDensity: Math.max(0, s.carbonDensity - 30) // Reduce carbon by 30%
        } : s
      );

      updateGameState({ 
        rockets: updatedRockets, 
        sectors: updatedSectors,
        carbon: gameState.carbon + carbonCollected 
      });
    }
  };

  const refuelRocket = (rocketId: string) => {
    const rocket = gameState.rockets.find(r => r.id === rocketId);
    if (!rocket || rocket.launched) return;
    
    const fuelCost = 50; // Cost to refuel
    if (gameState.credits < fuelCost) {
      alert('Not enough credits to refuel!');
      return;
    }
    
    const fuelToAdd = rocket.maxFuel - rocket.fuel;
    if (fuelToAdd <= 0) {
      alert('Rocket is already fully fueled!');
      return;
    }

    const updatedRockets = gameState.rockets.map(r =>
      r.id === rocketId
        ? { ...r, fuel: r.maxFuel }
        : r
    );

    updateGameState({ 
      rockets: updatedRockets,
      credits: gameState.credits - fuelCost
    });
  };

  const unloadRocket = (rocketId: string) => {
    const rocket = gameState.rockets.find(r => r.id === rocketId);
    if (!rocket || rocket.cargo === 0) return;

    const updatedRockets = gameState.rockets.map(r =>
      r.id === rocketId ? { ...r, cargo: 0 } : r
    );

    updateGameState({ 
      rockets: updatedRockets,
      carbon: gameState.carbon + rocket.cargo 
    });
  };

  const markedSectors = gameState.sectors.filter(s => s.marked);
  const availableRockets = gameState.rockets.filter(r => !r.launched);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Rocket Fleet</h2>
        <p className="text-muted-foreground mb-6">
          Manage your rockets, launch mining missions, and collect carbon from marked sectors.
        </p>

        <div className="grid gap-4">
          {gameState.rockets.map(rocket => (
            <Card key={rocket.id} className="p-4 bg-secondary">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">{rocket.name}</h3>
                <div className="flex items-center gap-2">
                  {rocket.launched ? (
                    <span className="text-rocket-flame animate-pulse-glow">🚀 Active Mission</span>
                  ) : (
                    <span className="text-scanner-beam">🛸 Ready</span>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-muted-foreground">Fuel</div>
                  <div className="text-energy-core font-mono">{rocket.fuel}/{rocket.maxFuel}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Cargo</div>
                  <div className="text-carbon-glow font-mono">{Math.floor(rocket.cargo)}/{rocket.maxCargo}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Drill Power</div>
                  <div className="text-scanner-beam font-mono">{rocket.drillPower}x</div>
                </div>
              </div>

              {rocket.launched && (
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Mission Progress</span>
                    <span>{Math.floor(rocket.missionProgress)}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${rocket.missionProgress}%` }}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Target: Sector {rocket.targetSector}
                  </div>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {!rocket.launched && rocket.cargo > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => unloadRocket(rocket.id)}
                  >
                    Unload Cargo
                  </Button>
                )}
                
                {!rocket.launched && rocket.fuel < rocket.maxFuel && (
                  <Button
                    variant="outline"
                    onClick={() => refuelRocket(rocket.id)}
                    className="text-energy-core"
                  >
                    ⛽ Refuel (50c)
                  </Button>
                )}
                
                {rocket.launched ? (
                  <Button
                    variant="outline"
                    onClick={() => recallRocket(rocket.id)}
                  >
                    Recall Rocket
                  </Button>
                ) : (
                  markedSectors.length > 0 && rocket.fuel >= 20 && (
                    <select
                      className="px-3 py-2 bg-input border border-border rounded-md text-foreground mr-2"
                      onChange={(e) => e.target.value && launchRocket(rocket.id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="">Select target...</option>
                      {markedSectors.map(sector => (
                        <option key={sector.id} value={sector.id}>
                          Sector {sector.x},{sector.y} ({Math.floor(sector.carbonDensity)}% carbon)
                        </option>
                      ))}
                    </select>
                  )
                )}
              </div>
            </Card>
          ))}
        </div>

        {markedSectors.length === 0 && availableRockets.length > 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No sectors marked for mining. Visit the Galaxy view to mark sectors after scanning.
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Mission Planning</h3>
        <div className="space-y-3">
          <div className="text-sm">
            <strong>Available Rockets:</strong> {availableRockets.length}
          </div>
          <div className="text-sm">
            <strong>Active Missions:</strong> {gameState.rockets.filter(r => r.launched).length}
          </div>
          <div className="text-sm">
            <strong>Marked Sectors:</strong> {markedSectors.length}
          </div>
          <div className="text-sm text-muted-foreground">
            Launch cost: 30 energy per mission
          </div>
        </div>
      </Card>
    </div>
  );
};