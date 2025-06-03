import React, { use, useState, useEffect } from 'react';

function StarRating({ star, onRatingChange }) {
  const [rating, setRating] = useState(0);
  useEffect(() => {
    if (star) {
      setRating(star);
    }
  }, [star]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={{ color: star <= rating ? 'gold' : 'gray', fontSize: '36px' }}
            onClick={() => handleRatingChange(star)}
          >
            ★
          </span>
        ))}
      </div>
    </div>
  );
}

export default StarRating;