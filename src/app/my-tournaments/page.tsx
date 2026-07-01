'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Trophy, ShieldAlert, Sparkles, CalendarDays, LayoutList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TournamentCard } from '@/components/TournamentCard';
import { TournamentService } from '@/services/tournament.service';
import { AuthService } from '@/services/auth.service';

export default function MyTournamentsPage() {
  const router = useRouter();

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

  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse font-extrabold uppercase font-oswald tracking-widest text-lg">
          Loading Account...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-zinc-900 bg-zinc-950 text-center p-6 space-y-4">
          <Trophy className="h-10 w-10 text-zinc-500 mx-auto" />
          <h2 className="text-xl font-bold uppercase tracking-tight text-white">Login Required</h2>
          <p className="text-sm text-zinc-400">
            You must be logged in to view your registered and hosted tournaments.
          </p>
          <Button variant="glow" onClick={() => router.push('/login')} className="w-full">
            Login
          </Button>
        </Card>
      </div>
    );
  }

  // Filter groups
  const registeredTournaments = tournaments.filter(t => 
    t.participants.some(p => p.id === user.id) && (t.status === 'upcoming' || t.status === 'live')
  );

  const hostedTournaments = tournaments.filter(t => 
    t.organizerId === user.id && t.status !== 'draft'
  );

  const completedTournaments = tournaments.filter(t => 
    (t.participants.some(p => p.id === user.id) || t.organizerId === user.id) && t.status === 'completed'
  );

  const draftTournaments = tournaments.filter(t => 
    t.organizerId === user.id && t.status === 'draft'
  );

  return (
    <div className="min-h-screen bg-[#030303] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-extrabold uppercase text-white font-oswald tracking-tight flex items-center gap-2">
            <LayoutList className="h-8 w-8 text-cyan-400" /> My Tournaments
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Manage and track your tournament entries and brackets.</p>
        </div>

        {/* Listings Tabs */}
        {isTournamentsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 w-full bg-zinc-900/50 rounded-xl border border-zinc-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <Tabs defaultValue="registered">
            <TabsList className="mb-6">
              <TabsTrigger value="registered">Registered ({registeredTournaments.length})</TabsTrigger>
              <TabsTrigger value="hosted">Created ({hostedTournaments.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedTournaments.length})</TabsTrigger>
              <TabsTrigger value="drafts">Drafts ({draftTournaments.length})</TabsTrigger>
            </TabsList>

            {/* Registered Tournaments Tab */}
            <TabsContent value="registered">
              {registeredTournaments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {registeredTournaments.map(t => (
                    <TournamentCard key={t.id} tournament={t} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-dashed border-zinc-900 rounded-xl bg-zinc-950/20 text-zinc-500">
                  <ShieldAlert className="h-8 w-8 mx-auto text-zinc-600 mb-2" />
                  No upcoming registered tournaments found. Browse lobby to join one!
                </div>
              )}
            </TabsContent>

            {/* Hosted Tournaments Tab */}
            <TabsContent value="hosted">
              {hostedTournaments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {hostedTournaments.map(t => (
                    <TournamentCard key={t.id} tournament={t} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-dashed border-zinc-900 rounded-xl bg-zinc-950/20 text-zinc-500">
                  <ShieldAlert className="h-8 w-8 mx-auto text-zinc-600 mb-2" />
                  You have not published any tournaments yet.
                </div>
              )}
            </TabsContent>

            {/* Completed Tournaments Tab */}
            <TabsContent value="completed">
              {completedTournaments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {completedTournaments.map(t => (
                    <TournamentCard key={t.id} tournament={t} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-dashed border-zinc-900 rounded-xl bg-zinc-950/20 text-zinc-500">
                  <ShieldAlert className="h-8 w-8 mx-auto text-zinc-600 mb-2" />
                  No completed tournaments in your competitive history.
                </div>
              )}
            </TabsContent>

            {/* Drafts Tab */}
            <TabsContent value="drafts">
              {draftTournaments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {draftTournaments.map(t => (
                    <TournamentCard key={t.id} tournament={t} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 border border-dashed border-zinc-900 rounded-xl bg-zinc-950/20 text-zinc-500">
                  <ShieldAlert className="h-8 w-8 mx-auto text-zinc-600 mb-2" />
                  No drafts saved.
                </div>
              )}
            </TabsContent>

          </Tabs>
        )}

      </div>
    </div>
  );
}
