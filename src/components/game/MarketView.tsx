import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameState } from '@/types/game';

interface MarketViewProps {
  gameState: GameState;
  updateGameState: (updates: Partial<GameState>) => void;
}

export const MarketView: React.FC<MarketViewProps> = ({ gameState, updateGameState }) => {
  const sellCarbon = (amount: number) => {
    if (amount > gameState.carbon) return;

    const credits = amount * gameState.carbonPrice;
    updateGameState({
      carbon: gameState.carbon - amount,
      credits: gameState.credits + credits,
    });
  };

  const sellAllCarbon = () => {
    sellCarbon(gameState.carbon);
  };

  const PriceChart = () => (
    <div className="mt-4">
      <h4 className="text-lg font-semibold mb-2">Price History</h4>
      <div className="flex items-end gap-1 h-20">
        {gameState.priceHistory.map((price, index) => (
          <div
            key={index}
            className="bg-scanner-beam flex-1 min-w-0 transition-all duration-300"
            style={{ height: `${(price / 20) * 100}%` }}
            title={`Day ${index + 1}: ${price} credits`}
          />
        ))}
      </div>
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>5 Days Ago</span>
        <span>Today</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold text-foreground mb-4">Galactic Carbon Market</h2>
        <p className="text-muted-foreground mb-6">
          Sell your carbon at current market prices. Prices fluctuate slowly based on galactic supply and demand.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="text-center p-6 bg-secondary rounded-lg">
              <div className="text-sm text-muted-foreground">Current Price</div>
              <div className="text-3xl font-bold text-carbon-glow">
                {gameState.carbonPrice.toFixed(1)} credits
              </div>
              <div className="text-sm text-muted-foreground">per unit carbon</div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Your Carbon:</span>
                <span className="text-carbon-glow font-mono">{Math.floor(gameState.carbon)} units</span>
              </div>
              <div className="flex justify-between">
                <span>Total Value:</span>
                <span className="text-scanner-beam font-mono">
                  {Math.floor(gameState.carbon * gameState.carbonPrice)} credits
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Sell</h3>
            
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                onClick={() => sellCarbon(Math.floor(gameState.carbon * 0.25))}
                disabled={gameState.carbon < 1}
              >
                Sell 25%
              </Button>
              <Button
                variant="outline"
                onClick={() => sellCarbon(Math.floor(gameState.carbon * 0.5))}
                disabled={gameState.carbon < 1}
              >
                Sell 50%
              </Button>
              <Button
                variant="outline"
                onClick={() => sellCarbon(Math.floor(gameState.carbon * 0.75))}
                disabled={gameState.carbon < 1}
              >
                Sell 75%
              </Button>
              <Button
                onClick={sellAllCarbon}
                disabled={gameState.carbon < 1}
              >
                Sell All
              </Button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Custom Amount</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Amount to sell"
                  className="flex-1 px-3 py-2 bg-input border border-border rounded-md text-foreground"
                  max={Math.floor(gameState.carbon)}
                  min="0"
                  id="sell-amount"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    const input = document.getElementById('sell-amount') as HTMLInputElement;
                    const amount = parseInt(input.value) || 0;
                    if (amount > 0) {
                      sellCarbon(amount);
                      input.value = '';
                    }
                  }}
                >
                  Sell
                </Button>
              </div>
            </div>
          </div>
        </div>

        <PriceChart />
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-foreground mb-4">Market Intelligence</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="p-3 bg-secondary rounded-lg">
            <div className="text-muted-foreground">Market Trend</div>
            <div className="text-lg font-semibold">
              {gameState.carbonPrice > gameState.priceHistory[gameState.priceHistory.length - 2] ? (
                <span className="text-green-400">📈 Rising</span>
              ) : (
                <span className="text-red-400">📉 Falling</span>
              )}
            </div>
          </div>
          
          <div className="p-3 bg-secondary rounded-lg">
            <div className="text-muted-foreground">Weekly High</div>
            <div className="text-lg font-semibold text-carbon-glow">
              {Math.max(...gameState.priceHistory).toFixed(1)}
            </div>
          </div>
          
          <div className="p-3 bg-secondary rounded-lg">
            <div className="text-muted-foreground">Weekly Low</div>
            <div className="text-lg font-semibold text-scanner-beam">
              {Math.min(...gameState.priceHistory).toFixed(1)}
            </div>
          </div>
        </div>
        
        <p className="text-muted-foreground text-sm mt-4">
          💡 Tip: Carbon prices fluctuate slowly. Hold your carbon if prices are low, or sell when they peak!
        </p>
      </Card>
    </div>
  );
};