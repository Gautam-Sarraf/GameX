'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Star, ShieldAlert, Award, ArrowUp, Zap, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { LeaderboardService } from '@/services/leaderboard.service';
import { cn } from '@/lib/utils';

export default function LeaderboardsPage() {
  const [criteria, setCriteria] = React.useState<'xp' | 'wins' | 'winRate'>('xp');

  // Fetch Top Players
  const { data: topPlayers = [], isLoading } = useQuery({
    queryKey: ['leaderboard-players', criteria],
    queryFn: () => LeaderboardService.getTopPlayers(15, criteria)
  });

  // Fetch Top Organizers
  const { data: topOrganizers = [] } = useQuery({
    queryKey: ['leaderboard-organizers'],
    queryFn: () => LeaderboardService.getTopOrganizers(5)
  });

  // Podium Positions (Top 3)
  const podium = topPlayers.slice(0, 3);
  const rest = topPlayers.slice(3);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#030303] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold uppercase text-white font-oswald tracking-tight flex items-center justify-center gap-2">
            <Trophy className="h-9 w-9 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]" /> Global Leaderboards
          </h1>
          <p className="text-zinc-400 text-sm">Behold the highest ranking gladiators and tournament operators in EsportBrawl.</p>
        </div>

        {/* Double-Grid Layout: Left (Podium & List), Right (Organizers) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Player Rankings (Podium + List) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Criteria Tabs */}
            <div className="flex justify-between items-center bg-zinc-950 p-2 border border-zinc-900 rounded-xl">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider pl-2">Filter Board</span>
              <Tabs value={criteria} onValueChange={(val) => setCriteria(val as any)}>
                <TabsList>
                  <TabsTrigger value="xp">Highest XP</TabsTrigger>
                  <TabsTrigger value="wins">Most Wins</TabsTrigger>
                  <TabsTrigger value="winRate">Win Rate</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <div className="h-44 w-full bg-zinc-900/50 rounded-xl border border-zinc-800 animate-pulse" />
                <div className="h-80 w-full bg-zinc-900/50 rounded-xl border border-zinc-800 animate-pulse" />
              </div>
            ) : topPlayers.length > 0 ? (
              <div className="space-y-6">
                
                {/* 1. Podium (Top 3) */}
                <div className="grid grid-cols-3 gap-4 pt-10 pb-4 items-end max-w-lg mx-auto text-center">
                  
                  {/* #2 Silver */}
                  {podium[1] && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-2"
                    >
                      <div className="relative inline-block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={podium[1].avatar}
                          alt=""
                          className="h-16 w-16 rounded-full border-2 border-zinc-400 bg-zinc-950"
                        />
                        <span className="absolute bottom-[-5px] right-[-5px] h-6 w-6 rounded-full bg-zinc-400 text-black font-mono font-black text-xs flex items-center justify-center border border-zinc-950">
                          2
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white hover:text-cyan-400 truncate">
                          <Link href={`/profile/${podium[1].username}`}>{podium[1].username}</Link>
                        </h4>
                        <p className="text-[10px] text-cyan-400 font-bold">
                          {criteria === 'xp' ? `${(podium[1].xp).toLocaleString()} XP` :
                           criteria === 'wins' ? `${podium[1].tournamentWins} Wins` :
                           `${podium[1].winRate}% WR`}
                        </p>
                      </div>
                      <div className="h-20 bg-zinc-900 border-t border-x border-zinc-800 rounded-t-lg shadow-inner" />
                    </motion.div>
                  )}

                  {/* #1 Gold (Center, Higher) */}
                  {podium[0] && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                      className="space-y-2 z-10"
                    >
                      <div className="relative inline-block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={podium[0].avatar}
                          alt=""
                          className="h-20 w-20 rounded-full border-2 border-yellow-500 bg-zinc-950 shadow-[0_0_15px_rgba(234,179,8,0.25)]"
                        />
                        <span className="absolute bottom-[-5px] right-[-5px] h-7 w-7 rounded-full bg-yellow-500 text-black font-mono font-black text-sm flex items-center justify-center border border-zinc-950">
                          1
                        </span>
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-white hover:text-cyan-400 truncate">
                          <Link href={`/profile/${podium[0].username}`}>{podium[0].username}</Link>
                        </h4>
                        <p className="text-xs font-black text-yellow-500">
                          {criteria === 'xp' ? `${(podium[0].xp).toLocaleString()} XP` :
                           criteria === 'wins' ? `${podium[0].tournamentWins} Wins` :
                           `${podium[0].winRate}% WR`}
                        </p>
                      </div>
                      <div className="h-28 bg-zinc-900/80 border-t border-x border-yellow-500/30 rounded-t-lg shadow-md" />
                    </motion.div>
                  )}

                  {/* #3 Bronze */}
                  {podium[2] && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="space-y-2"
                    >
                      <div className="relative inline-block">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={podium[2].avatar}
                          alt=""
                          className="h-16 w-16 rounded-full border-2 border-amber-600 bg-zinc-950"
                        />
                        <span className="absolute bottom-[-5px] right-[-5px] h-6 w-6 rounded-full bg-amber-600 text-black font-mono font-black text-xs flex items-center justify-center border border-zinc-950">
                          3
                        </span>
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-white hover:text-cyan-400 truncate">
                          <Link href={`/profile/${podium[2].username}`}>{podium[2].username}</Link>
                        </h4>
                        <p className="text-[10px] text-cyan-400 font-bold">
                          {criteria === 'xp' ? `${(podium[2].xp).toLocaleString()} XP` :
                           criteria === 'wins' ? `${podium[2].tournamentWins} Wins` :
                           `${podium[2].winRate}% WR`}
                        </p>
                      </div>
                      <div className="h-16 bg-zinc-900 border-t border-x border-zinc-800 rounded-t-lg shadow-inner" />
                    </motion.div>
                  )}

                </div>

                {/* 2. Ranks List (Position 4 onwards) */}
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="space-y-2"
                >
                  {rest.map((player, idx) => (
                    <motion.div
                      key={player.id}
                      variants={itemVariants}
                      className="flex items-center justify-between p-3.5 border border-zinc-900 bg-zinc-950/40 rounded-xl hover:border-zinc-850 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-zinc-500 font-black text-sm w-6">
                          #{idx + 4}
                        </span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={player.avatar} alt="" className="h-9 w-9 rounded-full border border-zinc-800 bg-zinc-900" />
                        <div>
                          <h4 className="text-sm font-black text-white hover:text-cyan-400 transition-colors leading-tight">
                            <Link href={`/profile/${player.username}`}>{player.username}</Link>
                          </h4>
                          <p className="text-[10px] text-zinc-500 font-semibold">{player.rank}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-black text-cyan-400">
                          {criteria === 'xp' ? `${(player.xp).toLocaleString()} XP` :
                           criteria === 'wins' ? `${player.tournamentWins} Wins` :
                           `${player.winRate}% WR`}
                        </p>
                        <p className="text-[10px] text-zinc-500 font-semibold mt-0.5">
                          {player.matchesPlayed} Matches played
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-zinc-900 rounded-xl bg-zinc-950/20 text-zinc-500">
                No active players registered on leaderboard.
              </div>
            )}
          </div>

          {/* Right Column: Top Organizers */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white font-oswald flex items-center gap-2 border-b border-zinc-900 pb-3">
                <Award className="h-5 w-5 text-yellow-500" /> Host Organizers
              </h2>
            </div>
            
            <div className="space-y-3 bg-zinc-950/40 border border-zinc-900 p-4 rounded-xl">
              {topOrganizers.map((org, index) => (
                <div key={org.id} className="flex items-center justify-between py-2 border-b border-zinc-900 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-zinc-500 font-black text-xs">#{index + 1}</span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={org.logo} alt="" className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800" />
                    <div>
                      <h4 className="text-xs font-black text-white">{org.name}</h4>
                      <p className="text-[10px] text-zinc-500 font-semibold">{org.tournamentsCount} tournaments hosted</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/20 border border-cyan-900/30 px-2 py-0.5 rounded">
                      {org.followers.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
