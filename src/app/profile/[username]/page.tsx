'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trophy, Award, MapPin, Wallet, Sparkles, Pencil, ArrowUp, Calendar, CheckCircle2, ChevronRight, Gamepad } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProfileService } from '@/services/profile.service';
import { AuthService } from '@/services/auth.service';
import { cn, formatCurrency } from '@/lib/utils';

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = React.use(params);
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  
  // Edit Profile form states
  const [editBio, setEditBio] = React.useState('');
  const [editCountry, setEditCountry] = React.useState('');
  const [editWallet, setEditWallet] = React.useState('');

  // Fetch Current User session
  const { data: sessionUser } = useQuery({
    queryKey: ['session-user'],
    queryFn: () => AuthService.getCurrentUser()
  });

  // Fetch Profile User
  const { data: profileUser, isLoading } = useQuery({
    queryKey: ['profile-detail', username],
    queryFn: () => ProfileService.getProfileByUsername(username),
    enabled: !!username
  });

  // Initialize edit fields when profile loads
  React.useEffect(() => {
    if (profileUser) {
      setEditBio(profileUser.bio || '');
      setEditCountry(profileUser.country || '');
      setEditWallet(profileUser.walletAddress || '');
    }
  }, [profileUser]);

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => ProfileService.updateProfile(data),
    onSuccess: (updated) => {
      toast.success('Profile updated successfully!');
      queryClient.setQueryData(['session-user'], updated);
      queryClient.invalidateQueries({ queryKey: ['profile-detail', username] });
      setIsEditOpen(false);
    }
  });

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      bio: editBio,
      country: editCountry,
      walletAddress: editWallet
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse font-extrabold uppercase font-oswald tracking-widest text-lg">
          Loading Profile Details...
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-zinc-500 font-extrabold uppercase font-oswald tracking-widest text-lg">
          Gamer Profile Not Found.
        </div>
      </div>
    );
  }

  const isOwnProfile = sessionUser?.id === profileUser.id;

  // Chart Mock Data: XP growth history
  const chartData = [
    { name: 'Match 1', xp: profileUser.xp - 500 },
    { name: 'Match 2', xp: profileUser.xp - 380 },
    { name: 'Match 3', xp: profileUser.xp - 220 },
    { name: 'Match 4', xp: profileUser.xp - 100 },
    { name: 'Match 5', xp: profileUser.xp }
  ];

  return (
    <div className="min-h-screen bg-[#030303] pb-16">
      
      {/* 1. Header Banner & Avatar */}
      <div className="relative h-48 md:h-72 w-full bg-zinc-900 border-b border-zinc-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={profileUser.banner} alt="" className="h-full w-full object-cover opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-black/20" />
      </div>

      {/* Profile Overview Banner card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-[-60px] relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-zinc-950/80 backdrop-blur-md border border-zinc-900 rounded-2xl p-6 shadow-2xl">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profileUser.avatar}
              alt={profileUser.username}
              className="h-28 w-28 rounded-full border-4 border-orange-500 bg-zinc-950 drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]"
            />
            <div className="text-center sm:text-left space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-black text-white font-oswald tracking-tight">{profileUser.username}</h1>
                <span className="px-2 py-0.5 text-[9px] bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold uppercase rounded">
                  Level {profileUser.level}
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-semibold flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="h-3.5 w-3.5" /> Country: {profileUser.country}
              </p>
              {profileUser.walletAddress && (
                <p className="text-[11px] text-zinc-500 font-mono flex items-center justify-center sm:justify-start gap-1">
                  <Wallet className="h-3 w-3 text-orange-400" /> {profileUser.walletAddress.slice(0, 6)}...{profileUser.walletAddress.slice(-4)}
                </p>
              )}
            </div>
          </div>

          <div className="w-full md:w-auto flex items-center gap-2">
            {isOwnProfile && (
              <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)} className="w-full md:w-auto font-bold text-xs bg-zinc-950">
                <Pencil className="h-3.5 w-3.5 mr-1 text-zinc-400" /> Edit Profile
              </Button>
            )}
          </div>

        </div>
      </div>

      {/* 2. Content Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Performance Stats & Bio */}
        <div className="space-y-6">
          
          {/* Bio card */}
          <Card>
            <CardContent className="p-6 space-y-3">
              <h3 className="text-sm font-extrabold uppercase text-white tracking-wider flex items-center gap-2 border-b border-zinc-900 pb-2">
                About Gamer
              </h3>
              <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
                {profileUser.bio || 'This gamer has not added a bio yet.'}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {profileUser.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 text-[9px] bg-zinc-900 border border-zinc-800 text-orange-400 rounded-md font-bold uppercase">
                    {t}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Core competitive stats */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <h3 className="text-sm font-extrabold uppercase text-white tracking-wider flex items-center gap-2 border-b border-zinc-900 pb-2">
                <Trophy className="h-4 w-4 text-orange-400" /> Stats Overview
              </h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-900">
                  <p className="text-2xl font-black text-white">{profileUser.winRate}%</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5">Win Rate</p>
                </div>
                <div className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-900">
                  <p className="text-2xl font-black text-white">{profileUser.tournamentWins}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5">Cups Won</p>
                </div>
                <div className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-900">
                  <p className="text-2xl font-black text-white">{profileUser.matchesPlayed}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5">Matches</p>
                </div>
                <div className="p-3 bg-zinc-900/40 rounded-lg border border-zinc-900">
                  <p className="text-lg font-black text-white truncate px-1">{profileUser.rank}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase mt-0.5">Rank Class</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Badges Equipped */}
          {profileUser.badges.length > 0 && (
            <Card>
              <CardContent className="p-6 space-y-3">
                <h3 className="text-sm font-extrabold uppercase text-white tracking-wider flex items-center gap-2 border-b border-zinc-900 pb-2">
                  <Sparkles className="h-4 w-4 text-orange-500" /> Equipped Badges
                </h3>
                <div className="grid grid-cols-1 gap-2.5">
                  {profileUser.badges.map(badge => (
                    <div key={badge.id} className="flex items-center gap-3 p-2 bg-zinc-900/40 rounded-lg border border-zinc-900">
                      <div className={cn('h-8 w-8 rounded-full flex items-center justify-center border font-bold text-xs', badge.color.replace('cyan', 'orange'))}>
                        ★
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white leading-tight">{badge.name}</p>
                        <p className="text-[10px] text-zinc-500 font-semibold">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div>

        {/* Right Side: Detailed tabs (Overview/Charts, Achievements, Activity History) */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="stats">
            <TabsList>
              <TabsTrigger value="stats">XP Progress</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            {/* Overview / XP Progress Chart */}
            <TabsContent value="stats" className="space-y-6">
              {/* Recharts chart */}
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="text-base font-extrabold uppercase text-white tracking-tight">
                    XP Progression (Last 5 Competitive Matches)
                  </h3>
                  
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <XAxis dataKey="name" stroke="#a1a1aa" fontSize={11} tickLine={false} />
                        <YAxis stroke="#a1a1aa" fontSize={11} tickLine={false} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                          labelStyle={{ color: '#f4f4f5', fontWeight: 'bold' }}
                          itemStyle={{ color: '#ea580c' }}
                        />
                        <Line
                          type="monotone"
                          dataKey="xp"
                          stroke="#ea580c"
                          strokeWidth={3}
                          activeDot={{ r: 6 }}
                          dot={{ fill: '#ea580c', r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* XP slider bar */}
              <Card>
                <CardContent className="p-6 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-400 font-semibold flex items-center">
                      <ArrowUp className="h-4 w-4 mr-1 text-orange-500" /> XP Level Progression
                    </span>
                    <span className="font-mono font-bold text-white">
                      {profileUser.xp % 1500} <span className="text-zinc-600">/ 1500 XP to Level {profileUser.level + 1}</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-900 border border-zinc-800 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${((profileUser.xp % 1500) / 1500) * 100}%` }}
                      className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-base font-extrabold uppercase text-white tracking-tight flex items-center gap-2 mb-6">
                    <Award className="h-5 w-5 text-orange-500" /> Gamer Achievements
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileUser.achievements.map(ach => {
                      const percent = Math.min(100, (ach.progress / ach.maxProgress) * 100);
                      const isUnlocked = !!ach.unlockedAt;
                      return (
                        <div key={ach.id} className="p-4 rounded-xl border border-zinc-900 bg-zinc-950/20 flex flex-col gap-2">
                          <div className="flex items-start gap-3">
                            <span className={cn(
                              'h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold border',
                              isUnlocked ? 'border-yellow-500/20 bg-yellow-950/20 text-yellow-400 shadow-[0_0_8px_rgba(234,179,8,0.2)]' :
                              'border-zinc-800 bg-zinc-900 text-zinc-500'
                            )}>
                              {isUnlocked ? '🏆' : '🔒'}
                            </span>
                            <div>
                              <h4 className="text-xs font-black text-white leading-tight">{ach.title}</h4>
                              <p className="text-[10px] text-zinc-500 font-semibold mt-0.5 leading-tight">{ach.description}</p>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="space-y-1 pt-1.5">
                            <div className="flex justify-between items-center text-[9px] font-mono font-bold text-zinc-500">
                              <span>Progress</span>
                              <span>{ach.progress} / {ach.maxProgress}</span>
                            </div>
                            <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-850">
                              <div
                                style={{ width: `${percent}%` }}
                                className={cn(
                                  'h-full rounded-full transition-all duration-350',
                                  isUnlocked ? 'bg-yellow-500' : 'bg-zinc-700'
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity History Tab */}
            <TabsContent value="activity">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-base font-extrabold uppercase text-white tracking-tight flex items-center gap-2 mb-6">
                    <Calendar className="h-5 w-5 text-purple-400" /> Recent Competitive History
                  </h3>
                  
                  <div className="relative border-l border-zinc-800 pl-4 space-y-6">
                    {profileUser.recentActivity.map(act => (
                      <div key={act.id} className="relative text-sm">
                        {/* Bullet point icon */}
                        <span className="absolute left-[-21px] top-1.5 h-2.5 w-2.5 rounded-full bg-cyan-400 border border-zinc-950 shadow-[0_0_5px_rgba(6,182,212,0.6)]" />
                        <div>
                          <p className="text-xs text-zinc-500 font-mono">{new Date(act.timestamp).toLocaleDateString()}</p>
                          <h4 className="text-xs font-bold text-white mt-0.5">{act.title}</h4>
                          <p className="text-[11px] text-zinc-400 font-semibold mt-0.5">{act.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

          </Tabs>
        </div>

      </div>

      {/* Edit Profile Dialog Modal */}
      {isOwnProfile && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent onClose={() => setIsEditOpen(false)}>
            <DialogHeader>
              <DialogTitle>Edit Profile Details</DialogTitle>
              <DialogDescription>Modify your bio, localized country flag, or web3 wallet tags.</DialogDescription>
            </DialogHeader>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Bio Description</label>
                <Textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell other gamers about yourself..."
                  rows={4}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Country Flag (2-letter ISO)</label>
                <Input
                  value={editCountry}
                  onChange={(e) => setEditCountry(e.target.value)}
                  placeholder="e.g. US, DE, KR, SE"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Web3 Wallet Address</label>
                <Input
                  value={editWallet}
                  onChange={(e) => setEditWallet(e.target.value)}
                  placeholder="e.g. 0x..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="glow" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
