'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Trophy, Calendar, Sparkles, ChevronRight, ChevronLeft, ArrowRight, ShieldCheck, Gamepad } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TournamentService } from '@/services/tournament.service';
import { AuthService } from '@/services/auth.service';
import { GAMES } from '@/mock/data';
import { cn, formatCurrency, formatDate } from '@/lib/utils';

// Zod Validation Schema for entire form
const tournamentSchema = z.object({
  title: z.string().min(4, 'Title must be at least 4 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  startDate: z.string().min(1, 'Start date is required'),
  game: z.string().min(1, 'Please select a game'),
  maxSlots: z.number().min(2, 'Must support at least 2 player slots'),
  prizePool: z.number().nonnegative('Prize pool cannot be negative'),
  entryFee: z.number().nonnegative('Entry fee cannot be negative'),
  rules: z.string().min(5, 'Rules description is required')
});

type TournamentFormValues = z.infer<typeof tournamentSchema>;

export default function CreateTournamentPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = React.useState(1);

  // Fetch Session User
  const { data: user } = useQuery({
    queryKey: ['session-user'],
    queryFn: () => AuthService.getCurrentUser()
  });

  const { register, handleSubmit, watch, formState: { errors }, trigger, setValue } = useForm<TournamentFormValues>({
    defaultValues: {
      title: '',
      description: '',
      startDate: '',
      game: GAMES[0],
      maxSlots: 8,
      prizePool: 0,
      entryFee: 0,
      rules: '1. Play fair and respect opponents.\n2. Do not use hacks/exploits.\n3. Verify match results with screenshots.'
    }
  });

  // Watch fields for Review step
  const watchedValues = watch();

  // Create Tournament Mutation
  const createMutation = useMutation({
    mutationFn: (data: Partial<TournamentFormValues>) => {
      // Split rules by new lines
      const parsedRules = (data.rules || '').split('\n').filter(r => r.trim() !== '');
      return TournamentService.createTournament({
        ...data,
        rules: parsedRules
      });
    },
    onSuccess: (newTrn) => {
      toast.success(`Successfully created draft tournament "${newTrn.title}"!`);
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      // Redirect to user's dashboard or My Tournaments
      router.push(`/dashboard/${newTrn.id}`);
    },
    onError: () => {
      toast.error('Failed to create tournament. Please try again.');
    }
  });

  const nextStep = async () => {
    // Validate current step fields
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(['title', 'description', 'startDate']);
    } else if (step === 2) {
      isValid = await trigger(['game', 'maxSlots']);
    } else if (step === 3) {
      isValid = await trigger(['prizePool', 'entryFee']);
    } else if (step === 4) {
      isValid = await trigger(['rules']);
    }

    if (isValid) {
      setStep(prev => prev + 1);
    } else {
      toast.error('Please fix validation errors before moving forward.');
    }
  };

  const prevStep = () => {
    setStep(prev => Math.max(1, prev - 1));
  };

  const onSubmit = (data: TournamentFormValues) => {
    if (!user) {
      toast.error('Please login first to host tournaments.');
      return;
    }
    createMutation.mutate(data);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-zinc-900 bg-zinc-950/60 text-center p-6 space-y-4 shadow-xl">
          <Trophy className="h-10 w-10 text-zinc-500 mx-auto" />
          <h2 className="text-xl font-bold uppercase tracking-tight text-white">Login Required</h2>
          <p className="text-sm text-zinc-400">
            You must be logged in to create and host esports tournaments.
          </p>
          <Button variant="glow" onClick={() => router.push('/login')} className="w-full">
            Login
          </Button>
        </Card>
      </div>
    );
  }

  const stepsIndicators = ['Basic Info', 'Game Details', 'Prize & Fee', 'Regulations', 'Review'];

  return (
    <div className="min-h-screen bg-[#030303] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-extrabold uppercase text-white font-oswald tracking-tight">
            Create Tournament
          </h1>
          <p className="text-zinc-400 text-sm">Set up custom gaming brackets and launch your league.</p>
        </div>

        {/* Step Progress Indicators */}
        <div className="flex justify-between items-center bg-zinc-950/60 p-4 border border-zinc-900 rounded-xl overflow-x-auto shadow-sm">
          {stepsIndicators.map((sName, idx) => {
            const stepNum = idx + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;
            return (
              <div key={idx} className="flex items-center space-x-2 whitespace-nowrap">
                <span className={cn(
                  'h-6 w-6 rounded-full flex items-center justify-center text-xs font-black border',
                  isActive ? 'border-orange-500 bg-orange-500/10 text-orange-400' :
                  isCompleted ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' :
                  'border-zinc-800 bg-zinc-900 text-zinc-500'
                )}>
                  {isCompleted ? <ShieldCheck className="h-3.5 w-3.5" /> : stepNum}
                </span>
                <span className={cn(
                  'text-xs font-bold',
                  isActive ? 'text-orange-400' : isCompleted ? 'text-zinc-300' : 'text-zinc-500'
                )}>
                  {sName}
                </span>
                {idx < stepsIndicators.length - 1 && <ChevronRight className="h-3.5 w-3.5 text-zinc-800" />}
              </div>
            );
          })}
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit(onSubmit)}>
          
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-orange-500" /> Basic Details
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Tournament Title</label>
                  <Input
                    placeholder="e.g. Valorant Winter Cup Masters"
                    {...register('title')}
                  />
                  {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Description</label>
                  <Textarea
                    placeholder="Provide overview details, tournament formats, stream channels, etc."
                    rows={4}
                    {...register('description')}
                  />
                  {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Start Date & Time</label>
                  <Input
                    type="datetime-local"
                    {...register('startDate')}
                  />
                  {errors.startDate && <p className="text-xs text-red-500">{errors.startDate.message}</p>}
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: Game Details */}
          {step === 2 && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                  <Gamepad className="h-4 w-4 text-orange-500" /> Game Selection & Format
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Select Game</label>
                  <select
                    className="w-full h-10 rounded-md border border-zinc-800 bg-zinc-900/60 text-sm text-white px-3 focus:border-orange-500 focus:outline-none cursor-pointer"
                    {...register('game')}
                  >
                    {GAMES.map(g => (
                      <option key={g} value={g} className="bg-zinc-950 text-white">{g}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Max Player Slots</label>
                  <Input
                    type="number"
                    placeholder="8, 16, 32, 64"
                    onChange={(e) => setValue('maxSlots', parseInt(e.target.value) || 0)}
                    defaultValue={watchedValues.maxSlots}
                  />
                  {errors.maxSlots && <p className="text-xs text-red-500">{errors.maxSlots.message}</p>}
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 3: Prize Pool */}
          {step === 3 && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-yellow-500" /> Prizes & Fees
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Prize Pool ($ USD)</label>
                  <Input
                    type="number"
                    placeholder="e.g. 5000"
                    onChange={(e) => setValue('prizePool', parseFloat(e.target.value) || 0)}
                    defaultValue={watchedValues.prizePool}
                  />
                  {errors.prizePool && <p className="text-xs text-red-500">{errors.prizePool.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Entry Fee ($ USD)</label>
                  <Input
                    type="number"
                    placeholder="0 for Free Entry"
                    onChange={(e) => setValue('entryFee', parseFloat(e.target.value) || 0)}
                    defaultValue={watchedValues.entryFee}
                  />
                  {errors.entryFee && <p className="text-xs text-red-500">{errors.entryFee.message}</p>}
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 4: Regulations */}
          {step === 4 && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-orange-500" /> Rulebook Regulations
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Regulations (one rule per line)</label>
                  <Textarea
                    placeholder="Write regulations list"
                    rows={6}
                    {...register('rules')}
                  />
                  {errors.rules && <p className="text-xs text-red-500">{errors.rules.message}</p>}
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 5: Review */}
          {step === 5 && (
            <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2 border-b border-zinc-900 pb-3">
                  <ShieldCheck className="h-4 w-4 text-orange-500" /> Summary Review
                </h3>

                <div className="grid grid-cols-2 gap-4 text-sm text-zinc-300">
                  <div>
                    <span className="text-zinc-500 font-semibold block text-xs">Title</span>
                    <span className="font-bold text-white">{watchedValues.title}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-semibold block text-xs">Game</span>
                    <span className="font-bold text-orange-500 uppercase">{watchedValues.game}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-semibold block text-xs">Start Date</span>
                    <span className="font-bold text-zinc-300">{formatDate(watchedValues.startDate)}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-semibold block text-xs">Max Slots</span>
                    <span className="font-bold text-zinc-300">{watchedValues.maxSlots} Slots</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-semibold block text-xs">Prize Pool</span>
                    <span className="font-bold text-yellow-500">{formatCurrency(watchedValues.prizePool)}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 font-semibold block text-xs">Entry Fee</span>
                    <span className="font-bold text-orange-400">
                      {watchedValues.entryFee > 0 ? formatCurrency(watchedValues.entryFee) : 'FREE'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-zinc-500 font-semibold block text-xs">Description Summary</span>
                  <p className="text-xs text-zinc-400 font-semibold leading-relaxed p-3 bg-zinc-900/60 border border-zinc-900 rounded">
                    {watchedValues.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation Controls */}
          <div className="flex justify-between items-center pt-6">
            {step > 1 ? (
              <Button type="button" variant="secondary" size="sm" onClick={prevStep}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <Button type="button" variant="default" size="sm" onClick={nextStep}>
                Continue <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" variant="glow" size="sm" disabled={createMutation.isPending}>
                {createMutation.isPending ? 'Launching...' : 'Launch Tournament'} <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}
