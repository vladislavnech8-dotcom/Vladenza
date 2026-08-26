import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ZoomIn, ZoomOut, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';

interface LightboxProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

export default function Lightbox({ images, startIndex, onClose }: LightboxProps) {
  const [index, setIndex] = useState(startIndex);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const resetZoom = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const next = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((i) => (i + 1) % images.length);
    resetZoom();
  }, [images.length, resetZoom]);

  const prev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIndex((i) => (i - 1 + images.length) % images.length);
    resetZoom();
  }, [images.length, resetZoom]);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM)), []);
  const zoomOut = useCallback(() => {
    setZoom((z) => {
      const nz = Math.max(z - ZOOM_STEP, MIN_ZOOM);
      if (nz === 1) setPan({ x: 0, y: 0 });
      return nz;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === '+' || e.key === '=') zoomIn();
      else if (e.key === '-') zoomOut();
      else if (e.key === '0') resetZoom();
    };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [next, prev, zoomIn, zoomOut, resetZoom, onClose]);

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom((z) => {
      const nz = Math.max(MIN_ZOOM, Math.min(z + delta, MAX_ZOOM));
      if (nz === 1) setPan({ x: 0, y: 0 });
      return nz;
    });
  }, []);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom === 1) return;
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: dragStart.current.panX + (e.clientX - dragStart.current.x),
      y: dragStart.current.panY + (e.clientY - dragStart.current.y),
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => setIsDragging(false), []);

  // Touch pinch-zoom
  const pinchDist = useRef(0);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchDist.current = Math.hypot(dx, dy);
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / pinchDist.current;
      setZoom((z) => Math.max(MIN_ZOOM, Math.min(z * ratio, MAX_ZOOM)));
      pinchDist.current = dist;
    }
  }, []);

  const hasMultiple = images.length > 1;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Screenshot viewer"
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <div className="text-white text-sm font-medium pointer-events-auto">
          {hasMultiple && <span>{index + 1} / {images.length}</span>}
        </div>
        <div className="flex items-center gap-1 pointer-events-auto">
          <button onClick={(e) => { e.stopPropagation(); zoomOut(); }} disabled={zoom <= MIN_ZOOM}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition disabled:opacity-30">
            <ZoomOut size={16} />
          </button>
          <span className="text-white/60 text-xs font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button onClick={(e) => { e.stopPropagation(); zoomIn(); }} disabled={zoom >= MAX_ZOOM}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition disabled:opacity-30">
            <ZoomIn size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); resetZoom(); }}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition">
            <Maximize2 size={15} />
          </button>
          <div className="w-px h-5 bg-white/20 mx-1" />
          <button onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition">
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Navigation arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            aria-label="Previous screenshot"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
            aria-label="Next screenshot"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Image container — scrollable if taller than viewport */}
      <div
        className="w-full h-full flex items-center justify-center overflow-auto p-4 md:p-8"
        onClick={onClose}
        onWheel={handleWheel}
      >
        <img
          src={images[index]}
          alt={`Screenshot ${index + 1}${hasMultiple ? ` of ${images.length}` : ''}`}
          className="max-w-[92vw] max-h-[90vh] object-contain select-none transition-transform duration-150"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
            transformOrigin: 'center',
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          draggable={false}
        />
      </div>

      {/* Bottom hint */}
      {hasMultiple && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white/40 text-xs font-medium pointer-events-none">
          Use arrow keys to navigate · ESC to close
        </div>
      )}
    </div>
  );
}
