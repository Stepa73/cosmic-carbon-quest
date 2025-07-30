export interface Sector {
  id: string;
  x: number;
  y: number;
  carbonDensity: number; // 0-100
  scanned: boolean;
  marked: boolean;
  mining: boolean;
  mined: boolean; // Whether the sector has been completely mined
  depth: number; // How deep the carbon is (affects scanning accuracy)
  discovered: boolean;
}

export interface Rocket {
  id: string;
  name: string;
  fuel: number;
  maxFuel: number;
  cargo: number;
  maxCargo: number;
  drillPower: number;
  launched: boolean;
  targetSector?: string;
  missionProgress: number; // 0-100
  returnTime?: number;
}

export interface TelescopeUpgrade {
  id: string;
  name: string;
  range: number;
  accuracy: number;
  cost: number;
  owned: boolean;
}

export interface RocketUpgrade {
  id: string;
  name: string;
  fuelBonus: number;
  cargoBonus: number;
  drillBonus: number;
  cost: number;
  owned: boolean;
}

export interface GameState {
  // Resources
  carbon: number;
  energy: number;
  credits: number;
  
  // Equipment
  telescope: {
    range: number;
    accuracy: number;
    scanning: boolean;
    scanProgress: number;
  };
  
  rockets: Rocket[];
  sectors: Sector[];
  
  // Upgrades
  telescopeUpgrades: TelescopeUpgrade[];
  rocketUpgrades: RocketUpgrade[];
  
  // Game progression
  currentView: 'galaxy' | 'telescope' | 'rockets' | 'market' | 'upgrades';
  scanningX: number;
  scanningY: number;
  
  // Market
  carbonPrice: number;
  priceHistory: number[];
}