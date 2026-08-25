import React, { useEffect, useState } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap'; 
import { Tooltip } from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';

import { LevelExp, getExpNeeded, Consistency } from './levels';

// Helper to standardise YYYY-MM-DD local strings
const getLocalDateStr = (d) => {
  const dateObj = new Date(d);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  const today = new Date();
  const todayStr = getLocalDateStr(today);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayStr = getLocalDateStr(yesterday);

  // Define date bounds
  const startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endDate = new Date(today.getFullYear(), today.getMonth() + 12, today.getDate());

  // Persistent States
  const [completedDates, setCompletedDates] = useState(() => {
    try {
      const saved = localStorage.getItem('completedDates');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userLvl, setUserLvl] = useState(() => {
    try {
      const saved = localStorage.getItem('userLvl');
      return saved ? JSON.parse(saved) : 1;
    } catch {
      return 1;
    }
  });

  const [curr, setCurr] = useState(() => {
    try {
      const saved = localStorage.getItem('currExp');
      return saved ? JSON.parse(saved) : 0;
    } catch {
      return 0;
    }
  });

  const [streak, setStreak] = useState(() => {
    try {
      const saved = localStorage.getItem('streak');
      return saved ? JSON.parse(saved) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    localStorage.setItem('completedDates', JSON.stringify(completedDates));
    localStorage.setItem('userLvl', JSON.stringify(userLvl));
    localStorage.setItem('currExp', JSON.stringify(curr));
    localStorage.setItem('streak', JSON.stringify(streak));
  }, [completedDates, userLvl, curr, streak]);

  const expNeed = getExpNeeded(userLvl);

  // Build heatmap values array using standard Date objects
  const heatmapValues = [];
  let currDate = new Date(startDate);
  while (currDate <= endDate) {
    heatmapValues.push({ date: new Date(currDate) });
    currDate.setDate(currDate.getDate() + 1);
  }

  const addExp = (amount, currentLevel, currentExp) => {
    let newExp = currentExp + amount;
    let lvl = currentLevel;
    let needed = getExpNeeded(lvl);

    while (newExp >= needed) {
      newExp -= needed;
      lvl += 1;
      needed = getExpNeeded(lvl);
    }

    setUserLvl(lvl);
    setCurr(newExp);
  };

  const toggleWorkout = (dateStr) => {
    if (!dateStr || dateStr !== todayStr) return;

    const isAlreadyDone = completedDates.includes(dateStr);

    if (!isAlreadyDone) {
      const yesterdayCompleted = completedDates.includes(yesterdayStr);
      const nextStreak = yesterdayCompleted || streak === 0 ? streak + 1 : 1;

      setStreak(nextStreak);
      setCompletedDates((prev) => [...prev, dateStr]);

      const xpGain = Consistency(userLvl, nextStreak);
      addExp(xpGain, userLvl, curr);
    }
  };

  const resetProgress = () => {
    localStorage.clear();
    setCompletedDates([]);
    setUserLvl(1);
    setCurr(0);
    setStreak(0);
  };

  return (
    <div style={{ width: '750px', backgroundColor: '#1a1d24', padding: '24px', borderRadius: '12px' }}>

      <LevelExp userLvl={userLvl} curr={curr} expNeed={expNeed} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
        <h3 style={{ color: 'white', margin: 0, fontFamily: 'ui-sans-serif' }}>
          Daily Logs (Streak: {streak})
        </h3>
        <button 
          onClick={resetProgress}
          style={{ 
            backgroundColor: '#ef4444', 
            color: 'white', 
            border: 'none', 
            padding: '6px 12px', 
            borderRadius: '6px', 
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Reset Data
        </button>
      </div>
      
      <div style={{ marginTop: '16px' }}>
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={heatmapValues}
          transformDayElement={(element, value) => {
            if (!value || !value.date) return element;
            
            const dateStr = getLocalDateStr(value.date);
            const isDone = completedDates.includes(dateStr);
            const isPast = dateStr < todayStr;
            const isToday = dateStr === todayStr;

            if (isPast) {
              return React.cloneElement(element, {
                style: { fill: 'transparent', pointerEvents: 'none' }
              });
            }

            return React.cloneElement(element, {
              'data-tooltip-id': 'heatmap-tooltip',
              'data-tooltip-content': `${dateStr}${isDone ? ' - Completed' : ''}`,
              style: {
                fill: isDone ? '#22c55e' : '#2d3748',
                stroke: isToday ? '#38bdf8' : 'none',
                strokeWidth: isToday ? '1px' : '0',
                cursor: isToday ? 'pointer' : 'default',
                pointerEvents: 'auto',
                rx: '0px',
                ry: '0px'
              },
              onClick: () => toggleWorkout(dateStr),
            });
          }}
        />
      </div>
 
      <Tooltip id="heatmap-tooltip" style={{ backgroundColor: '#0f172a', color: '#f8fafc', borderRadius: '6px' }} />
    </div>
  );
}