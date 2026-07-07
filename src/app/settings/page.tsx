'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Settings, Shield, Bell, Key, Wallet, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AuthService } from '@/services/auth.service';
import { ProfileService } from '@/services/profile.service';

export default function SettingsPage() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = React.useState('general');

  // Form inputs
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [wallet, setWallet] = React.useState('');

  // Fetch Session User
  const { data: user, isLoading } = useQuery({
    queryKey: ['session-user'],
    queryFn: () => AuthService.getCurrentUser()
  });

  React.useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setWallet(user.walletAddress || '');
    }
  }, [user]);

  // Update Settings mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (data: any) => ProfileService.updateProfile(data),
    onSuccess: (updated) => {
      toast.success('Settings updated successfully!');
      queryClient.setQueryData(['session-user'], updated);
    }
  });

  const handleGeneralSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate({ username, email });
  };

  const handleWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettingsMutation.mutate({ walletAddress: wallet });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse font-extrabold uppercase font-oswald tracking-widest text-lg">
          Loading Settings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-zinc-900 pb-6">
          <h1 className="text-4xl font-extrabold uppercase text-white font-oswald tracking-tight flex items-center gap-2">
            <Settings className="h-8 w-8 text-cyan-400" /> Account Settings
          </h1>
          <p className="text-zinc-400 text-sm mt-1">Configure profile details, linked Web3 wallets, and email filters.</p>
        </div>

        {/* Tab Controls split */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Sidebar list trigger */}
            <div className="w-full md:w-64 flex-shrink-0">
              <TabsList className="flex flex-col w-full h-auto p-1 bg-zinc-950/80 border border-zinc-900 rounded-xl space-y-1">
                <TabsTrigger value="general" className="w-full justify-start py-2.5 px-3">
                  <Settings className="h-4 w-4 mr-2 text-cyan-400" /> General
                </TabsTrigger>
                <TabsTrigger value="wallet" className="w-full justify-start py-2.5 px-3">
                  <Wallet className="h-4 w-4 mr-2 text-purple-400" /> Web3 Wallet
                </TabsTrigger>
                <TabsTrigger value="notifications" className="w-full justify-start py-2.5 px-3">
                  <Bell className="h-4 w-4 mr-2 text-yellow-500" /> Notifications
                </TabsTrigger>
                <TabsTrigger value="security" className="w-full justify-start py-2.5 px-3">
                  <Key className="h-4 w-4 mr-2 text-red-500" /> Privacy & Security
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Content areas */}
            <div className="flex-grow">
              
              {/* General Tab */}
              <TabsContent value="general" className="mt-0">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-base font-extrabold uppercase text-white tracking-tight border-b border-zinc-900 pb-2">
                      General Settings
                    </h3>
                    <form onSubmit={handleGeneralSubmit} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Username</label>
                        <Input
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Email Address</label>
                        <Input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <Button type="submit" variant="glow" size="sm">
                        Save Changes
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Wallet Tab */}
              <TabsContent value="wallet" className="mt-0">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-base font-extrabold uppercase text-white tracking-tight border-b border-zinc-900 pb-2">
                      Web3 Wallet Integration
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed font-semibold">
                      Link your MetaMask, Coinbase, or Ledger wallet to receive direct prize pool disbursements and verification badge credentials.
                    </p>
                    <form onSubmit={handleWalletSubmit} className="space-y-4 pt-2">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Ethereum Wallet Address</label>
                        <Input
                          placeholder="e.g. 0x..."
                          value={wallet}
                          onChange={(e) => setWallet(e.target.value)}
                        />
                      </div>
                      <Button type="submit" variant="glow" size="sm">
                        Link Wallet
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-base font-extrabold uppercase text-white tracking-tight border-b border-zinc-900 pb-2">
                      Email & Push Alerts
                    </h3>
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center text-sm py-2">
                        <div>
                          <p className="font-bold text-white">Match Ready Alerts</p>
                          <p className="text-xs text-zinc-500 font-semibold">Get pushes when opponents check-in and lobbies load.</p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4 border-zinc-800 rounded bg-zinc-900 accent-cyan-500 cursor-pointer" />
                      </div>
                      <div className="flex justify-between items-center text-sm py-2">
                        <div>
                          <p className="font-bold text-white">Weekly Platform Summary</p>
                          <p className="text-xs text-zinc-500 font-semibold">Receive custom summaries, top leaderboard highlights, and tournament tips.</p>
                        </div>
                        <input type="checkbox" className="h-4 w-4 border-zinc-800 rounded bg-zinc-900 accent-cyan-500 cursor-pointer" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="security" className="mt-0">
                <Card>
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-base font-extrabold uppercase text-white tracking-tight border-b border-zinc-900 pb-2">
                      Privacy & Visibility Configurations
                    </h3>
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-between items-center text-sm py-2">
                        <div>
                          <p className="font-bold text-white">Public Profile Search</p>
                          <p className="text-xs text-zinc-500 font-semibold">Allow players to look up your match history and badges stats globally.</p>
                        </div>
                        <input type="checkbox" defaultChecked className="h-4 w-4 border-zinc-800 rounded bg-zinc-900 accent-cyan-500 cursor-pointer" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

            </div>

          </div>
        </Tabs>

      </div>
    </div>
  );
}
