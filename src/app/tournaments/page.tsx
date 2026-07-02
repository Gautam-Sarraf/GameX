'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, SlidersHorizontal, LayoutGrid, List, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { TournamentCard } from '@/components/TournamentCard';
import { Container } from '@/components/ui/Container';
import { TournamentService } from '@/services/tournament.service';
import { AuthService } from '@/services/auth.service';
import { GAMES } from '@/mock/data';
import { Tournament } from '@/types';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

export default function TournamentsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = React.useState('');
  const [selectedGame, setSelectedGame] = React.useState('All');
  const [selectedStatus, setSelectedStatus] = React.useState('All');
  const [selectedFee, setSelectedFee] = React.useState('All');
  const [sortBy, setSortBy] = React.useState('date_asc');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 9;

  // Fetch Session User
  const { data: user } = useQuery({
    queryKey: ['session-user'],
    queryFn: () => AuthService.getCurrentUser()
  });

  // Fetch Tournaments
  const { data: tournaments = [], isLoading } = useQuery({
    queryKey: ['tournaments'],
    queryFn: () => TournamentService.getTournaments()
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: ({ id, userObj }: { id: string; userObj: any }) => 
      TournamentService.registerForTournament(id, userObj),
    onSuccess: (updated) => {
      toast.success(`Successfully registered for "${updated.title}"! Status: Pending Approval.`);
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
    },
    onError: () => {
      toast.error('Failed to register. Please try again.');
    }
  });

  const handleRegister = (id: string) => {
    if (!user) {
      toast.error('Please login first to join tournaments.');
      return;
    }
    const trn = tournaments.find(t => t.id === id);
    if (!trn) return;
    if (trn.participants.some(p => p.id === user.id)) {
      toast.info('You are already registered for this tournament.');
      return;
    }
    registerMutation.mutate({ id, userObj: { id: user.id, username: user.username, avatar: user.avatar, rank: user.rank } });
  };

  // Filter & Sort Logic
  const filteredTournaments = React.useMemo(() => {
    let result = [...tournaments];

    // Search Filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t => 
        t.title.toLowerCase().includes(q) || 
        t.game.toLowerCase().includes(q) ||
        t.organizerName.toLowerCase().includes(q)
      );
    }

    // Game Filter
    if (selectedGame !== 'All') {
      result = result.filter(t => t.game === selectedGame);
    }

    // Status Filter
    if (selectedStatus !== 'All') {
      result = result.filter(t => t.status === selectedStatus.toLowerCase());
    }

    // Fee Filter
    if (selectedFee !== 'All') {
      if (selectedFee === 'Free') {
        result = result.filter(t => t.entryFee === 0);
      } else {
        result = result.filter(t => t.entryFee > 0);
      }
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date_asc') {
        return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
      }
      if (sortBy === 'date_desc') {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }
      if (sortBy === 'prize_desc') {
        return b.prizePool - a.prizePool;
      }
      return 0;
    });

    return result;
  }, [tournaments, search, selectedGame, selectedStatus, selectedFee, sortBy]);

  // Reset pagination when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedGame, selectedStatus, selectedFee, sortBy]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredTournaments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTournaments.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="min-h-screen bg-[#030303] py-10 px-4 sm:px-6 lg:px-8">
      <Container className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-extrabold uppercase text-white font-oswald tracking-tight flex items-center gap-2">
              <Trophy className="h-8 w-8 text-orange-500" /> Tournaments Lobby
            </h1>
            <p className="text-zinc-400 text-sm mt-1">Explore, register, and conquer active leagues.</p>
          </div>
          
          {/* Layout Mode Toggles */}
          <div className="flex items-center space-x-2 border border-zinc-850 p-1 rounded-md bg-zinc-950/60">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-1.5 rounded transition-all cursor-pointer',
                viewMode === 'grid' ? 'bg-zinc-900 text-orange-500' : 'text-zinc-500 hover:text-zinc-450'
              )}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-1.5 rounded transition-all cursor-pointer',
                viewMode === 'list' ? 'bg-zinc-900 text-orange-500' : 'text-zinc-500 hover:text-zinc-450'
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 rounded-xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md shadow-sm">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-full h-10 rounded-md border border-zinc-800 bg-zinc-900/60 text-sm text-white placeholder-zinc-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Game Selection */}
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="h-10 rounded-md border border-zinc-800 bg-zinc-900/60 text-sm text-white px-3 focus:border-orange-500 focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-zinc-950 text-white">All Games</option>
            {GAMES.map(g => (
              <option key={g} value={g} className="bg-zinc-950 text-white">{g}</option>
            ))}
          </select>

          {/* Status Selection */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="h-10 rounded-md border border-zinc-800 bg-zinc-900/60 text-sm text-white px-3 focus:border-orange-500 focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-zinc-950 text-white">All Statuses</option>
            <option value="Upcoming" className="bg-zinc-950 text-white">Upcoming</option>
            <option value="Live" className="bg-zinc-950 text-white">Live</option>
            <option value="Completed" className="bg-zinc-950 text-white">Completed</option>
          </select>

          {/* Sort selection */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 rounded-md border border-zinc-800 bg-zinc-900/60 text-sm text-white px-3 focus:border-orange-500 focus:outline-none cursor-pointer"
          >
            <option value="date_asc" className="bg-zinc-950 text-white">Start Date (Earliest)</option>
            <option value="date_desc" className="bg-zinc-950 text-white">Start Date (Latest)</option>
            <option value="prize_desc" className="bg-zinc-950 text-white">Prize Pool (Highest)</option>
          </select>
        </div>

        {/* Listings Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 w-full bg-zinc-900/40 rounded-xl border border-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : currentItems.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {currentItems.map((trn) => (
                <TournamentCard
                  key={trn.id}
                  tournament={trn}
                  onRegisterClick={handleRegister}
                  isRegistered={user ? trn.participants.some(p => p.id === user.id) : false}
                />
              ))}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {currentItems.map((trn) => {
                const isUserRegistered = user ? trn.participants.some(p => p.id === user.id) : false;
                const isSlotsFull = trn.registeredCount >= trn.maxSlots;
                return (
                  <div
                    key={trn.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-zinc-850 bg-zinc-950/40 backdrop-blur-md rounded-xl gap-4 hover:border-zinc-800 transition-colors shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={trn.banner} alt={trn.title} className="h-16 w-24 object-cover rounded-lg bg-zinc-900 border border-zinc-800" />
                      <div>
                        <span className="text-[10px] bg-orange-500/10 border border-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                          {trn.game}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1 hover:text-orange-500 transition-colors">
                          <Link href={`/tournaments/${trn.id}`}>{trn.title}</Link>
                        </h4>
                        <p className="text-xs text-zinc-400 font-semibold mt-0.5">
                          Hosted by {trn.organizerName} • Starts {formatDate(trn.startDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 sm:gap-10">
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">Prize Pool</p>
                        <p className="text-sm font-black text-white">{trn.prizePool > 0 ? formatCurrency(trn.prizePool) : 'FREE'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-zinc-500 uppercase font-bold">Slots</p>
                        <p className="text-sm font-black text-zinc-300">
                          {trn.registeredCount} <span className="text-zinc-500">/ {trn.maxSlots}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/tournaments/${trn.id}`}>
                          <Button variant="outline" size="sm">Details</Button>
                        </Link>
                        {trn.status === 'upcoming' && (
                          <Button
                            variant={isUserRegistered ? 'secondary' : 'default'}
                            size="sm"
                            disabled={isSlotsFull && !isUserRegistered}
                            onClick={() => handleRegister(trn.id)}
                            className="font-bold"
                          >
                            {isUserRegistered ? 'Registered' : isSlotsFull ? 'Full' : 'Join'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="text-center py-20 border border-dashed border-zinc-850 rounded-xl bg-zinc-950/20 text-zinc-500 shadow-sm">
            No tournaments found matching the filter criteria.
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 pt-6">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Prev
            </Button>
            <span className="text-xs text-zinc-400 font-bold px-3">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

      </Container>
    </div>
  );
}
