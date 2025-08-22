
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingFallbackProps {
  className?: string;
  message?: string;
}

export const LoadingFallback = React.memo(({ 
  className, 
  message = "Carregando..." 
}: LoadingFallbackProps) => {
  return (
    <div 
      className={cn("min-h-screen flex items-center justify-center", className)}
      role="status"
      aria-live="polite"
    >
      <div className="text-center">
        <div 
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"
          aria-hidden="true"
        />
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
});

LoadingFallback.displayName = "LoadingFallback";
