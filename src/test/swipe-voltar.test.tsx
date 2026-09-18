/**
 * Testes de spec — feature: swipe-voltar
 * Rastreio: AC-018 · AC-019 · AC-020 · AC-021
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSwipeBack } from '@/hooks/useSwipeBack';

describe('swipe-voltar — navegação por gesto de deslizar (swipe back)', () => {
  let onBackMock = vi.fn();

  beforeEach(() => {
    onBackMock = vi.fn();
    // Simular largura de tela mobile de 360px
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 360 });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  function triggerTouch(startX: number, startY: number, endX: number, endY: number, target?: HTMLElement) {
    const defaultTarget = target || document.body;

    const touchStartEvent = new TouchEvent('touchstart', {
      touches: [{ clientX: startX, clientY: startY, target: defaultTarget } as any],
    });
    Object.defineProperty(touchStartEvent, 'target', { value: defaultTarget });
    window.dispatchEvent(touchStartEvent);

    const touchEndEvent = new TouchEvent('touchend', {
      changedTouches: [{ clientX: endX, clientY: endY, target: defaultTarget } as any],
    });
    Object.defineProperty(touchEndEvent, 'target', { value: defaultTarget });
    window.dispatchEvent(touchEndEvent);
  }

  it('AC-018: Gesto horizontal válido da esquerda para a direita dispara onBack @spec:AC-018', () => {
    renderHook(() => useSwipeBack(onBackMock));

    // Começa em X=20 (nos primeiros 40% da tela) e desliza 100px para X=120 com pouco desvio Y
    triggerTouch(20, 100, 120, 105);

    expect(onBackMock).toHaveBeenCalledTimes(1);
  });

  it('AC-019: Gesto de rolagem predominantemente vertical não dispara retorno @spec:AC-019', () => {
    renderHook(() => useSwipeBack(onBackMock));

    // Começa em X=20, Y=100 e move para X=50 (deltaX=30), Y=250 (deltaY=150) -> scroll vertical
    triggerTouch(20, 100, 50, 250);

    expect(onBackMock).not.toHaveBeenCalled();
  });

  it('AC-020: Deslizamento curto abaixo do threshold de 60px não dispara retorno @spec:AC-020', () => {
    renderHook(() => useSwipeBack(onBackMock, { threshold: 60 }));

    // Move apenas 40px (abaixo do limiar de 60px)
    triggerTouch(20, 100, 60, 100);

    expect(onBackMock).not.toHaveBeenCalled();
  });

  it('AC-021: Gesto iniciado dentro de input de texto é ignorado @spec:AC-021', () => {
    renderHook(() => useSwipeBack(onBackMock));

    const input = document.createElement('input');
    input.type = 'text';
    document.body.appendChild(input);

    triggerTouch(20, 100, 150, 100, input);

    expect(onBackMock).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });
});
