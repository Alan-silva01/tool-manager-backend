
import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  decoding?: 'async' | 'sync' | 'auto';
  width?: number;
  height?: number;
}

export const LazyImage = React.memo(({ 
  src, 
  alt, 
  className, 
  loading = 'lazy', 
  decoding = 'async',
  width,
  height 
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  if (hasError) {
    return (
      <div 
        className={cn("bg-muted flex items-center justify-center", className)}
        role="img" 
        aria-label={alt}
      >
        <span className="text-muted-foreground text-sm">Imagem não disponível</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        "transition-opacity duration-300",
        isLoaded ? "opacity-100" : "opacity-0",
        className
      )}
      loading={loading}
      decoding={decoding}
      width={width}
      height={height}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
});

LazyImage.displayName = "LazyImage";
