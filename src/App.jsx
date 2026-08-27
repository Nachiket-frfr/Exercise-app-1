import React, { useState, useMemo, useCallback, useEffect } from 'react';
import CalendarHeatmap from 'react-calendar-heatmap'; 
import { Tooltip } from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';

import LevelShow from './LevelUpModal.jsx';
import { LevelExp, getExpNeeded, Consistency } from './levels';

const getLocalDateStr = (d = new Date()) => {
  const dateObj = new Date(d);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  const todayStr = useMemo(() => getLocalDateStr(), []);

  const yesterdayStr = useMemo(() => {
    const y = new Date();
    y.setDate(y.getDate() - 1);
    return getLocalDateStr(y);
  }, []);

  const [firstLoginDate] = useState(() => {
    const saved = localStorage.getItem('firstLoginDate');
    if (saved) return saved;
    localStorage.setItem('firstLoginDate', todayStr);
    return todayStr;
  });

  // Range: 30 days in the past up to 365 days in the future
  const { startDate, endDate } = useMemo(() => {
    const start = new Date();
    start.setDate(start.getDate() - 30);

    const end = new Date();
    end.setDate(end.getDate() + 365);

    return { startDate: start, endDate: end };
  }, []);

  const [completedDates, setCompletedDates] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('completedDates')) || [];
    } catch {
      return [];
    }
  });

  // Unified state to eliminate stale closures & double-trigger bugs
  const [userStats, setUserStats] = useState(() => {
    try {
      return {
        lvl: JSON.parse(localStorage.getItem('userLvl')) || 1,
        currExp: JSON.parse(localStorage.getItem('currExp')) || 0,
      };
    } catch {
      return { lvl: 1, currExp: 0 };
    }
  });

  const [streak, setStreak] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('streak')) || 0;
    } catch {
      return 0;
    }
  });

  const [didLevelUp, setDidLevelUp] = useState(false);

  // Sync state with LocalStorage
  useEffect(() => {
    localStorage.setItem('completedDates', JSON.stringify(completedDates));
    localStorage.setItem('userLvl', JSON.stringify(userStats.lvl));
    localStorage.setItem('currExp', JSON.stringify(userStats.currExp));
    localStorage.setItem('streak', JSON.stringify(streak));
  }, [completedDates, userStats, streak]);

  const expNeed = getExpNeeded(userStats.lvl);
  const isTodayDone = completedDates.includes(todayStr);

  const heatmapValues = useMemo(() => {
    const values = [];
    let currDate = new Date(startDate);
    while (currDate <= endDate) {
      values.push({ date: new Date(currDate) });
      currDate.setDate(currDate.getDate() + 1);
    }
    return values;
  }, [startDate, endDate]);

  const addExp = useCallback((amount) => {
    setUserStats((prev) => {
      let newExp = prev.currExp + amount;
      let newLvl = prev.lvl;
      let needed = getExpNeeded(newLvl);
      let leveledUp = false;

      while (newExp >= needed) {
        newExp -= needed;
        newLvl += 1;
        needed = getExpNeeded(newLvl);
        leveledUp = true;
      }

      if (leveledUp) {
        setDidLevelUp(false);
        setTimeout(() => setDidLevelUp(true), 10);
      }

      return { lvl: newLvl, currExp: newExp };
    });
  }, []);

  const toggleWorkout = (dateStr) => {
    if (!dateStr || dateStr !== todayStr || completedDates.includes(dateStr)) return;

    const yesterdayCompleted = completedDates.includes(yesterdayStr);
    const nextStreak = yesterdayCompleted ? streak + 1 : 1;

    setStreak(nextStreak);
    setCompletedDates((prev) => [...prev, dateStr]);

    const xpGain = Consistency(userStats.lvl, nextStreak);
    addExp(xpGain);
  };

  const resetProgress = () => {
    localStorage.clear();
    setCompletedDates([]);
    setUserStats({ lvl: 1, currExp: 0 });
    setStreak(0);
    setDidLevelUp(false);
    localStorage.setItem('firstLoginDate', todayStr);
  };

  return (
    <div 
      style={{ 
        width: '100%',
        maxWidth: '750px', 
        backgroundColor: '#0a0a0c', 
        border: '1px solid #1f222e',
        padding: '28px', 
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.8)',
        fontFamily: 'Inter, system-ui, sans-serif'
      }}
    >
      <LevelShow 
        level={userStats.lvl} 
        triggerAnim={didLevelUp} 
        onComplete={() => setDidLevelUp(false)} 
      /> 

      <LevelExp userLvl={userStats.lvl} curr={userStats.currExp} expNeed={expNeed} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px' }}>
        <div>
          <h3 style={{ color: '#ffffff', margin: 0, fontSize: '18px', fontWeight: '800' }}>
            Daily Activity Log <span style={{ color: '#10b981', marginLeft: '6px' }}>(Streak: {streak})</span>
          </h3>
          <span style={{ color: '#525866', fontSize: '12px', fontWeight: '500' }}>
            Member since {firstLoginDate}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => toggleWorkout(todayStr)}
            disabled={isTodayDone}
            style={{
              backgroundColor: isTodayDone ? '#14171f' : '#10b981',
              color: isTodayDone ? '#525866' : '#000000',
              border: isTodayDone ? '1px solid #232734' : 'none',
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: isTodayDone ? 'not-allowed' : 'pointer',
              fontSize: '12px',
              fontWeight: '700',
              transition: 'all 0.15s ease'
            }}
          >
            {isTodayDone ? 'Completed Today' : 'Mark Today Present'}
          </button>

          <button
            onClick={() => {
              setDidLevelUp(false);
              setTimeout(() => setDidLevelUp(true), 10);
            }}
            style={{
              backgroundColor: '#1f2937',
              color: '#38bdf8',
              border: '1px solid #374151',
              padding: '6px 14px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '600'
            }}
          >
            Test Level Up
          </button>

          <button 
            onClick={resetProgress}
            style={{ 
              backgroundColor: 'transparent', 
              color: '#ef4444', 
              border: '1px solid #3f1d1d', 
              padding: '6px 14px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: '600'
            }}
          >
            Reset Progress
          </button>
        </div>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <CalendarHeatmap
          startDate={startDate}
          endDate={endDate}
          values={heatmapValues}
          transformDayElement={(element, value) => {
            if (!value || !value.date) return element;
            
            const dateStr = getLocalDateStr(value.date);
            const isDone = completedDates.includes(dateStr);
            const isToday = dateStr === todayStr;

            return React.cloneElement(element, {
              'data-tooltip-id': 'heatmap-tooltip',
              'data-tooltip-content': `${dateStr}${isDone ? ' - Completed' : (isToday ? ' - Click to log' : '')}`,
              style: {
                fill: isDone ? '#10b981' : '#14171f',
                stroke: isToday ? '#ffffff' : (isDone ? '#34d399' : '#232734'),
                strokeWidth: isToday ? '1.5px' : '1px',
                cursor: isToday ? 'pointer' : 'default',
                pointerEvents: isToday ? 'auto' : 'none',
                rx: '2px',
                ry: '2px',
                transition: 'all 0.15s ease'
              },
              onClick: () => toggleWorkout(dateStr),
            });
          }}
        />
      </div>

      <Tooltip 
        id="heatmap-tooltip" 
        style={{ 
          backgroundColor: '#000000', 
          color: '#ffffff', 
          border: '1px solid #272a38',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '600'
        }} 
      />
    </div>
  );
}