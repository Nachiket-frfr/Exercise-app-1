import React from 'react';

const baseExp = 100;
const factor = 1.5;
let nStreak =0;

export function Consistency(level,nStreak){
const amountGain = Math.floor(
  (25 * Math.pow(level, 1.127)) * (1 + nStreak / (7 * Math.log(level + 1)))
);
return amountGain ;.0
}
export function getExpNeeded(level) {
  return Math.floor(baseExp * Math.pow(level, factor));
}

export function LevelExp({ userLvl, curr, expNeed }) {
  return (
    <div style={{ color: 'white', marginBottom: '20px' }}>
      <h3 style={{ margin: '0 0 8px 0' }}>Level {userLvl}</h3>
      <p style={{ margin: '0 0 12px 0', color: '#94a3b8' }}>XP: {curr} / {expNeed}</p>
    </div>
  );
}