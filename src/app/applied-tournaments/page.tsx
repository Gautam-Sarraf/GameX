'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trophy, CalendarDays, Search, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TournamentCard } from '@/components/TournamentCard';
import { TournamentService } from '@/services/tournament.service';
import { AuthService } from '@/services/auth.service';
import { Container } from '@/components/ui/Container';
import { toast } from 'react-toastify';

export default function AppliedTournamentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = React.useState('');

  // Fetch Session User
  const { data: user, isLoading: isUserLoading } = useQuery({
    queryKey: ['session-user'],
    queryFn: () => AuthService.getCurrentUser()
  });

  // Fetch Tournaments
  const { data: tournaments = [], isLoading: isTournamentsLoading } = useQuery({
    queryKey: ['tournaments'],
    queryFn: () => TournamentService.getTournaments(),
    enabled: !!user
  });

  // Handle register/deregister
  const registerMutation = useMutation({
    mutationFn: (id: string) => {
      if (!user) throw new Error('Not logged in');
      return TournamentService.registerForTournament(id, {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        rank: user.rank
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
    onError: () => {
      toast.error('Failed to update registration status.');
    }
  });

  const handleRegister = (id: string) => {
    registerMutation.mutate(id);
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-orange-500 animate-pulse font-extrabold uppercase font-oswald tracking-widest text-lg">
          Loading applied entries...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-zinc-900 bg-zinc-950/60 text-center p-6 space-y-4 shadow-xl">
          <Trophy className="h-10 w-10 text-zinc-500 mx-auto" />
          <h2 className="text-xl font-bold uppercase tracking-tight text-white">Login Required</h2>
          <p className="text-sm text-zinc-400">
            You must be logged in to view tournaments you have applied to.
          </p>
          <Button variant="glow" onClick={() => router.push('/login')} className="w-full">
            Login
          </Button>
        </Card>
      </div>
    );
  }

  // Filter tournaments where the user is a participant
  const appliedTournaments = tournaments.filter(t =>
    t.participants.some(p => p.id === user.id)
  );

  // Search filter
  const filteredTournaments = appliedTournaments.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.game.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#030303] py-10 px-4 sm:px-6 lg:px-8">
      <Container className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold uppercase text-white font-oswald tracking-tight flex items-center gap-2">
              <Trophy className="h-8 w-8 text-orange-500" /> Applied Tournaments
            </h1>
            <p className="text-zinc-400 text-sm mt-1">Track schedules, check-ins, and match brackets for events you joined.</p>
          </div>

          {/* Search bar */}
          {appliedTournaments.length > 0 && (
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
              <input
                type="text"
                placeholder="Filter joined tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full h-10 rounded-md border border-zinc-800 bg-zinc-900/60 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Listings content */}
        {isTournamentsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 w-full bg-zinc-900/40 rounded-xl border border-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : filteredTournaments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredTournaments.map((trn) => (
              <TournamentCard
                key={trn.id}
                tournament={trn}
                onRegisterClick={handleRegister}
                isRegistered={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-zinc-850 rounded-xl bg-zinc-950/20 max-w-2xl mx-auto space-y-4">
            <Trophy className="h-12 w-12 text-zinc-650 mx-auto" />
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">No Applied Tournaments</h3>
            <p className="text-sm text-zinc-500 max-w-md mx-auto">
              {searchQuery 
                ? "No matches found matching your search term."
                : "You haven't joined any competitive tournaments yet. Browse the lobby to find your first brawl!"}
            </p>
            {!searchQuery && (
              <Button variant="glow" onClick={() => router.push('/tournaments')} className="mt-2">
                Browse Tournaments
              </Button>
            )}
          </div>
        )}

      </Container>
    </div>
  );
}
