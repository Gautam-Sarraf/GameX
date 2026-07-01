'use client';

import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
          />
          {/* Dialog Wrapper */}
          <div className="min-h-full flex items-center justify-center w-full">
            {children}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function DialogContent({
  children,
  className,
  onClose
}: {
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'relative w-full max-w-lg border border-zinc-800 bg-zinc-950 p-6 rounded-xl shadow-2xl z-10 text-white my-8',
        className
      )}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900 p-1 cursor-pointer transition-all"
      >
        <X className="h-4 w-4" />
      </button>
      {children}
    </motion.div>
  );
}

export function DialogHeader({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col space-y-1.5 text-left pb-4', className)}>
      {children}
    </div>
  );
}

export function DialogTitle({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn('text-lg font-bold text-white', className)}>
      {children}
    </h2>
  );
}

export function DialogDescription({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn('text-sm text-zinc-400', className)}>
      {children}
    </p>
  );
}
