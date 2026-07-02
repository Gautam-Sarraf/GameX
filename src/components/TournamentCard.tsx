'use client';

import * as React from 'react';
import Link from 'next/link';
import { Calendar, Trophy, Users, Shield, ArrowRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { CountdownTimer } from './CountdownTimer';
import { Tournament } from '@/types';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

interface TournamentCardProps {
  tournament: Tournament;
  onRegisterClick?: (id: string) => void;
  isRegistered?: boolean;
}

export function TournamentCard({ tournament, onRegisterClick, isRegistered }: TournamentCardProps) {
  const isSlotsFull = tournament.registeredCount >= tournament.maxSlots;
  const progressPercent = Math.min(100, (tournament.registeredCount / tournament.maxSlots) * 100);

  const statusBadge = {
    upcoming: 'border-amber-500/20 text-amber-400 bg-amber-500/10 shadow-sm',
    live: 'border-red-500/20 text-red-400 bg-red-500/10 shadow-sm animate-pulse',
    completed: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/10 shadow-sm',
    draft: 'border-zinc-800 text-zinc-400 bg-zinc-900/60'
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:translate-y-[-4px] hover:border-orange-500/50 hover:shadow-orange-500/10 hover:shadow-[0_4px_25px_rgba(249,115,22,0.08)] border-zinc-850 bg-zinc-950/40 backdrop-blur-md">
      
      {/* Banner */}
      <div className="relative h-40 w-full overflow-hidden bg-zinc-950 border-b border-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={tournament.banner}
          alt={tournament.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-transparent to-transparent" />
        
        {/* Status Badge */}
        <span className={cn(
          'absolute top-3 left-3 px-2.5 py-1 text-[11px] font-bold tracking-wider uppercase border rounded-md backdrop-blur-md',
          statusBadge[tournament.status]
        )}>
          {tournament.status}
        </span>

        {/* Game Title tag */}
        <span className="absolute bottom-3 right-3 px-2.5 py-1 text-[10px] font-bold bg-black/85 border border-zinc-800 text-orange-400 rounded-md backdrop-blur-md uppercase tracking-wider">
          {tournament.game}
        </span>
      </div>

      <CardContent className="p-5">
        {/* Organizer */}
        <div className="flex items-center space-x-2 text-xs text-zinc-400 mb-2">
          {tournament.organizerLogo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={tournament.organizerLogo} alt={tournament.organizerName} className="h-4.5 w-4.5 rounded-full" />
          ) : (
            <Shield className="h-3.5 w-3.5 text-orange-500" />
          )}
          <span className="font-semibold text-zinc-400 hover:text-white transition-colors">{tournament.organizerName}</span>
        </div>

        {/* Title */}
        <h4 className="text-base font-extrabold text-white mb-3 line-clamp-1 group-hover:text-orange-500 transition-colors">
          {tournament.title}
        </h4>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-lg bg-zinc-900/40 border border-zinc-900">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider flex items-center">
              <Trophy className="h-3 w-3 mr-1 text-yellow-600" /> Prize Pool
            </span>
            <p className="text-sm font-black text-white mt-0.5">
              {tournament.prizePool > 0 ? formatCurrency(tournament.prizePool) : 'FREE ENTRY'}
            </p>
          </div>
          <div>
            <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider flex items-center">
              Entry Fee
            </span>
            <p className="text-sm font-black text-orange-500 mt-0.5">
              {tournament.entryFee > 0 ? formatCurrency(tournament.entryFee) : 'FREE'}
            </p>
          </div>
        </div>

        {/* Registration Progress */}
        {tournament.status !== 'completed' && (
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-500 flex items-center">
                <Users className="h-3.5 w-3.5 mr-1" /> Slots Filled
              </span>
              <span className="font-mono text-zinc-300 font-bold">
                {tournament.registeredCount} <span className="text-zinc-500">/ {tournament.maxSlots}</span>
              </span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-850">
              <div
                style={{ width: `${progressPercent}%` }}
                className={cn(
                  'h-full rounded-full transition-all duration-300',
                  isSlotsFull ? 'bg-zinc-650' : 'bg-gradient-to-r from-orange-500 to-amber-400 shadow-[0_0_8px_rgba(249,115,22,0.4)]'
                )}
              />
            </div>
          </div>
        )}

        {/* Date / Countdown */}
        <div className="flex items-center justify-between text-xs pt-3 border-t border-zinc-900">
          <div className="text-zinc-450 text-zinc-400 flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1 text-zinc-550 text-zinc-500" />
            <span className="font-semibold">{formatDate(tournament.startDate)}</span>
          </div>

          {tournament.status === 'upcoming' && (
            <div className="text-right">
              <CountdownTimer targetDate={tournament.startDate} />
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-4 flex items-center gap-2">
          <Link href={`/tournaments/${tournament.id}`} className="flex-1">
            <Button variant="outline" className="w-full text-xs font-bold py-1 bg-zinc-950">
              View Details
            </Button>
          </Link>

          {tournament.status === 'upcoming' && onRegisterClick && (
            <Button
              variant={isRegistered ? 'secondary' : 'default'}
              size="sm"
              disabled={isSlotsFull && !isRegistered}
              onClick={() => onRegisterClick(tournament.id)}
              className="text-xs font-bold"
            >
              {isRegistered ? 'Registered' : isSlotsFull ? 'Full' : 'Join'}
            </Button>
          )}
        </div>

      </CardContent>
    </Card>
  );
}
