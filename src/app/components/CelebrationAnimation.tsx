import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
}

interface CelebrationAnimationProps {
  trigger: boolean;
  onComplete?: () => void;
}

const COLORS = [
  '#FF3000',
  '#FF6B6B',
  '#FFD700',
  '#FFA500',
  '#FF69B4',
  '#00CED1',
  '#32CD32',
  '#9370DB',
];

export function CelebrationAnimation({ trigger, onComplete }: CelebrationAnimationProps) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      // Generate confetti pieces
      const pieces: ConfettiPiece[] = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -20 - Math.random() * 20,
        rotation: Math.random() * 360,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 5 + Math.random() * 10,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
      }));

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConfetti(pieces);

      setIsVisible(true);

      // Hide after animation
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [trigger, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            transform: `rotate(${piece.rotation}deg)`,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
