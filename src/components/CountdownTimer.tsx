'use client';

import * as React from 'react';

interface CountdownTimerProps {
  targetDate: string;
  onExpiry?: () => void;
}

export function CountdownTimer({ targetDate, onExpiry }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  React.useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      
      if (difference <= 0) {
        if (onExpiry) onExpiry();
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
        isExpired: false
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpiry]);

  if (timeLeft.isExpired) {
    return <span className="text-red-500 font-bold text-sm tracking-wide">LIVE / COMPLETED</span>;
  }

  const parts = [
    { label: 'd', value: timeLeft.days },
    { label: 'h', value: timeLeft.hours },
    { label: 'm', value: timeLeft.minutes },
    { label: 's', value: timeLeft.seconds }
  ];

  return (
    <div className="flex items-center space-x-1 font-mono text-sm">
      {parts.map((p, idx) => {
        if (idx === 0 && p.value === 0) return null; // hide days if 0
        return (
          <span key={p.label} className="flex items-center">
            <span className="bg-zinc-900 border border-zinc-800 text-cyan-400 px-1.5 py-0.5 rounded font-bold">
              {String(p.value).padStart(2, '0')}
            </span>
            <span className="text-zinc-500 text-xs ml-0.5 mr-1 uppercase font-semibold">{p.label}</span>
          </span>
        );
      })}
    </div>
  );
}
