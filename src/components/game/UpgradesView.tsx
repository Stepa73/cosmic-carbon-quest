import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameState } from '@/types/game';

interface UpgradesViewProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export const UpgradesView: React.FC<UpgradesViewProps> = ({ gameState, updateGameState }) => {
  const telescopeUpgrades = [
    {
      id: 'range-1',
      name: 'Extended Range Array',
      description: 'Increase scanning range by 1 sector',
      cost: 500,
      effect: 'Range +1',
      canPurchase: gameState.telescope.range < 6,
    },
    {
      id: 'accuracy-1',
      name: 'Quantum Sensors',
      description: 'Improve scanning accuracy by 10%',
      cost: 750,
      effect: 'Accuracy +10%',
      canPurchase: gameState.telescope.accuracy < 90,
    },
    {
      id: 'efficiency-1',
      name: 'Energy Optimizer',
      description: 'Reduce scanning energy cost by 5',
      cost: 600,
      effect: 'Energy -5 per scan',
      canPurchase: true,
    },
  ];

  const rocketUpgrades = [
    {
      id: 'fuel-1',
      name: 'Advanced Fuel Tanks',
      description: 'Increase fuel capacity for all rockets',
      cost: 800,
      effect: '+20 Fuel Capacity',
      canPurchase: true,
    },
    {
      id: 'cargo-1',
      name: 'Expanded Cargo Hold',
      description: 'Increase carbon storage capacity',
      cost: 700,
      effect: '+25 Cargo Capacity',
      canPurchase: true,
    },
    {
      id: 'drill-1',
      name: 'Quantum Drill Matrix',
      description: 'Improve extraction efficiency',
      cost: 1000,
      effect: '+1 Drill Power',
      canPurchase: true,
    },
  ];

  const stationUpgrades = [
    {
      id: 'energy-1',
      name: 'Fusion Reactor',
      description: 'Increase maximum energy capacity',
      cost: 1200,
      effect: '+50 Max Energy',
      canPurchase: true,
    },
    {
      id: 'automation-1',
      name: 'Auto-Mining Protocols',
      description: 'Rockets continue mining automatically',
      cost: 2000,
      effect: 'Auto-mining enabled',
      canPurchase: true,
    },
    {
      id: 'fleet-1',
      name: 'Rocket Assembly Bay',
      description: 'Build additional rockets',
      cost: 1500,
      effect: '+1 Rocket',
      canPurchase: gameState.rockets.length < 5,
    },
  ];

  const purchaseUpgrade = (upgradeId: string, cost: number, type: 'telescope' | 'rocket' | 'station') => {
    if (gameState.credits < cost) return;

    let updates: Partial<GameState> = {
      credits: gameState.credits - cost,
    };

    switch (upgradeId) {
      case 'range-1':
        updates.telescope = {
          ...gameState.telescope,
          range: gameState.telescope.range + 1,
        };
        break;
      case 'accuracy-1':
        updates.telescope = {
          ...gameState.telescope,
          accuracy: gameState.telescope.accuracy + 10,
        };
        break;
      case 'fuel-1':
        updates.rockets = gameState.rockets.map(rocket => ({
          ...rocket,
          maxFuel: rocket.maxFuel + 20,
          fuel: rocket.fuel + 20,
        }));
        break;
      case 'cargo-1':
        updates.rockets = gameState.rockets.map(rocket => ({
          ...rocket,
          maxCargo: rocket.maxCargo + 25,
        }));
        break;
      case 'drill-1':
        updates.rockets = gameState.rockets.map(rocket => ({
          ...rocket,
          drillPower: rocket.drillPower + 1,
        }));
        break;
      case 'fleet-1':
        const newRocket = {
          id: `rocket-${gameState.rockets.length + 1}`,
          name: `Pioneer ${gameState.rockets.length + 1}`,
          fuel: 100,
          maxFuel: 100,
          cargo: 0,
          maxCargo: 50,
          drillPower: 1,
          launched: false,
          missionProgress: 0,
        };
        updates.rockets = [...gameState.rockets, newRocket];
        break;
    }

    updateGameState(updates);
  };

  const UpgradeCard = ({ upgrade, type }: { upgrade: any; type: 'telescope' | 'rocket' | 'station' }) => (
    <Card className="p-4 bg-secondary">
      <div className="flex justify-between items-start mb-3">
        <h4 className="font-semibold text-foreground">{upgrade.name}</h4>
        <div className="text-right">
          <div className="text-scanner-beam font-mono">{upgrade.cost} credits</div>
          <div className="text-xs text-carbon-glow">{upgrade.effect}</div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">{upgrade.description}</p>
      
      <Button
        onClick={() => purchaseUpgrade(upgrade.id, upgrade.cost, type)}
        disabled={!upgrade.canPurchase || gameState.credits < upgrade.cost}
        className="w-full"
        variant={gameState.credits >= upgrade.cost && upgrade.canPurchase ? 'default' : 'outline'}
      >
        {!upgrade.canPurchase ? 'Max Level' : 
         gameState.credits < upgrade.cost ? 'Insufficient Credits' : 'Purchase'}
      </Button>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Technology Upgrades</h2>
        <p className="text-muted-foreground mb-6">
          Invest in advanced technology to improve your scanning, mining, and operational efficiency.
        </p>

        <div className="grid gap-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              🔭 Telescope Systems
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {telescopeUpgrades.map(upgrade => (
                <UpgradeCard key={upgrade.id} upgrade={upgrade} type="telescope" />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              🚀 Rocket Technology
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rocketUpgrades.map(upgrade => (
                <UpgradeCard key={upgrade.id} upgrade={upgrade} type="rocket" />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              🏭 Station Infrastructure
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stationUpgrades.map(upgrade => (
                <UpgradeCard key={upgrade.id} upgrade={upgrade} type="station" />
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Current Status</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-semibold">Telescope</h4>
            <div>Range: {gameState.telescope.range} sectors</div>
            <div>Accuracy: {gameState.telescope.accuracy}%</div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Fleet</h4>
            <div>Active Rockets: {gameState.rockets.length}</div>
            <div>Average Drill Power: {(gameState.rockets.reduce((sum, r) => sum + r.drillPower, 0) / gameState.rockets.length).toFixed(1)}</div>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Resources</h4>
            <div>Credits: {Math.floor(gameState.credits)}</div>
            <div>Energy: {Math.floor(gameState.energy)}/100</div>
          </div>
        </div>
      </Card>
    </div>
  );
};