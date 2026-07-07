'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Trophy, Users, Gamepad2, Play, Users2, ShoppingBag, ArrowRight, ShieldCheck, Flame, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TournamentCard } from '@/components/TournamentCard';
import { Container } from '@/components/ui/Container';
import { TournamentService } from '@/services/tournament.service';
import { LeaderboardService } from '@/services/leaderboard.service';
import { CommunityService } from '@/services/community.service';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

export default function HomePage() {
  const [email, setEmail] = React.useState('');

  // Fetch Tournaments
  const { data: tournaments = [], isLoading: isLoadingTournaments } = useQuery({
    queryKey: ['home-tournaments'],
    queryFn: () => TournamentService.getTournaments()
  });

  // Fetch Top Leaders
  const { data: topPlayers = [] } = useQuery({
    queryKey: ['home-top-players'],
    queryFn: () => LeaderboardService.getTopPlayers(3, 'xp')
  });

  // Fetch Featured Organizers
  const { data: topOrganizers = [] } = useQuery({
    queryKey: ['home-top-organizers'],
    queryFn: () => LeaderboardService.getTopOrganizers(4)
  });

  // Filter Upcoming / Live Tournaments
  const featuredTournaments = tournaments
    .filter(t => t.status === 'upcoming' || t.status === 'live')
    .slice(0, 3);

  // Platform Statistics
  const platformStats = [
    { label: 'Total Players', value: '45,820+', icon: Users },
    { label: 'Tournaments Hosted', value: '1,420+', icon: Trophy },
    { label: 'Total Prize Distributed', value: '$2,450,000+', icon: Gamepad2 },
    { label: 'Active Teams', value: '8,900+', icon: Users2 }
  ];

  // Popular Games List
  const popularGames = [
    { name: 'Counter-Strike 2', bg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop', players: '12K+ Active' },
    { name: 'Valorant', bg: 'https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=600&auto=format&fit=crop', players: '15K+ Active' },
    { name: 'League of Legends', bg: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=600&auto=format&fit=crop', players: '24K+ Active' },
    { name: 'Dota 2', bg: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=600&auto=format&fit=crop', players: '8K+ Active' }
  ];

  // Gaming Gears Store Mock
  const gears = [
    { id: 'g1', name: 'Pro Gaming Headphone V2', price: 120, desc: 'High fidelity audio spatial tracking', img: '/assets/images/gears-img-1.png' },
    { id: 'g2', name: 'Tactical Esports Controller', price: 85, desc: 'Ultra-low latency hall effect buttons', img: '/assets/images/gears-img-2.png' },
    { id: 'g3', name: 'Elite Carbon Face Shield', price: 45, desc: 'Full custom comfort ventilation filter', img: '/assets/images/gears-img-3.png' }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Successfully subscribed to the GameX Newsletter!');
    setEmail('');
  };

  const handleAddToCart = (item: string) => {
    toast.success(`${item} added to cart! (Mock)`);
  };

  return (
    <div className="relative min-h-screen bg-[#030303] overflow-x-hidden text-zinc-100">
      
      {/* 1. Hero Section with original background */}
      <section 
        className="relative pt-20 pb-16 md:pt-32 md:pb-24 border-b border-zinc-900 bg-center bg-cover bg-no-repeat"
        style={{ backgroundImage: 'url("/assets/images/hero-banner.jpg")' }}
      >
        {/* Dark overlay to make elements highly readable */}
        <div className="absolute inset-0 bg-black/75 z-0" />

        <Container className="relative text-center space-y-6 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black tracking-widest uppercase"
          >
            <Flame className="h-3 w-3 text-orange-500 animate-pulse" /> The Season 8 Brawl is Live
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tighter text-white font-oswald uppercase"
          >
            Where Gamers Become{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(249,115,22,0.25)] animate-pulse">
              Champions
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-zinc-300 text-sm md:text-base font-semibold leading-relaxed"
          >
            Join matches, compete in high-stakes leagues, track your stats in real-time, and win premium prize pools. Supported by FACEIT and FastAPI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <Link href="/tournaments">
              <Button size="lg" variant="glow" className="min-w-[180px] font-black uppercase text-sm">
                Explore Tournaments
              </Button>
            </Link>
            <Link href="/create-tournament">
              <Button size="lg" variant="outline" className="min-w-[180px] font-black uppercase text-sm border-zinc-800 hover:border-zinc-700 bg-zinc-950/80 hover:bg-zinc-900 text-white">
                Create Tournament
              </Button>
            </Link>
          </motion.div>
        </Container>
      </section>

      {/* Wrapper containing the original section-wrapper background image */}
      <div 
        className="bg-cover bg-center bg-no-repeat bg-fixed"
        style={{ backgroundImage: 'url("/assets/images/section-wrapper-bg.jpg")' }}
      >

        {/* 2. Platform Stats Banner */}
        <section className="py-10 bg-black/45 border-b border-zinc-900/60 backdrop-blur-md">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {platformStats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-center text-orange-500 mb-1">
                      <Icon className="h-5 w-5 drop-shadow-[0_0_5px_rgba(249,115,22,0.4)]" />
                    </div>
                    <p className="text-2xl md:text-3xl font-black text-white tracking-tight">{stat.value}</p>
                    <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </Container>
        </section>

        {/* 3. Featured Tournaments */}
        <section className="py-16 md:py-24 bg-black/25 border-b border-zinc-900/40 backdrop-blur-md">
          <Container>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-white font-oswald flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-orange-500" /> Featured Tournaments
                </h2>
                <p className="text-zinc-400 text-sm mt-1 font-semibold">High-stakes matches ready for signups right now.</p>
              </div>
              <Link href="/tournaments" className="mt-4 md:mt-0 flex items-center text-xs font-bold text-orange-400 hover:text-orange-300 transition-colors uppercase tracking-wider">
                View all tournaments <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </div>

            {isLoadingTournaments ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-80 w-full bg-zinc-900/50 rounded-xl animate-pulse border border-zinc-800" />
                ))}
              </div>
            ) : featuredTournaments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredTournaments.map((trn) => (
                  <TournamentCard key={trn.id} tournament={trn} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500 border border-dashed border-zinc-850 rounded-xl bg-zinc-950/20">
                No active tournaments found. Create one to get started!
              </div>
            )}
          </Container>
        </section>

        {/* 4. Supported Games Grid */}
        <section className="py-16 md:py-24 bg-black/15 border-b border-zinc-900/40 backdrop-blur-sm">
          <Container>
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-oswald flex items-center justify-center md:justify-start gap-2">
                <Gamepad2 className="h-6 w-6 text-orange-500" /> Supported Games
              </h2>
              <p className="text-zinc-400 text-sm mt-1 font-semibold">Ready to compete in your favorite titles.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {popularGames.map((game, idx) => (
                <div key={idx} className="group relative h-48 rounded-xl overflow-hidden border border-zinc-900 hover:border-orange-500/50 transition-all duration-300 shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={game.bg} alt={game.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <h4 className="text-base font-extrabold text-white uppercase tracking-tight leading-tight">{game.name}</h4>
                    <p className="text-[10px] text-orange-400 font-bold uppercase mt-0.5">{game.players}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* 5. Featured Organizers & Latest Winners (Split Layout) */}
        <section className="py-16 md:py-24 bg-black/25 border-b border-zinc-900/40 backdrop-blur-md">
          <Container className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Organizers List */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-white font-oswald flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6 text-orange-500" /> Featured Organizers
                </h2>
                <p className="text-zinc-400 text-sm mt-1 font-semibold">Verified leagues running weekly cups.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {topOrganizers.map((org) => (
                  <Card key={org.id} className="border-zinc-900/80 bg-zinc-950/45 p-4 flex items-center gap-4 hover:border-zinc-800 transition-colors shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={org.logo} alt={org.name} className="h-12 w-12 rounded-lg bg-zinc-900 border border-zinc-800" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{org.name}</h4>
                      <p className="text-xs text-zinc-500 font-semibold">{org.followers.toLocaleString()} Followers</p>
                    </div>
                    {org.verified && (
                      <span className="px-2 py-0.5 text-[9px] bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold rounded uppercase tracking-wider">
                        Verified
                      </span>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Latest Winners List */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-white font-oswald flex items-center gap-2">
                  <Star className="h-6 w-6 text-orange-500" /> Top Ranked Players
                </h2>
                <p className="text-zinc-400 text-sm mt-1 font-semibold">Top players by global leaderboard rank.</p>
              </div>
              <div className="space-y-3 bg-zinc-950/45 border border-zinc-900/80 p-4 rounded-xl shadow-sm">
                {topPlayers.map((player, idx) => (
                  <div key={player.id} className="flex items-center justify-between py-2 border-b border-zinc-905 last:border-0">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        'font-mono text-xs font-black px-1.5 py-0.5 rounded',
                        idx === 0 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        idx === 1 ? 'bg-zinc-400/20 text-zinc-300 border border-zinc-400/30' :
                        'bg-amber-600/20 text-amber-500 border border-amber-600/30'
                      )}>
                        #{idx + 1}
                      </span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={player.avatar} alt={player.username} className="h-8 w-8 rounded-full border border-zinc-800" />
                      <div>
                        <h4 className="text-xs font-black text-white hover:text-orange-400 transition-colors">
                          <Link href={`/profile/${player.username}`}>{player.username}</Link>
                        </h4>
                        <p className="text-[10px] text-zinc-500 font-semibold">{player.rank}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-orange-400">{(player.xp).toLocaleString()} XP</p>
                      <p className="text-[9px] text-zinc-500 font-semibold">{player.winRate}% WR</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>

        {/* 6. Esports Gears Store with gears background */}
        <section className="py-16 md:py-24 bg-black/15 border-b border-zinc-900/40 backdrop-blur-sm">
          <Container>
            <div className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-black uppercase tracking-tight text-white font-oswald flex items-center justify-center md:justify-start gap-2">
                <ShoppingBag className="h-6 w-6 text-orange-500" /> GameX Merch
              </h2>
              <p className="text-zinc-400 text-sm mt-1 font-semibold">High quality accessories designed for tactical gamers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gears.map((item) => (
                <Card 
                  key={item.id} 
                  className="overflow-hidden border-zinc-900/80 bg-zinc-950/45 hover:border-zinc-850 transition-all bg-cover bg-center bg-no-repeat shadow-md"
                  style={{ backgroundImage: 'url("/assets/images/gears-card-bg.png")' }}
                >
                  <div className="h-44 w-full bg-black/45 p-6 flex items-center justify-center border-b border-zinc-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.img} alt={item.name} className="h-36 object-contain" />
                  </div>
                  <CardContent className="p-5 space-y-3 bg-black/60 backdrop-blur-xs">
                    <div>
                      <h4 className="text-base font-bold text-white">{item.name}</h4>
                      <p className="text-xs text-zinc-400 mt-1">{item.desc}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-lg font-black text-orange-400">${item.price}</span>
                      <Button size="sm" variant="outline" className="text-xs font-semibold py-1 bg-zinc-950 hover:bg-zinc-900" onClick={() => handleAddToCart(item.name)}>
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </Container>
        </section>

        {/* 7. Newsletter Section with newsletter-bg */}
        <section 
          className="relative py-16 bg-zinc-950/80 border-b border-zinc-900 bg-center bg-cover bg-no-repeat overflow-hidden"
          style={{ backgroundImage: 'url("/assets/images/newsletter-bg.jpg")' }}
        >
          <div className="absolute inset-0 bg-black/80 z-0" />
          <Container className="relative text-center space-y-6 z-10">
            <h2 className="text-3xl font-black uppercase text-white font-oswald tracking-tight">
              Stay in the Game Loop
            </h2>
            <p className="text-zinc-400 text-sm max-w-lg mx-auto font-semibold">
              Get instant announcements regarding upcoming tournaments, qualifier signups, and high stakes leagues directly to your email inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row max-w-md mx-auto items-center gap-3 pt-2">
              <input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 w-full h-10 px-4 rounded-md border border-zinc-850 bg-zinc-950/80 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all"
              />
              <Button type="submit" variant="glow" className="w-full sm:w-auto h-10 font-bold uppercase text-xs">
                Subscribe
              </Button>
            </form>
          </Container>
        </section>

      </div>

      {/* 8. Footer with footer background */}
      <footer 
        className="relative bg-black py-12 text-zinc-500 text-xs bg-cover bg-center bg-no-repeat border-t border-zinc-900"
        style={{ backgroundImage: 'url("/assets/images/footer-bg.jpg")' }}
      >
        <div className="absolute inset-0 bg-black/85 z-0" />
        
        <Container className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-orange-500" />
              <span className="text-base font-black tracking-wider uppercase bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                GAMEX
              </span>
            </div>
            <p className="text-zinc-500 leading-relaxed font-semibold">
              The premier custom platform for building, matching, and winning tournament brackets.
            </p>
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h5>
            <ul className="space-y-2 font-semibold">
              <li><Link href="/tournaments" className="hover:text-white transition-colors">Find Tournaments</Link></li>
              <li><Link href="/create-tournament" className="hover:text-white transition-colors">Create Cups</Link></li>
              <li><Link href="/leaderboards" className="hover:text-white transition-colors">Leaderboards</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors">Community Forum</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Support</h5>
            <ul className="space-y-2 font-semibold">
              <li><Link href="#" className="hover:text-white transition-colors">FAQ & Rules</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Submit Ticket</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Use</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div className="space-y-2">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Disclaimer</h5>
            <p className="text-[11px] leading-relaxed">
              GameX is a client-side mock demo. All matches, profiles, and wallet tokens are simulation models.
            </p>
          </div>
        </Container>
        <Container className="relative mt-12 pt-6 border-t border-zinc-900/60 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] z-10">
          <p>© 2026 GameX. Built by code specialists.</p>
          <p>Powered by Next.js & FastAPI Architecture</p>
        </Container>
      </footer>

    </div>
  );
}
