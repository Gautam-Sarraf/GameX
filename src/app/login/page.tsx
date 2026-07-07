'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
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
            <h1 className="text-xl font-bold uppercase tracking-tight">Create Account</h1>
            <div className="social-icons">
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Google register is mocked!'); }} className="social-icon">
                <svg className="w-4 h-4 fill-current text-zinc-700 hover:text-orange-500 transition-colors" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.414 0-6.19-2.77-6.19-6.19 0-3.42 2.777-6.19 6.19-6.19 1.483 0 2.844.52 3.917 1.396l3.056-3.056C19.045 2.502 15.827 1 12.24 1 5.86 1 .7 6.162.7 12.544S5.86 24.088 12.24 24.088c5.8 0 10.9-4.148 10.9-11.544 0-.765-.08-1.5-.23-2.259H12.24z"/>
                </svg>
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Github register is mocked!'); }} className="social-icon">
                <svg className="w-4 h-4 fill-current text-zinc-700 hover:text-orange-500 transition-colors" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Discord register is mocked!'); }} className="social-icon">
                <svg className="w-4 h-4 fill-current text-zinc-700 hover:text-orange-500 transition-colors" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.196.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                </svg>
              </a>
            </div>
            <span className="text-[11px] text-zinc-500 mb-2">or use your email for registration</span>
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
            <h1 className="text-xl font-bold uppercase tracking-tight">Sign In</h1>
            <div className="social-icons">
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Google login is mocked!'); }} className="social-icon">
                <svg className="w-4 h-4 fill-current text-zinc-700 hover:text-orange-500 transition-colors" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.414 0-6.19-2.77-6.19-6.19 0-3.42 2.777-6.19 6.19-6.19 1.483 0 2.844.52 3.917 1.396l3.056-3.056C19.045 2.502 15.827 1 12.24 1 5.86 1 .7 6.162.7 12.544S5.86 24.088 12.24 24.088c5.8 0 10.9-4.148 10.9-11.544 0-.765-.08-1.5-.23-2.259H12.24z"/>
                </svg>
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Github login is mocked!'); }} className="social-icon">
                <svg className="w-4 h-4 fill-current text-zinc-700 hover:text-orange-500 transition-colors" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info('Discord login is mocked!'); }} className="social-icon">
                <svg className="w-4 h-4 fill-current text-zinc-700 hover:text-orange-500 transition-colors" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.196.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                </svg>
              </a>
            </div>
            <span className="text-[11px] text-zinc-500 mb-2">or use your email password</span>
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
              <p>Register with your personal details to compete in GameX cups</p>
              <button className="toggle-btn-hidden" onClick={() => setIsActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
