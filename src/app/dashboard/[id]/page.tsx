'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Users, Megaphone, Trophy, Settings, FileSpreadsheet, Play, Check, X, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TournamentService } from '@/services/tournament.service';
import { AuthService } from '@/services/auth.service';

export default function OrganizerDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  
  const [announcement, setAnnouncement] = React.useState('');

  // Fetch Current User
  const { data: user } = useQuery({
    queryKey: ['session-user'],
    queryFn: () => AuthService.getCurrentUser()
  });

  // Fetch Tournament
  const { data: tournament, isLoading } = useQuery({
    queryKey: ['tournament-detail', id],
    queryFn: () => TournamentService.getTournamentById(id),
    enabled: !!id
  });

  // Approve Mutation
  const approveMutation = useMutation({
    mutationFn: (participantId: string) => TournamentService.approveParticipant(id, participantId),
    onSuccess: () => {
      toast.success('Participant registration approved!');
      queryClient.invalidateQueries({ queryKey: ['tournament-detail', id] });
    }
  });

  // Reject/Remove Mutation
  const rejectMutation = useMutation({
    mutationFn: (participantId: string) => TournamentService.rejectParticipant(id, participantId),
    onSuccess: () => {
      toast.success('Participant registration rejected/removed.');
      queryClient.invalidateQueries({ queryKey: ['tournament-detail', id] });
    }
  });

  // Publish Mutation
  const publishMutation = useMutation({
    mutationFn: () => TournamentService.publishTournament(id),
    onSuccess: () => {
      toast.success('Tournament published to upcoming lobby!');
      queryClient.invalidateQueries({ queryKey: ['tournament-detail', id] });
    }
  });

  // Start Tournament Mutation
  const startMutation = useMutation({
    mutationFn: () => TournamentService.startTournament(id),
    onSuccess: (updated) => {
      toast.success(`Tournament matches started! Bracket generated for ${updated.status} status.`);
      queryClient.invalidateQueries({ queryKey: ['tournament-detail', id] });
    }
  });

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcement.trim()) return;
    toast.success(`Announcement broadcasted: "${announcement}"`);
    setAnnouncement('');
  };

  const handleExportCSV = () => {
    if (!tournament) return;
    const headers = 'ID,Username,Status,Joined At\n';
    const rows = tournament.participants.map(p => 
      `"${p.id}","${p.username}","${p.status}","${p.joinedAt}"`
    ).join('\n');
    
    navigator.clipboard.writeText(headers + rows);
    toast.success('Participants exported! CSV data copied to clipboard.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse font-extrabold uppercase font-oswald tracking-widest text-lg">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-zinc-500 font-extrabold uppercase font-oswald tracking-widest text-lg">
          Tournament Not Found.
        </div>
      </div>
    );
  }

  // Security check: only allow organizer
  if (user && tournament.organizerId !== user.id) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-red-900 bg-zinc-950 text-center p-6 space-y-4">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold uppercase tracking-tight text-white">Access Denied</h2>
          <p className="text-sm text-zinc-400">
            You do not have organizer permissions to manage this tournament.
          </p>
          <Button variant="outline" onClick={() => router.push('/')} className="w-full">
            Return Home
          </Button>
        </Card>
      </div>
    );
  }

  const pending = tournament.participants.filter(p => p.status === 'pending');
  const approved = tournament.participants.filter(p => p.status === 'approved');

  return (
    <div className="min-h-screen bg-[#030303] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-6">
          <div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-zinc-900 border border-zinc-800 text-cyan-400 rounded uppercase">
              Organizer Panel
            </span>
            <h1 className="text-4xl font-extrabold uppercase text-white font-oswald tracking-tight mt-2">
              {tournament.title} Dashboard
            </h1>
            <p className="text-zinc-400 text-sm mt-1">Manage registration requests, brackets, announcements, and settings.</p>
          </div>

          {/* Core Controls */}
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" className="bg-zinc-950 border-zinc-850" onClick={handleExportCSV}>
              <FileSpreadsheet className="h-4 w-4 mr-2 text-emerald-500" /> Export CSV
            </Button>
            
            {tournament.status === 'draft' && (
              <Button variant="glow" size="sm" onClick={() => publishMutation.mutate()}>
                <Check className="h-4 w-4 mr-2" /> Publish Tournament
              </Button>
            )}

            {tournament.status === 'upcoming' && (
              <Button
                variant="glow"
                size="sm"
                disabled={approved.length < 2 || startMutation.isPending}
                onClick={() => startMutation.mutate()}
              >
                <Play className="h-4 w-4 mr-2 fill-current" /> Start Tournament
              </Button>
            )}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="border-zinc-900/60 bg-zinc-950/40">
            <CardContent className="p-6 flex items-center gap-4">
              <Users className="h-10 w-10 text-cyan-400 p-2 rounded-lg bg-cyan-950/20" />
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Total Slots</p>
                <p className="text-2xl font-black text-white">{tournament.registeredCount} / {tournament.maxSlots}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-zinc-900/60 bg-zinc-950/40">
            <CardContent className="p-6 flex items-center gap-4">
              <ShieldCheck className="h-10 w-10 text-emerald-400 p-2 rounded-lg bg-emerald-950/20" />
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Approved Players</p>
                <p className="text-2xl font-black text-white">{approved.length} Approved</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-zinc-900/60 bg-zinc-950/40">
            <CardContent className="p-6 flex items-center gap-4">
              <AlertCircle className="h-10 w-10 text-yellow-400 p-2 rounded-lg bg-yellow-950/20" />
              <div>
                <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Pending Approvals</p>
                <p className="text-2xl font-black text-white">{pending.length} Pending</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Control split */}
        <Tabs defaultValue="participants">
          <TabsList className="mb-6">
            <TabsTrigger value="participants">Approved Players ({approved.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending Registrations ({pending.length})</TabsTrigger>
            <TabsTrigger value="announcements">Broadcaster</TabsTrigger>
            <TabsTrigger value="brackets">Bracket Controller</TabsTrigger>
          </TabsList>

          {/* Approved Players Tab */}
          <TabsContent value="participants">
            <Card>
              <CardContent className="p-6">
                {approved.length > 0 ? (
                  <div className="space-y-4">
                    {approved.map(p => (
                      <div key={p.id} className="flex justify-between items-center p-3 border border-zinc-900 bg-zinc-950/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.avatar} alt="" className="h-8 w-8 rounded-full border border-zinc-800" />
                          <div>
                            <p className="text-sm font-bold text-white">{p.username}</p>
                            <p className="text-[10px] text-zinc-500 font-semibold">{p.rank || 'Bronze'}</p>
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => rejectMutation.mutate(p.id)}
                          className="h-8 px-3 text-xs"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-zinc-500 text-sm">
                    No approved participants. Review pending registrations.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Approvals Tab */}
          <TabsContent value="pending">
            <Card>
              <CardContent className="p-6">
                {pending.length > 0 ? (
                  <div className="space-y-4">
                    {pending.map(p => (
                      <div key={p.id} className="flex justify-between items-center p-3 border border-zinc-900 bg-zinc-950/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.avatar} alt="" className="h-8 w-8 rounded-full border border-zinc-800" />
                          <div>
                            <p className="text-sm font-bold text-white">{p.username}</p>
                            <p className="text-[10px] text-zinc-500 font-semibold">{p.rank || 'Bronze'}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => approveMutation.mutate(p.id)}
                            className="p-1.5 rounded-md border border-zinc-800 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40 cursor-pointer"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => rejectMutation.mutate(p.id)}
                            className="p-1.5 rounded-md border border-zinc-800 bg-red-950/20 text-red-400 hover:bg-red-950/40 cursor-pointer"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-zinc-500 text-sm">
                    No pending registration requests.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Announcements Broadcaster Tab */}
          <TabsContent value="announcements">
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start gap-3">
                  <Megaphone className="h-10 w-10 text-purple-400 p-2 bg-purple-950/20 rounded-lg" />
                  <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-tight">Push Organizer Broadcast</h3>
                    <p className="text-xs text-zinc-500 mt-0.5">Send a real-time notification alert to all registered participant players.</p>
                  </div>
                </div>

                <form onSubmit={handlePostAnnouncement} className="space-y-4 pt-4 border-t border-zinc-900">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Announcement Text</label>
                    <textarea
                      placeholder="e.g. Tournament server settings are updated. Match round 1 checking starting in 10 minutes..."
                      required
                      value={announcement}
                      onChange={(e) => setAnnouncement(e.target.value)}
                      className="w-full min-h-[100px] p-3 rounded-md border border-zinc-800 bg-zinc-900/60 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <Button type="submit" variant="glow" size="sm">
                    Broadcast Update
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bracket Controller Tab */}
          <TabsContent value="brackets">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2 mb-4">
                  <Trophy className="h-4 w-4 text-yellow-500" /> Active Bracket Controls
                </h3>
                
                {tournament.status === 'upcoming' && (
                  <div className="p-5 rounded-lg border border-yellow-500/20 bg-yellow-950/10 flex items-center gap-4 text-sm text-yellow-400/90 font-medium">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    <div>
                      <p className="font-bold">Tournament is currently Scheduled</p>
                      <p className="text-xs text-yellow-500/70 font-semibold mt-0.5">
                        Ensure you approve all pending registrations before starting. You need at least 2 approved participants to initialize match pairings.
                      </p>
                    </div>
                  </div>
                )}

                {tournament.bracket && tournament.bracket.length > 0 ? (
                  <div className="space-y-4 mt-6">
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Bracket Matches List ({tournament.bracket.length})</p>
                    <div className="space-y-3">
                      {tournament.bracket.map(match => (
                        <div key={match.id} className="flex justify-between items-center p-3 border border-zinc-900 bg-zinc-950/20 rounded-lg text-xs">
                          <div>
                            <span className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-bold uppercase mr-2">
                              R{match.round}
                            </span>
                            <span className="font-bold text-white">{match.p1?.username || 'TBD'}</span>
                            <span className="text-zinc-600 px-2 font-black">vs</span>
                            <span className="font-bold text-white">{match.p2?.username || 'TBD'}</span>
                          </div>
                          <span className="px-2 py-0.5 text-[9px] bg-cyan-950/40 border border-cyan-800 text-cyan-400 font-bold uppercase rounded">
                            {match.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-zinc-500 text-sm">
                    No active bracket loaded. Wait for the tournament to start.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>

      </div>
    </div>
  );
}
