'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Menu, X, Bell, Trophy, ShieldAlert, User as UserIcon, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { Button } from './ui/button';
import { AuthService } from '@/services/auth.service';
import { NotificationService } from '@/services/notification.service';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = React.useState(false);

  // Fetch Session User
  const { data: user } = useQuery({
    queryKey: ['session-user'],
    queryFn: () => AuthService.getCurrentUser()
  });

  // Fetch Unread Notification Count
  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-notification-count'],
    queryFn: () => NotificationService.getUnreadCount(),
    enabled: !!user
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: () => AuthService.logout(),
    onSuccess: () => {
      queryClient.setQueryData(['session-user'], null);
      setProfileDropdownOpen(false);
    }
  });

  // Navigation Links
  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tournaments', href: '/tournaments' },
    { name: 'Create Tournament', href: '/create-tournament' },
    { name: 'My Tournaments', href: '/my-tournaments' },
    { name: 'Leaderboards', href: '/leaderboards' },
    { name: 'Community', href: '/community' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]" />
            <span className="text-xl font-black tracking-wider uppercase bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
              ESPORTBRAWL
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-all',
                    isActive
                      ? 'text-orange-500 font-semibold bg-zinc-900/50 border-b border-orange-500 rounded-b-none'
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-900/30'
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Desktop Profile Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <>
              {/* Notifications Icon */}
              <Link href="/notifications" className="relative p-2 text-zinc-400 hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(220,38,38,0.5)] animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* User Avatar Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 p-1 hover:bg-zinc-900 transition-all border border-zinc-800/80 cursor-pointer"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="h-8 w-8 rounded-full border border-orange-500/50"
                  />
                  <span className="text-sm font-semibold text-zinc-200 pr-1">{user.username}</span>
                </button>

                {profileDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-transparent"
                      onClick={() => setProfileDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 rounded-lg border border-zinc-800 bg-zinc-950 p-1 shadow-2xl z-50 text-sm">
                      <Link
                        href={`/profile/${user.username}`}
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex w-full items-center px-3 py-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                      >
                        <UserIcon className="mr-2 h-4 w-4 text-orange-500" />
                        My Profile
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex w-full items-center px-3 py-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                      >
                        <SettingsIcon className="mr-2 h-4 w-4 text-purple-500" />
                        Settings
                      </Link>
                      <hr className="border-zinc-900 my-1" />
                      <button
                        onClick={() => logoutMutation.mutate()}
                        className="flex w-full items-center px-3 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-950/20 rounded-md transition-colors cursor-pointer"
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <Link href="/login">
              <Button variant="glow" size="sm">Login</Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Icon */}
        <div className="flex items-center md:hidden gap-4">
          {user && (
            <Link href="/notifications" className="relative p-2 text-zinc-400 hover:text-white">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-zinc-400 hover:text-white focus:outline-none p-1 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-800 bg-zinc-950 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'block px-3 py-2.5 rounded-md text-base font-semibold',
                  isActive ? 'bg-zinc-900 text-orange-500 border-l-2 border-orange-500' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'
                )}
              >
                {link.name}
              </Link>
            );
          })}
          {user && (
            <Link
              href={`/profile/${user.username}`}
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                'block px-3 py-2.5 rounded-md text-base font-semibold',
                pathname.startsWith('/profile') ? 'bg-zinc-900 text-orange-500' : 'text-zinc-400 hover:text-white'
              )}
            >
              Profile
            </Link>
          )}
          <hr className="border-zinc-900 my-2" />
          {user ? (
            <button
              onClick={() => {
                logoutMutation.mutate();
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center px-3 py-2 text-base font-semibold text-red-400"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </button>
          ) : (
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-2">
              <Button variant="glow" className="w-full">Login</Button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
