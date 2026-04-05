import { useCallback, useEffect, useRef, useState } from 'react';
import { CELL_PX, TICK_MS } from '../constants';
import { emptyGrid, nextState } from '../utils/state';

const DEAD_COLOR = '#FFB6C1';
const LIVE_COLOR = '#000';
const GRID_COLOR = '#999';

export function useLifeWorld(size: number) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentRef = useRef<Uint8Array>(emptyGrid(size));
  const nextRef = useRef<Uint8Array>(emptyGrid(size));
  const [running, setRunning] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const grid = currentRef.current;
    const px = CELL_PX;

    // Background = grid line color; cells inset by 1px reveal it as gridlines.
    ctx.fillStyle = GRID_COLOR;
    ctx.fillRect(0, 0, size * px, size * px);

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        ctx.fillStyle = grid[i * size + j] ? LIVE_COLOR : DEAD_COLOR;
        ctx.fillRect(j * px + 1, i * px + 1, px - 1, px - 1);
      }
    }
  }, [size]);

  const step = useCallback(() => {
    nextState(currentRef.current, nextRef.current, size);
    const tmp = currentRef.current;
    currentRef.current = nextRef.current;
    nextRef.current = tmp;
    draw();
  }, [size, draw]);

  const clear = useCallback(() => {
    currentRef.current.fill(0);
    draw();
  }, [draw]);

  const randomize = useCallback(() => {
    const g = currentRef.current;
    for (let i = 0; i < g.length; i++) g[i] = Math.random() < 0.5 ? 1 : 0;
    draw();
  }, [draw]);

  // Canvas setup (DPR) + pointer handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const cssSize = size * CELL_PX;
    canvas.width = cssSize * dpr;
    canvas.height = cssSize * dpr;
    canvas.style.width = `${cssSize}px`;
    canvas.style.height = `${cssSize}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Reset transform before scaling to survive StrictMode double-invoke.
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    draw();

    let painting: 0 | 1 | null = null;
    let lastIdx = -1;

    function pixelToIdx(e: PointerEvent): number {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const j = Math.floor(x / CELL_PX);
      const i = Math.floor(y / CELL_PX);
      if (i < 0 || j < 0 || i >= size || j >= size) return -1;
      return i * size + j;
    }

    function onPointerDown(e: PointerEvent) {
      const idx = pixelToIdx(e);
      if (idx < 0) return;
      const grid = currentRef.current;
      grid[idx] = grid[idx] ? 0 : 1;
      painting = grid[idx] as 0 | 1;
      lastIdx = idx;
      canvas!.setPointerCapture(e.pointerId);
      draw();
    }

    function onPointerMove(e: PointerEvent) {
      if (painting === null) return;
      const idx = pixelToIdx(e);
      if (idx < 0 || idx === lastIdx) return;
      currentRef.current[idx] = painting;
      lastIdx = idx;
      draw();
    }

    function onPointerUp() {
      painting = null;
      lastIdx = -1;
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
    };
  }, [size, draw]);

  // Tick loop (setInterval — Phase 4c will swap this for requestAnimationFrame)
  useEffect(() => {
    if (!running) return;
    const id = setInterval(step, TICK_MS);
    return () => clearInterval(id);
  }, [running, step]);

  return { canvasRef, running, setRunning, step, clear, randomize };
}
