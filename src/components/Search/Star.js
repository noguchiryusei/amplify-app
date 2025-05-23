import React from "react";

const StarView = ({ star }) => {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', cursor: 'pointer', width: '100%' }}>
        {Array.from({ length: star }).map((_, index) => (
          <span key={index} style={{color: 'gold', fontSize: '36px'}}>
            ★
          </span>
        ))}
      </div>
    </>
  );
};

export default StarView;