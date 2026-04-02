import { Star } from 'lucide-react';
import { useState } from 'react';

export default function StarRating({ rating = 0, onRate = null, size = 'sm' }) {
  const [hover, setHover] = useState(0);
  const s = size === 'lg' ? 'w-7 h-7' : 'w-4 h-4';

  return (
    <div className="flex items-center gap-0.5" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={!onRate}
          onClick={() => onRate && onRate(star)}
          onMouseEnter={() => onRate && setHover(star)}
          onMouseLeave={() => setHover(0)}
          className={`transition-transform ${onRate ? 'cursor-pointer hover:scale-125' : 'cursor-default'}`}
        >
          <Star
            className={`${s} transition-colors ${
              star <= (hover || rating)
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-600'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
