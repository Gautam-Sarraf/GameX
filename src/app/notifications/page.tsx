'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Trophy, ShieldAlert, Sparkles, MessageCircle, Eye, Trash2, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NotificationService } from '@/services/notification.service';
import { AuthService } from '@/services/auth.service';
import { cn, formatDate } from '@/lib/utils';

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  // Fetch Session User
  const { data: user } = useQuery({
    queryKey: ['session-user'],
    queryFn: () => AuthService.getCurrentUser()
  });

  // Fetch Notifications
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => NotificationService.getNotifications(),
    enabled: !!user
  });

  // Mark Read Mutation
  const readMutation = useMutation({
    mutationFn: (id: string) => NotificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notification-count'] });
    }
  });

  // Mark All Read Mutation
  const readAllMutation = useMutation({
    mutationFn: () => NotificationService.markAllAsRead(),
    onSuccess: () => {
      toast.success('All notifications marked as read.');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notification-count'] });
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => NotificationService.deleteNotification(id),
    onSuccess: () => {
      toast.success('Notification dismissed.');
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notification-count'] });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center">
        <div className="text-zinc-500 animate-pulse font-extrabold uppercase font-oswald tracking-widest text-lg">
          Loading Notifications...
        </div>
      </div>
    );
  }

  const unread = notifications.filter(n => n.status === 'unread');

  return (
    <div className="min-h-screen bg-[#030303] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-zinc-900 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold uppercase text-white font-oswald tracking-tight flex items-center gap-2">
              <Bell className="h-8 w-8 text-cyan-400" /> Notifications
            </h1>
            <p className="text-zinc-400 text-sm mt-1">Stay updated with tournament signups and match starts.</p>
          </div>

          {unread.length > 0 && (
            <Button variant="outline" size="sm" onClick={() => readAllMutation.mutate()}>
              <CheckSquare className="h-4 w-4 mr-1.5 text-cyan-400" /> Mark all read
            </Button>
          )}
        </div>

        {/* Notifications Feed */}
        {notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((notif) => {
              const isUnread = notif.status === 'unread';
              return (
                <div
                  key={notif.id}
                  className={cn(
                    'p-4 rounded-xl border flex gap-4 items-start relative hover:border-zinc-800 transition-colors',
                    isUnread ? 'bg-zinc-950 border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.02)]' : 'bg-zinc-950/40 border-zinc-900'
                  )}
                >
                  {/* Status Indicator Dot */}
                  {isUnread && (
                    <span className="absolute top-4 left-3 h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  )}

                  {/* Icon */}
                  <div className="pl-2">
                    <span className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border border-zinc-800 text-xs">
                      {notif.type === 'registration_approved' && '✅'}
                      {notif.type === 'tournament_started' && '🔥'}
                      {notif.type === 'achievement_unlocked' && '🏆'}
                      {notif.type === 'organizer_announcement' && '📢'}
                      {notif.type === 'match_ready' && '🎮'}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex-grow space-y-1 text-sm">
                    <div className="flex justify-between items-center gap-2">
                      <h4 className="font-extrabold text-white">{notif.title}</h4>
                      <span className="text-[10px] text-zinc-500 font-semibold">{formatDate(notif.timestamp)}</span>
                    </div>
                    <p className="text-xs text-zinc-400 font-semibold leading-relaxed pr-10">{notif.message}</p>
                  </div>

                  {/* Dismiss Controls */}
                  <div className="flex items-center space-x-1.5 self-center">
                    {isUnread && (
                      <button
                        onClick={() => readMutation.mutate(notif.id)}
                        className="p-1 rounded text-zinc-500 hover:text-cyan-400 hover:bg-zinc-900 cursor-pointer"
                        title="Mark as read"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteMutation.mutate(notif.id)}
                      className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-900 cursor-pointer"
                      title="Dismiss notification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-zinc-900 rounded-xl bg-zinc-950/20 text-zinc-500">
            <Bell className="h-10 w-10 mx-auto text-zinc-600 mb-2" />
            No notifications found. You are all caught up!
          </div>
        )}

      </div>
    </div>
  );
}
