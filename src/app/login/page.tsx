'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AuthService } from '@/services/auth.service';
import './login.css';

export default function LoginPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isActive, setIsActive] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  
  // Sign Up inputs
  const [signUpName, setSignUpName] = React.useState('');
  const [signUpEmail, setSignUpEmail] = React.useState('');
  const [signUpPassword, setSignUpPassword] = React.useState('');

  const loginMutation = useMutation({
    mutationFn: (loginEmail: string) => AuthService.login(loginEmail),
    onSuccess: (user) => {
      toast.success(`Welcome back, ${user.username}!`);
      queryClient.setQueryData(['session-user'], user);
      router.push('/');
    },
    onError: () => {
      toast.error('Failed to log in. Please check credentials.');
    }
  });

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter both email and password.');
      return;
    }
    loginMutation.mutate(email);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim()) {
      toast.error('Please fill in all register fields.');
      return;
    }
    loginMutation.mutate(signUpEmail);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      
      {/* Background Video */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video autoPlay loop muted className="w-full h-full object-cover opacity-30">
          <source src="/assets/videos/background-login.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Main Sliding container */}
      <div className={`login-container relative z-10 ${isActive ? 'active' : ''}`} id="container">
        
        {/* Sign Up Form */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp}>
            <h1 className="text-xl font-bold uppercase tracking-tight mb-4">Create Account</h1>
            <input
              type="text"
              placeholder="Name"
              value={signUpName}
              onChange={(e) => setSignUpName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              required
            />
            <button type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Registering...' : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in">
          <form onSubmit={handleSignIn}>
            <h1 className="text-xl font-bold uppercase tracking-tight mb-4">Sign In</h1>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Password reset is mocked!'); }} className="text-xs text-zinc-500 hover:text-zinc-800">
              Forgot Your Password?
            </a>
            <button type="submit" disabled={loginMutation.isPending}>
              {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Slide Overlay Panels */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1 className="text-xl font-bold uppercase tracking-wide">Welcome Back! Gamer</h1>
              <p>Enter your credentials and let the gaming begin</p>
              <button className="toggle-btn-hidden" onClick={() => setIsActive(false)}>Sign In</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1 className="text-xl font-bold uppercase tracking-wide">Hello, Gamer</h1>
              <p>Register with your personal details to compete in EsportBrawl cups</p>
              <button className="toggle-btn-hidden" onClick={() => setIsActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
