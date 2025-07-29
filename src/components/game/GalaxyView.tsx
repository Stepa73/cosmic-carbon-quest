import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameState } from '@/types/game';

interface GalaxyViewProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export const GalaxyView: React.FC<GalaxyViewProps> = ({ gameState, updateGameState }) => {
  const handleSectorClick = (sectorX: number, sectorY: number) => {
    const sector = gameState.sectors.find(s => s.x === sectorX && s.y === sectorY);
    
    // If sector doesn't exist or isn't discovered, scan it
    if (!sector || !sector.discovered) {
      if (gameState.energy < 10) return; // Not enough energy
      
      updateGameState({
        energy: gameState.energy - 10,
        scanningX: sectorX,
        scanningY: sectorY,
        telescope: { ...gameState.telescope, scanning: true, scanProgress: 0 }
      });
      
      // Simulate scanning
      setTimeout(() => {
        const distance = Math.max(Math.abs(sectorX), Math.abs(sectorY));
        const accuracy = Math.max(0.3, gameState.telescope.accuracy / 100 - distance * 0.05);
        const actualDensity = Math.random() * 100;
        const measuredDensity = actualDensity + (Math.random() - 0.5) * (100 - accuracy * 100);
        
        const newSector = {
          id: `${sectorX},${sectorY}`,
          x: sectorX,
          y: sectorY,
          carbonDensity: Math.max(0, Math.min(100, measuredDensity)),
          scanned: true,
          marked: false,
          mining: false,
          depth: Math.random() * 100,
          discovered: true
        };
        
        const updatedSectors = sector 
          ? gameState.sectors.map(s => s.id === newSector.id ? newSector : s)
          : [...gameState.sectors, newSector];
        
        updateGameState({
          sectors: updatedSectors,
          telescope: { ...gameState.telescope, scanning: false, scanProgress: 100 }
        });
      }, 2000);
      
      return;
    }
    
    // If sector is scanned, toggle marking
    if (sector.scanned) {
      const updatedSectors = gameState.sectors.map(s => 
        s.id === sector.id ? { ...s, marked: !s.marked } : s
      );
      updateGameState({ sectors: updatedSectors });
    }
  };

  const getSectorColor = (sector: any) => {
    if (!sector.discovered) return 'bg-space-void';
    if (!sector.scanned) return 'bg-space-deep';
    if (sector.mining) return 'bg-rocket-flame';
    if (sector.marked) return 'bg-energy-core';
    
    const intensity = Math.floor(sector.carbonDensity / 25);
    const colors = [
      'bg-space-nebula',
      'bg-scanner-beam/30',
      'bg-scanner-beam/60',
      'bg-carbon-glow/60',
      'bg-carbon-glow'
    ];
    return colors[intensity] || 'bg-space-nebula';
  };

  const visibleSectors = gameState.sectors.filter(s => 
    Math.abs(s.x) <= gameState.telescope.range && 
    Math.abs(s.y) <= gameState.telescope.range
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Galaxy Map</h2>
            <p className="text-muted-foreground">
              Click on tiles to scan or mark them for mining. Brighter areas indicate higher carbon density.
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Energy: {gameState.energy}/100</div>
            <div className="text-sm text-muted-foreground">Scan Cost: 10 Energy</div>
            {gameState.telescope.scanning && (
              <div className="text-scanner-beam animate-pulse">Scanning...</div>
            )}
          </div>
        </div>
        
        <div className="grid gap-1 max-w-4xl mx-auto" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}>
          {Array.from({ length: 15 }, (_, y) => 
            Array.from({ length: 15 }, (_, x) => {
              const sectorX = x - 7;
              const sectorY = 7 - y;
              const sector = visibleSectors.find(s => s.x === sectorX && s.y === sectorY);
              const isScanning = gameState.telescope.scanning && gameState.scanningX === sectorX && gameState.scanningY === sectorY;
              
              return (
                <button
                  key={`${sectorX},${sectorY}`}
                  className={`w-6 h-6 border border-border/20 rounded-sm transition-all duration-300 hover:scale-110 ${
                    isScanning ? 'bg-scanner-beam animate-pulse' :
                    sector ? getSectorColor(sector) : 'bg-space-void'
                  } ${sector?.marked ? 'ring-2 ring-energy-core' : ''}`}
                  onClick={() => handleSectorClick(sectorX, sectorY)}
                  title={
                    isScanning ? 'Scanning...' :
                    sector ? `Sector ${sector.x},${sector.y} - Carbon: ${Math.floor(sector.carbonDensity)}%` : 
                    'Click to scan'
                  }
                />
              );
            })
          )}
        </div>

        <div className="mt-6 flex justify-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-space-void border border-border/20"></div>
            <span>Unknown</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-space-deep border border-border/20"></div>
            <span>Discovered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-carbon-glow border border-border/20"></div>
            <span>High Carbon</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-energy-core border border-border/20"></div>
            <span>Marked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-rocket-flame border border-border/20"></div>
            <span>Mining</span>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Marked Sectors</h3>
        <div className="space-y-2">
          {gameState.sectors.filter(s => s.marked).map(sector => (
            <div key={sector.id} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
              <div>
                <span className="font-mono">Sector {sector.x},{sector.y}</span>
                <span className="ml-4 text-carbon-glow">Carbon: {Math.floor(sector.carbonDensity)}%</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => updateGameState({ currentView: 'rockets' })}
              >
                Launch Mission
              </Button>
            </div>
          ))}
          {gameState.sectors.filter(s => s.marked).length === 0 && (
            <p className="text-muted-foreground text-center py-4">
              No sectors marked for mining. Use the telescope to scan and mark profitable areas.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};