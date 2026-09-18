import { useEffect, useRef } from "react";

export type SwipeBackOptions = {
  /**
   * Distância mínima horizontal percorrida para considerar swipe (padrão: 60px).
   */
  threshold?: number;
  /**
   * Proporção mínima entre deslocamento horizontal e vertical (deltaX / deltaY). Padrão: 1.5.
   * Garante que scrolls verticais não sejam confundidos com swipe.
   */
  directionRatio?: number;
  /**
   * Posição horizontal máxima de início do toque em relação à largura da tela (0 a 1).
   * Padrão: 0.4 (inicia nos primeiros 40% da tela a partir da esquerda).
   */
  maxStartRatio?: number;
  /**
   * Se a detecção está ativa. Padrão: true.
   */
  enabled?: boolean;
};

/**
 * Hook puro para detecção do gesto de arrastar da esquerda para a direita (Swipe Back).
 * Executa `onBack` quando um swipe válido é finalizado.
 */
export function useSwipeBack(
  onBack: () => void,
  options: SwipeBackOptions = {}
) {
  const {
    threshold = 60,
    directionRatio = 1.5,
    maxStartRatio = 0.4,
    enabled = true,
  } = options;

  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;

  const touchStartRef = useRef<{ x: number; y: number; validStart: boolean; isInput: boolean } | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) {
        touchStartRef.current = null;
        return;
      }

      const touch = e.touches[0];
      const target = e.target as HTMLElement | null;

      // AC-021: Ignorar se o toque iniciou dentro de um input, textarea ou elemento editável
      const isInput = !!target && (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable
      );

      const screenWidth = window.innerWidth || document.documentElement.clientWidth || 360;
      const validStart = touch.clientX <= screenWidth * maxStartRatio;

      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        validStart,
        isInput,
      };
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const start = touchStartRef.current;
      touchStartRef.current = null;

      if (!start || !start.validStart || start.isInput) return;

      const touch = e.changedTouches[0];
      if (!touch) return;

      const deltaX = touch.clientX - start.x;
      const deltaY = touch.clientY - start.y;

      // Swipe horizontal da esquerda para a direita
      // AC-018: deltaX >= threshold
      // AC-019: deltaX deve ser significativamente maior que deltaY
      // AC-020: deltaX < threshold não dispara
      if (deltaX >= threshold && deltaX > Math.abs(deltaY) * directionRatio) {
        onBackRef.current();
      }
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enabled, threshold, directionRatio, maxStartRatio]);
}
