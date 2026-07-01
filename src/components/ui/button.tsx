import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'glow';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer';
    
    const variants = {
      default: 'bg-gradient-to-r from-orange-600 to-amber-500 text-white hover:from-orange-500 hover:to-amber-400 hover:shadow-lg hover:shadow-orange-500/20 active:scale-[0.98]',
      destructive: 'bg-red-600 text-white hover:bg-red-500 hover:shadow-lg hover:shadow-red-500/20 active:scale-[0.98]',
      outline: 'border border-zinc-800 bg-transparent text-zinc-300 hover:bg-zinc-900/50 hover:text-white hover:border-zinc-700',
      secondary: 'bg-zinc-900 text-zinc-100 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 active:scale-[0.98]',
      ghost: 'text-zinc-400 hover:bg-zinc-900/50 hover:text-white',
      link: 'text-orange-400 underline-offset-4 hover:underline bg-transparent',
      glow: 'relative overflow-hidden bg-zinc-950 text-white border border-orange-500/30 hover:border-orange-400/80 shadow-[0_0_15px_rgba(249,115,22,0.15)] hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] duration-300 active:scale-[0.98]'
    };

    const sizes = {
      default: 'h-10 px-4 py-2 text-sm',
      sm: 'h-8 px-3 py-1.5 text-xs rounded-sm',
      lg: 'h-12 px-6 py-3 text-base',
      icon: 'h-10 w-10'
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
