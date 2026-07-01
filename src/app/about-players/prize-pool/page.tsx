'use client';

import * as React from 'react';
import './pool.css';

export default function PrizePoolPage() {
  const prizesList = [
    { rank: '1st Place', value: '10,000 Coins' },
    { rank: '2nd Place', value: '5,000 Coins' },
    { rank: '3rd Place', value: '2,500 Coins' },
    { rank: '4th - 10th Place', value: '1,000 Coins' }
  ];

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center">
      
      {/* Background Video */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video autoPlay loop muted className="w-full h-full object-cover opacity-25">
          <source src="/assets/videos/background-prize.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Main Contents */}
      <div className="prize-pool-page relative z-10 w-full max-w-lg">
        <header className="prize-pool-header text-center">
          <h1>Winning Prize-Pool</h1>
        </header>

        <div className="prize-pool-grid">
          {prizesList.map((item, idx) => (
            <div key={idx} className="prize-card-item">
              <h2>{item.rank}</h2>
              <div className="prize-coins">{item.value}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
