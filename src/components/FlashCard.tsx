import { useState, useEffect } from 'react';

interface Props {
  front: string;
  back: string;
  image?: string;
  flipped?: boolean;
  onFlip?: () => void;
}

export default function FlashCard({ front, back, image, flipped: controlledFlipped, onFlip }: Props) {
  const [internalFlipped, setInternalFlipped] = useState(false);
  const flipped = controlledFlipped ?? internalFlipped;

  useEffect(() => {
    setInternalFlipped(false);
  }, [front, back]);

  const handleClick = () => {
    if (onFlip) {
      onFlip();
    } else {
      setInternalFlipped(!internalFlipped);
    }
  };

  return (
    <div
      className="w-full max-w-lg mx-auto cursor-pointer select-none"
      style={{ perspective: '1000px' }}
      onClick={handleClick}
    >
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
          minHeight: '280px',
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-flash-gold/90 to-flash-gold-dark/90 dark:from-flash-gold/80 dark:to-flash-gold-dark/80 shadow-xl p-8 flex flex-col items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {image && (
            <img src={image} alt="" className="max-h-24 mb-4 rounded-lg object-contain" />
          )}
          <p className="text-xl sm:text-2xl font-bold text-gray-900 text-center leading-relaxed">
            {front}
          </p>
          <span className="mt-4 text-sm text-gray-700/60 font-medium">
            Tap to flip
          </span>
        </div>

        <div
          className="absolute inset-0 rounded-2xl bg-white dark:bg-gray-800 shadow-xl border-2 border-flash-gold/30 p-8 flex flex-col items-center justify-center"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <p className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center leading-relaxed">
            {back}
          </p>
          <span className="mt-4 text-sm text-gray-400 dark:text-gray-500 font-medium">
            Tap to flip back
          </span>
        </div>
      </div>
    </div>
  );
}
