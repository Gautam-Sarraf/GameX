'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trophy, Calendar, Users, Shield, Share2, Bookmark, Check, CalendarDays, BookOpen, MessageSquare, Award, PlayCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { TournamentService } from '@/services/tournament.service';
import { AuthService } from '@/services/auth.service';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

export default function TournamentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = React.useState('');
  const [localComments, setLocalComments] = React.useState<{ authorUsername: string; authorAvatar: string; content: string; timestamp: string }[]>([]);

  // Fetch Current User
  const { data: user } = useQuery({
    queryKey: ['session-user'],
    queryFn: () => AuthService.getCurrentUser()
  });

  // Fetch Tournament Details
  const { data: tournament, isLoading } = useQuery({
    queryKey: ['tournament-detail', id],
    queryFn: () => TournamentService.getTournamentById(id),
    enabled: !!id
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: (userObj: any) => TournamentService.registerForTournament(id, userObj),
    onSuccess: (updated) => {
      toast.success(`Successfully registered for "${updated.title}"!`);
      queryClient.invalidateQueries({ queryKey: ['tournament-detail', id] });
    }
  });

  // Bookmark Mutation
  const bookmarkMutation = useMutation({
    mutationFn: () => TournamentService.toggleBookmark(id),
    onSuccess: (updated) => {
      toast.success(updated.bookmarked ? 'Added tournament to bookmarks.' : 'Removed from bookmarks.');
      queryClient.invalidateQueries({ queryKey: ['tournament-detail', id] });
    }
  });

  const handleRegister = () => {
    if (!user) {
      toast.error('Please login first to join.');
      return;
    }
    if (!tournament) return;
    registerMutation.mutate({ id: user.id, username: user.username, avatar: user.avatar, rank: user.rank });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Tournament link copied to clipboard!');
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    if (!user) {
      toast.error('Please login to post a comment.');
      return;
    }
    const newComment = {
      authorUsername: user.username,
      authorAvatar: user.avatar,
      content: commentText,
      timestamp: new Date().toISOString()
    };
    setLocalComments(prev => [...prev, newComment]);
    setCommentText('');
    toast.success('Comment posted successfully!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse font-extrabold uppercase font-oswald tracking-widest text-lg">
          Loading Tournament Details...
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

  const isUserRegistered = user ? tournament.participants.some(p => p.id === user.id) : false;
  const isSlotsFull = tournament.registeredCount >= tournament.maxSlots;

  // Group bracket matches by round
  const bracketRounds = tournament.bracket
    ? tournament.bracket.reduce((acc, match) => {
        acc[match.round] = acc[match.round] || [];
        acc[match.round].push(match);
        return acc;
      }, {} as { [round: number]: typeof tournament.bracket })
    : {};

  return (
    <div className="min-h-screen bg-[#030303] pb-16">
      
      {/* 1. Header Banner */}
      <div className="relative h-64 md:h-96 bg-zinc-900 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={tournament.banner} alt={tournament.title} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-black/30" />
        
        {/* Header Overlay Content */}
        <div className="absolute bottom-6 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-3">
            <span className="px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 rounded-md">
              {tournament.game}
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-white font-oswald uppercase tracking-tight">
              {tournament.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300">
              <span className="flex items-center"><Shield className="h-4 w-4 mr-1 text-cyan-400" /> Hosted by {tournament.organizerName}</span>
              <span className="flex items-center"><Calendar className="h-4 w-4 mr-1 text-purple-400" /> {formatDate(tournament.startDate)}</span>
              <span className="flex items-center"><Users className="h-4 w-4 mr-1 text-blue-400" /> {tournament.registeredCount} / {tournament.maxSlots} Players</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <Button variant="outline" size="icon" className="border-zinc-800 bg-zinc-950" onClick={handleShare}>
              <Share2 className="h-4 w-4 text-zinc-400" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn('border-zinc-800 bg-zinc-950', tournament.bookmarked && 'border-cyan-500/50 bg-cyan-950/20')}
              onClick={() => bookmarkMutation.mutate()}
            >
              <Bookmark className={cn('h-4 w-4 text-zinc-400', tournament.bookmarked && 'text-cyan-400 fill-cyan-400')} />
            </Button>
            {tournament.status === 'upcoming' && (
              <Button
                variant={isUserRegistered ? 'secondary' : 'default'}
                disabled={isSlotsFull && !isUserRegistered}
                onClick={handleRegister}
                className="font-bold uppercase tracking-wider text-xs px-6 py-2"
              >
                {isUserRegistered ? 'Registered' : isSlotsFull ? 'Slots Full' : 'Register Now'}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Content Split */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left column: Tabs */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="overview">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bracket">Bracket</TabsTrigger>
              <TabsTrigger value="participants">Participants</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* About description */}
              <Card>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-cyan-400" /> Tournament Rules & Info
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed font-semibold">
                    {tournament.description}
                  </p>
                  <ul className="list-disc pl-5 pt-2 text-sm text-zinc-400 space-y-2 font-semibold">
                    {tournament.rules.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-purple-400" /> Event Schedule
                  </h3>
                  <div className="space-y-3">
                    {tournament.schedule.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b border-zinc-900 last:border-0 text-sm">
                        <span className="text-zinc-300 font-bold">{item.stage}</span>
                        <span className="text-zinc-500 font-semibold">{item.date} • {item.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bracket Tab */}
            <TabsContent value="bracket">
              <Card>
                <CardContent className="p-6 overflow-x-auto">
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2 mb-6">
                    <Trophy className="h-4 w-4 text-yellow-500" /> Tournament Bracket
                  </h3>
                  
                  {tournament.bracket && tournament.bracket.length > 0 ? (
                    <div className="flex gap-10 min-w-[600px] justify-start py-4">
                      {Object.keys(bracketRounds).map((roundStr) => {
                        const round = parseInt(roundStr);
                        return (
                          <div key={round} className="flex-1 flex flex-col justify-around gap-6">
                            <h4 className="text-xs text-zinc-500 uppercase font-black tracking-wider text-center border-b border-zinc-900 pb-2">
                              Round {round === 3 ? 'Finals' : round === 2 ? 'Semifinals' : `Round ${round}`}
                            </h4>
                            {bracketRounds[round].map((match) => (
                              <div
                                key={match.id}
                                className="border border-zinc-800 bg-zinc-950 p-3 rounded-lg space-y-2 relative"
                              >
                                {/* Participant 1 */}
                                <div className={cn(
                                  'flex items-center justify-between text-xs py-1 rounded px-1.5',
                                  match.winner === match.p1?.username && 'bg-cyan-950/20 text-cyan-400 font-bold border border-cyan-900/30'
                                )}>
                                  <div className="flex items-center gap-2">
                                    {match.p1?.avatar && (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img src={match.p1.avatar} alt="" className="h-5 w-5 rounded-full" />
                                    )}
                                    <span className="truncate max-w-[100px]">{match.p1?.username || 'TBD'}</span>
                                  </div>
                                  <span className="font-mono text-zinc-400 font-bold">{match.p1?.score ?? '-'}</span>
                                </div>

                                {/* Participant 2 */}
                                <div className={cn(
                                  'flex items-center justify-between text-xs py-1 rounded px-1.5',
                                  match.winner === match.p2?.username && 'bg-cyan-950/20 text-cyan-400 font-bold border border-cyan-900/30'
                                )}>
                                  <div className="flex items-center gap-2">
                                    {match.p2?.avatar && (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img src={match.p2.avatar} alt="" className="h-5 w-5 rounded-full" />
                                    )}
                                    <span className="truncate max-w-[100px]">{match.p2?.username || 'TBD'}</span>
                                  </div>
                                  <span className="font-mono text-zinc-400 font-bold">{match.p2?.score ?? '-'}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-zinc-500 font-semibold text-sm">
                      Bracket will be generated once the tournament is set live by the organizer.
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Participants Tab */}
            <TabsContent value="participants">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2 mb-6">
                    <Users className="h-4 w-4 text-cyan-400" /> Registered Players ({tournament.registeredCount})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tournament.participants.map((player) => (
                      <div
                        key={player.id}
                        className="flex items-center justify-between p-3 border border-zinc-900 bg-zinc-950/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={player.avatar} alt={player.username} className="h-8 w-8 rounded-full border border-zinc-800" />
                          <div>
                            <h4 className="text-sm font-bold text-white">{player.username}</h4>
                            <p className="text-[10px] text-zinc-500 font-semibold">{player.rank || 'Bronze'}</p>
                          </div>
                        </div>
                        <span className={cn(
                          'px-2 py-0.5 text-[10px] font-bold uppercase rounded',
                          player.status === 'approved' ? 'text-emerald-400 bg-emerald-950/20' : 'text-yellow-400 bg-yellow-950/20'
                        )}>
                          {player.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Discussion Tab */}
            <TabsContent value="discussion">
              <Card>
                <CardContent className="p-6 space-y-6">
                  <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-purple-400" /> Comments & Discussion
                  </h3>

                  {/* Comment Input */}
                  <form onSubmit={handlePostComment} className="flex gap-3">
                    <input
                      type="text"
                      placeholder={user ? "Write a comment..." : "Login to post comments..."}
                      disabled={!user}
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="flex-grow h-10 px-4 rounded-md border border-zinc-800 bg-zinc-900/60 text-sm text-white focus:outline-none focus:border-cyan-500"
                    />
                    <Button type="submit" disabled={!user || !commentText.trim()} size="sm">
                      Post
                    </Button>
                  </form>

                  {/* Comments List */}
                  <div className="space-y-4 pt-4 border-t border-zinc-900">
                    {[...localComments].reverse().map((comm, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={comm.authorAvatar} alt="" className="h-8 w-8 rounded-full border border-zinc-800" />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{comm.authorUsername}</span>
                            <span className="text-[10px] text-zinc-500 font-semibold">{new Date(comm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-zinc-300 font-semibold">{comm.content}</p>
                        </div>
                      </div>
                    ))}
                    
                    {tournament.participants.length > 0 ? (
                      tournament.participants.slice(0, 3).map((p, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.avatar} alt="" className="h-8 w-8 rounded-full border border-zinc-800" />
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{p.username}</span>
                              <span className="text-[10px] text-zinc-500 font-semibold">2 hours ago</span>
                            </div>
                            <p className="text-zinc-300 font-semibold">Ready for this! Good luck to all squads registering.</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-zinc-500 text-xs font-semibold">
                        No comments yet. Be the first to post!
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>

        {/* Right column: Info Sidebar */}
        <div className="space-y-6">
          {/* Rewards Card */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-base font-extrabold uppercase text-white tracking-tight flex items-center gap-2 border-b border-zinc-900 pb-3">
                <Award className="h-4 w-4 text-yellow-500" /> Prize Distribution
              </h3>
              <div className="space-y-3">
                {tournament.prizes.map((prize, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-zinc-400 font-semibold">{prize.rank}</span>
                    <span className="font-black text-white">{prize.reward}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Metrics */}
          <Card>
            <CardContent className="p-6 space-y-4 text-sm">
              <h3 className="text-base font-extrabold uppercase text-white tracking-tight flex items-center gap-2 border-b border-zinc-900 pb-3">
                Quick Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-semibold">Format</span>
                  <span className="font-bold text-zinc-300">Single Elimination</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-semibold">Entry Fee</span>
                  <span className="font-bold text-cyan-400">{tournament.entryFee > 0 ? formatCurrency(tournament.entryFee) : 'FREE'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-semibold">Slots Limit</span>
                  <span className="font-bold text-zinc-300">{tournament.maxSlots} Slots</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500 font-semibold">Status</span>
                  <span className="font-bold uppercase text-yellow-500">{tournament.status}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Manage Dashboard link (Visible only if organizer is logged in user) */}
          {user && tournament.organizerId === user.id && (
            <Link href={`/dashboard/${tournament.id}`}>
              <Button variant="glow" className="w-full uppercase font-black text-xs tracking-wider">
                <PlayCircle className="h-4 w-4 mr-2" /> Manage Organizer Dashboard
              </Button>
            </Link>
          )}

        </div>

      </div>
    </div>
  );
}
