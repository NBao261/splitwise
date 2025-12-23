import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface SplineSceneProps {
  onLoad?: (spline: unknown) => void;
  sceneUrl?: string;
}

export function SplineScene({ onLoad, sceneUrl }: SplineSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (onLoad && isLoaded) {
      onLoad(null);
    }
  }, [onLoad, isLoaded]);

  const fallbackContent = (
    <div className="relative h-full w-full overflow-hidden flex items-center justify-center">
      <motion.div
        className="w-64 h-64 rounded-full bg-gradient-to-br from-emerald-500/30 to-emerald-400/30 blur-3xl"
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
          scale: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
        }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(16, 185, 129, 0.3) 0%, transparent 50%)`,
        }}
        transition={{ duration: 0.3 }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-900/20 to-emerald-800/40 pointer-events-none" />
    </div>
  );

  if (!sceneUrl) {
    return <div ref={containerRef}>{fallbackContent}</div>;
  }

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <iframe
        src={`https://my.spline.design/${sceneUrl}`}
        className="absolute inset-0 w-full h-full border-0"
        onLoad={() => {
          setIsLoaded(true);
        }}
        title="3D Scene"
        allow="fullscreen"
        style={{ pointerEvents: 'auto' }}
      />

      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)`,
        }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
}
