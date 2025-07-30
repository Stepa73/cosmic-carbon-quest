import { Sector, Rocket } from '@/types/game';

export const generateInitialSectors = (): Sector[] => {
  const sectors: Sector[] = [];
  
  // Generate a 15x15 grid of sectors
  for (let x = -7; x <= 7; x++) {
    for (let y = -7; y <= 7; y++) {
      const distance = Math.sqrt(x * x + y * y);
      const carbonDensity = Math.max(0, Math.random() * 100 - distance * 5);
      
      // Only the center tile (0,0) starts as discovered and scanned
      const isCenterTile = x === 0 && y === 0;
      
      sectors.push({
        id: `${x},${y}`,
        x,
        y,
        carbonDensity,
        scanned: isCenterTile, // Only center tile starts scanned
        marked: false,
        mining: false,
        depth: Math.floor(Math.random() * 5) + 1,
        discovered: isCenterTile, // Only center tile starts discovered
      });
    }
  }
  
  return sectors;
};

export const generateInitialRockets = (): Rocket[] => {
  return [
    {
      id: 'rocket-1',
      name: 'Pioneer I',
      fuel: 100,
      maxFuel: 100,
      cargo: 0,
      maxCargo: 50,
      drillPower: 1,
      launched: false,
      missionProgress: 0,
    },
  ];
};

export const calculateScanAccuracy = (depth: number, telescopeAccuracy: number): number => {
  return Math.max(10, telescopeAccuracy - depth * 10);
};

export const calculateMissionTime = (distance: number, fuelEfficiency: number): number => {
  return Math.max(30, distance * 10 - fuelEfficiency * 2);
};

export const calculateCarbonExtraction = (
  carbonDensity: number,
  drillPower: number,
  timeInSeconds: number
): number => {
  return (carbonDensity * drillPower * timeInSeconds) / 100;
};