import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameState } from '@/types/game';
import { toast } from 'sonner';

interface GalaxyViewProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
  onNavigate?: (view: string) => void;
}

// Welcome message component for new players
const WelcomeMessage: React.FC<{ gameState: GameState }> = ({ gameState }) => {
  const discoveredSectors = gameState.sectors.filter(s => s.discovered).length;
  const hasProgress = discoveredSectors > 1 || gameState.carbon > 0 || gameState.credits > 1000;
  
  if (hasProgress) return null; // Don't show welcome message if there's progress
  
  return (
    <Card className="p-6 bg-gradient-to-br from-space-deep/50 to-space-nebula/50 border-border/30 backdrop-blur-sm mb-6">
      <div className="text-center">
        <div className="text-4xl mb-4">🚀</div>
        <h3 className="text-xl font-bold text-foreground mb-2">Welcome to Cosmic Carbon Quest!</h3>
        <p className="text-muted-foreground mb-4">
          You're at the center of your galaxy. Click on the unknown tiles (?) around you to scan for carbon deposits.
          Use your rockets to mine high-carbon sectors and manage your fleet from the galaxy view.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 unknown-tile border border-border/30 rounded-md"></div>
            <span>Unknown sectors</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-carbon-glow border border-border/30 rounded-md"></div>
            <span>Carbon deposits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-rocket-flame border border-border/30 rounded-md"></div>
            <span>Mining in progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-destructive/60 border border-border/30 rounded-md"></div>
            <span>Depleted (mined out)</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Helper component for carbon background effects
const CarbonBackground: React.FC<{ sector: any; isScanning: boolean }> = ({ sector, isScanning }) => {
  if (!sector?.scanned || sector.carbonDensity <= 0 || isScanning || sector.mined) return null;

  const getCarbonBackgroundClass = (density: number) => {
    if (density >= 75) return 'carbon-bg-low'; // High density = low opacity (lighter)
    if (density >= 50) return 'carbon-bg-medium';
    if (density >= 25) return 'carbon-bg-high'; // Low density = high opacity (darker)
    return 'carbon-bg';
  };

  const getCarbonOverlayClass = (density: number) => {
    if (density >= 75) return 'carbon-overlay-low'; // High density = low overlay (lighter)
    if (density >= 50) return 'carbon-overlay-medium';
    if (density >= 25) return 'carbon-overlay-high'; // Low density = high overlay (darker)
    return 'carbon-overlay-very-high';
  };

  return (
    <>
      {/* Carbon background image */}
      <div className={`absolute inset-0 rounded-md ${getCarbonBackgroundClass(sector.carbonDensity)}`} />
      
      {/* Carbon overlay for visual enhancement */}
      <div className={`absolute inset-0 rounded-md ${getCarbonOverlayClass(sector.carbonDensity)}`} />
    </>
  );
};

// Helper component for cosmic particles
const CosmicParticles: React.FC<{ sector: any; isScanning: boolean }> = ({ sector, isScanning }) => {
  if (!sector?.discovered || isScanning || sector.mined) return null;

  return (
    <div className="absolute inset-0 opacity-30">
      <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-carbon-glow rounded-full animate-carbon-sparkle"></div>
      <div className="absolute top-3/4 right-1/4 w-0.5 h-0.5 bg-scanner-beam rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 right-1/3 w-0.5 h-0.5 bg-energy-core rounded-full animate-cosmic-float"></div>
    </div>
  );
};

// Helper component for scanning animation
const ScanningAnimation: React.FC<{ isScanning: boolean }> = ({ isScanning }) => {
  if (!isScanning) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-4 h-4 bg-scanner-beam rounded-full animate-ping animate-pulse-glow"></div>
      <div className="absolute inset-0 animate-scan-beam rounded-md"></div>
      <div className="absolute inset-0 bg-scanner-beam/30 animate-pulse rounded-md"></div>
      <div className="absolute inset-0 border-2 border-scanner-beam/50 animate-pulse rounded-md"></div>
      
      {/* Scanning text overlay */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="bg-scanner-beam/90 text-scanner-beam-foreground px-2 py-1 rounded text-xs font-bold animate-pulse">
          🔍 Scanning
        </div>
      </div>
    </div>
  );
};

// Helper component for launching animation
const LaunchingAnimation: React.FC<{ isLaunching: boolean }> = ({ isLaunching }) => {
  if (!isLaunching) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20">
      <div className="w-4 h-4 bg-rocket-flame rounded-full animate-ping animate-pulse-glow"></div>
      <div className="absolute inset-0 bg-rocket-flame/40 animate-pulse rounded-md"></div>
      <div className="absolute inset-0 animate-rocket-launch rounded-md"></div>
      
      {/* Launching text overlay */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="bg-rocket-flame/95 text-rocket-flame-foreground px-2 py-1 rounded text-xs font-bold animate-pulse shadow-lg">
          🚀 Launching
        </div>
      </div>
    </div>
  );
};

// Helper component for mining animation
const MiningAnimation: React.FC<{ isMining: boolean }> = ({ isMining }) => {
  if (!isMining) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center z-10">
      <div className="w-3 h-3 bg-carbon-glow rounded-full animate-ping animate-pulse-glow-carbon"></div>
      <div className="absolute inset-0 bg-carbon-glow/30 animate-pulse rounded-md"></div>
      
      {/* Mining text overlay */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="bg-carbon-glow/95 text-carbon-glow-foreground px-2 py-1 rounded text-xs font-bold animate-pulse shadow-lg">
          ⛏️ Mining
        </div>
      </div>
    </div>
  );
};

// Helper component for mined sector visuals
const MinedSectorVisual: React.FC<{ sector: any }> = ({ sector }) => {
  if (!sector?.mined) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Mined sector background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-destructive/20 to-destructive/40 rounded-md"></div>
      
      {/* Crossed out pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-destructive/60 transform rotate-45 origin-center"></div>
        <div className="absolute top-0 left-0 w-full h-0.5 bg-destructive/60 transform -rotate-45 origin-center"></div>
      </div>
      
      {/* Depleted indicator */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="bg-destructive/90 text-destructive-foreground px-2 py-1 rounded text-xs font-bold">
          💀 Depleted
        </div>
      </div>
    </div>
  );
};

export const GalaxyView: React.FC<GalaxyViewProps> = ({ gameState, updateGameState, onNavigate }) => {
  const [launchingSectors, setLaunchingSectors] = useState<Set<string>>(new Set());

  const handleSectorClick = (sectorX: number, sectorY: number) => {
    const sector = gameState.sectors.find(s => s.x === sectorX && s.y === sectorY);
    
    // If sector doesn't exist or isn't discovered, scan it
    if (!sector || !sector.discovered) {
      if (gameState.energy < 10) {
        toast.error('Not enough energy! Need 10 energy to scan.');
        return;
      }
      
      toast.info('Scanning sector...', {
        description: `Analyzing sector ${sectorX},${sectorY} for carbon deposits`
      });
      
      // Start scanning
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
          mined: false,
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
        
        toast.success('Scan complete!', {
          description: `Found ${Math.floor(measuredDensity)}% carbon density in sector ${sectorX},${sectorY}`
        });
      }, 2000);
      
      return;
    }
    
    // If sector is scanned, try to launch mission
    if (sector.scanned) {
      // Check if we can launch a mission
      const availableRockets = gameState.rockets.filter(r => !r.launched && r.fuel >= 20);
      
      if (availableRockets.length > 0 && sector.carbonDensity > 0 && !sector.mining && !sector.mined) {
        // Launch mission immediately
        const rocket = availableRockets[0];
        
        if (gameState.energy < 30) {
          toast.error('Not enough energy! Need 30 energy to launch rocket.');
          return;
        }
        
        const updatedRockets = gameState.rockets.map(r =>
          r.id === rocket.id
            ? { 
                ...r, 
                launched: true, 
                targetSector: sector.id, 
                missionProgress: 0,
                fuel: r.fuel - 20
              }
            : r
        );

        const updatedSectors = gameState.sectors.map(s =>
          s.id === sector.id ? { ...s, mining: true, marked: false } : s
        );

        // Add launching animation
        setLaunchingSectors(prev => new Set([...prev, sector.id]));

        updateGameState({ 
          rockets: updatedRockets, 
          sectors: updatedSectors,
          energy: gameState.energy - 30 
        });
        
        toast.success('Rocket launched!', {
          description: `Mining mission started in sector ${sectorX},${sectorY}`
        });

        // Remove launching animation after 3 seconds and ensure mining state is correct
        setTimeout(() => {
          setLaunchingSectors(prev => {
            const newSet = new Set(prev);
            newSet.delete(sector.id);
            return newSet;
          });
          
          // Ensure the sector is still marked as mining after launch animation ends
          const currentSectors = gameState.sectors;
          const updatedSectors = currentSectors.map(s =>
            s.id === sector.id ? { ...s, mining: true } : s
          );
          updateGameState({ sectors: updatedSectors });
        }, 3000);
        

        
      } else if (availableRockets.length === 0) {
        toast.warning("All rockets are currently on missions. Wait for them to return or recall them.");
      } else if (sector.mining) {
        toast.warning("This sector is already being mined by another rocket.");
      } else if (sector.mined) {
        toast.warning("This sector has been completely mined out.");
      } else if (sector.carbonDensity <= 0) {
        toast.warning("This sector has no carbon to mine.");
      }
      // Note: Marking is now only done via right-click
    }
  };

  const getSectorColor = (sector: any) => {
    if (!sector.discovered) return 'unknown-tile';
    if (!sector.scanned) return 'bg-space-deep';
    if (sector.mining) return 'bg-rocket-flame';
    if (sector.mined) return 'bg-destructive/60';
    
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

  const getSectorGlow = (sector: any) => {
    if (!sector.discovered) return '';
    if (!sector.scanned) return 'glow-cosmic';
    if (sector.mining) return 'glow-carbon';
    if (sector.mined) return 'glow-destructive';
    
    const intensity = Math.floor(sector.carbonDensity / 25);
    if (intensity >= 3) return 'glow-carbon';
    if (intensity >= 1) return 'glow-cosmic';
    return '';
  };

  const visibleSectors = gameState.sectors.filter(s => 
    Math.abs(s.x) <= gameState.telescope.range && 
    Math.abs(s.y) <= gameState.telescope.range
  );

  const gridSize = gameState.telescope.range * 2 + 1;

  return (
    <div className="space-y-6">
      {/* Welcome message for new players */}
      <WelcomeMessage gameState={gameState} />
      
      {/* Rocket Management Section */}
      <Card className="p-6 bg-gradient-to-br from-space-deep/50 to-space-nebula/50 border-border/30 backdrop-blur-sm" data-rocket-fleet>
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          🚀 Rocket Fleet
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gameState.rockets.map((rocket) => (
            <Card key={rocket.id} className="p-4 bg-gradient-to-br from-space-deep/30 to-space-nebula/30 border-border/20">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-foreground">{rocket.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  rocket.launched ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-primary-foreground'
                }`}>
                  {rocket.launched ? "On Mission" : "Available"}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fuel:</span>
                  <span className="text-foreground">{rocket.fuel}/{rocket.maxFuel}</span>
                </div>
                
                {rocket.launched && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mission Progress:</span>
                      <span className="text-foreground">{Math.floor(rocket.missionProgress)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="h-full bg-primary transition-all rounded-full" 
                        style={{ width: `${rocket.missionProgress}%` }}
                      ></div>
                    </div>
                    
                    {rocket.missionProgress >= 100 && (
                      <>
                        {/* Auto-scroll when mission reaches 100% */}
                        {(() => {
                          // Scroll to rocket fleet section when mission completes
                          setTimeout(() => {
                            const rocketSection = document.querySelector('[data-rocket-fleet]');
                            if (rocketSection) {
                              rocketSection.scrollIntoView({ 
                                behavior: 'smooth', 
                                block: 'center' 
                              });
                            }
                          }, 100);
                          return null;
                        })()}
                        
                        <Button
                          size="sm"
                          onClick={() => {
                            // Complete mission and return rocket
                            const targetSector = gameState.sectors.find(s => s.id === rocket.targetSector);
                            if (targetSector) {
                              const carbonGained = Math.floor(targetSector.carbonDensity * 0.8);
                              const updatedSectors = gameState.sectors.map(s =>
                                s.id === targetSector.id ? { ...s, mining: false, mined: true } : s
                              );
                              const updatedRockets = gameState.rockets.map(r =>
                                r.id === rocket.id ? { ...r, launched: false, targetSector: null, missionProgress: 0 } : r
                              );
                              updateGameState({
                                sectors: updatedSectors,
                                rockets: updatedRockets,
                                carbon: gameState.carbon + carbonGained
                              });
                              toast.success('Mission complete!', {
                                description: `Gained ${carbonGained} carbon from sector ${targetSector.x},${targetSector.y}`
                              });
                            }
                          }}
                          className="w-full"
                        >
                          Complete Mission
                        </Button>
                      </>
                    )}
                  </>
                )}
                
                {!rocket.launched && (
                  <div className="space-y-2">
                    {rocket.fuel < 20 && (
                      <Button
                        size="sm"
                        onClick={() => {
                          if (gameState.credits >= 50) {
                            const updatedRockets = gameState.rockets.map(r =>
                              r.id === rocket.id ? { ...r, fuel: r.maxFuel } : r
                            );
                            updateGameState({
                              rockets: updatedRockets,
                              credits: gameState.credits - 50
                            });
                            toast.success('Rocket refueled!', {
                              description: `${rocket.name} is ready for missions`
                            });
                          } else {
                            toast.error('Not enough credits!', {
                              description: 'Need 50 credits to refuel rocket'
                            });
                          }
                        }}
                        className="w-full"
                      >
                        Refuel (50 credits)
                      </Button>
                    )}
                    
                    {rocket.fuel >= 20 && rocket.fuel < rocket.maxFuel && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const fuelNeeded = rocket.maxFuel - rocket.fuel;
                          const cost = Math.ceil(fuelNeeded * 2.5); // 2.5 credits per fuel unit
                          
                          if (gameState.credits >= cost) {
                            const updatedRockets = gameState.rockets.map(r =>
                              r.id === rocket.id ? { ...r, fuel: r.maxFuel } : r
                            );
                            updateGameState({
                              rockets: updatedRockets,
                              credits: gameState.credits - cost
                            });
                            toast.success('Rocket fully refueled!', {
                              description: `${rocket.name} is at maximum fuel capacity`
                            });
                          } else {
                            toast.error('Not enough credits!', {
                              description: `Need ${cost} credits to fully refuel`
                            });
                          }
                        }}
                        className="w-full"
                      >
                        Top Up ({(rocket.maxFuel - rocket.fuel) * 2.5} credits)
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Card>
      
      <Card className="p-6 bg-gradient-to-br from-space-deep/50 to-space-nebula/50 border-border/30 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start mb-6 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground bg-gradient-to-r from-scanner-beam to-carbon-glow bg-clip-text text-transparent">
              🌌 Galaxy Map
            </h2>
            <p className="text-muted-foreground mt-2">
              Start by scanning the unknown tiles around your base. Lighter areas indicate higher carbon density. 
              Click to scan or launch mining missions. Red tiles are depleted (mined out).
            </p>
          </div>
          <div className="text-right space-y-1">
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-energy-core rounded-full animate-pulse"></div>
              Energy: {gameState.energy}/100
            </div>
            <div className="text-sm text-muted-foreground">Scan Cost: 10 Energy</div>
            <div className="text-sm text-muted-foreground">Range: {gameState.telescope.range}</div>
            {gameState.telescope.scanning && (
              <div className="text-scanner-beam animate-pulse flex items-center gap-2">
                <div className="w-2 h-2 bg-scanner-beam rounded-full animate-ping"></div>
                Scanning...
              </div>
            )}
          </div>
        </div>
        
        {/* Responsive grid container with cosmic background */}
        <div className="relative nebula-bg rounded-lg p-4">
          {/* Cosmic background effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-space-void/20 via-space-deep/10 to-space-nebula/20 rounded-lg"></div>
          
          {/* Global scanning overlay */}
          {gameState.telescope.scanning && (
            <div className="absolute inset-0 bg-scanner-beam/10 animate-pulse rounded-lg z-10 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-scanner-beam/20 to-transparent animate-scan-beam"></div>
            </div>
          )}
          
          {/* Grid container with responsive sizing */}
          <div 
            className="grid gap-2 max-w-6xl mx-auto relative z-10 p-4"
            style={{ 
              gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: gridSize }, (_, y) => 
              Array.from({ length: gridSize }, (_, x) => {
                const sectorX = x - gameState.telescope.range;
                const sectorY = gameState.telescope.range - y;
                const sector = visibleSectors.find(s => s.x === sectorX && s.y === sectorY);
                const isScanning = gameState.telescope.scanning && gameState.scanningX === sectorX && gameState.scanningY === sectorY;
                const isLaunching = sector && launchingSectors.has(sector.id);
                const isMining = sector && sector.mining && !isLaunching; // Don't show mining if launching
                
                return (
                  <button
                    key={`${sectorX},${sectorY}`}
                    className={`
                      tile-responsive aspect-square
                      border border-border/30 rounded-md 
                      transition-all duration-500 ease-out
                      tile-hover
                      relative overflow-hidden
                      ${isScanning ? 'bg-scanner-beam animate-pulse glow-cosmic' :
                        sector ? `${getSectorColor(sector)} ${getSectorGlow(sector)}` : 'bg-space-void'
                      } 

                    `}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleSectorClick(sectorX, sectorY);
                    }}

                    title={
                      isScanning ? 'Scanning...' :
                      sector ? `Sector ${sector.x},${sector.y} - Carbon: ${Math.floor(sector.carbonDensity)}%` : 
                      'Click to scan this unknown sector'
                    }
                  >
                    {/* Carbon background effects */}
                    <CarbonBackground sector={sector} isScanning={isScanning} />
                    
                    {/* Cosmic particle effects */}
                    <CosmicParticles sector={sector} isScanning={isScanning} />
                    
                    {/* Scanning animation */}
                    <ScanningAnimation isScanning={isScanning} />
                    
                    {/* Launching animation */}
                    <LaunchingAnimation isLaunching={isLaunching} />
                    
                    {/* Mining animation */}
                    <MiningAnimation isMining={isMining} />
                    
                    {/* Mined sector visual */}
                    <MinedSectorVisual sector={sector} />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Enhanced legend with space styling */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
          <div className="flex items-center gap-3 p-3 glass-effect rounded-lg hover:bg-secondary/70 transition-colors">
            <div className="w-5 h-5 unknown-tile border border-border/30 rounded-md"></div>
            <span className="text-foreground">Unknown</span>
          </div>
          <div className="flex items-center gap-3 p-3 glass-effect rounded-lg hover:bg-secondary/70 transition-colors">
            <div className="w-5 h-5 bg-space-deep border border-border/30 rounded-md glow-cosmic"></div>
            <span className="text-foreground">Discovered</span>
          </div>
          <div className="flex items-center gap-3 p-3 glass-effect rounded-lg hover:bg-secondary/70 transition-colors">
            <div className="w-5 h-5 bg-carbon-glow border border-border/30 rounded-md glow-carbon animate-carbon-sparkle relative overflow-hidden">
              <div className="absolute inset-0 carbon-bg-low"></div>
              <div className="absolute inset-0 carbon-overlay-low"></div>
            </div>
            <span className="text-foreground">High Carbon (Lighter)</span>
          </div>
          <div className="flex items-center gap-3 p-3 glass-effect rounded-lg hover:bg-secondary/70 transition-colors">
            <div className="w-5 h-5 bg-carbon-glow border border-border/30 rounded-md glow-carbon animate-carbon-sparkle relative overflow-hidden">
              <div className="absolute inset-0 carbon-bg-high"></div>
              <div className="absolute inset-0 carbon-overlay-high"></div>
            </div>
            <span className="text-foreground">Low Carbon (Darker)</span>
          </div>
          <div className="flex items-center gap-3 p-3 glass-effect rounded-lg hover:bg-secondary/70 transition-colors">
            <div className="w-5 h-5 bg-energy-core border border-border/30 rounded-md glow-energy animate-pulse-glow-energy"></div>
            <span className="text-foreground">Marked</span>
          </div>
          <div className="flex items-center gap-3 p-3 glass-effect rounded-lg hover:bg-secondary/70 transition-colors">
            <div className="w-5 h-5 bg-rocket-flame border border-border/30 rounded-md glow-carbon"></div>
            <span className="text-foreground">Mining</span>
          </div>
          <div className="flex items-center gap-3 p-3 glass-effect rounded-lg hover:bg-secondary/70 transition-colors">
            <div className="w-5 h-5 bg-muted/60 border border-border/30 rounded-md"></div>
            <span className="text-foreground">Mined</span>
          </div>
        </div>
      </Card>




    </div>
  );
};