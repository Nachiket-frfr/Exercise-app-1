import React, { useRef, useState } from 'react';
import './index.css';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const details = [
  { "rank": 1, "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", "username": "ShadowViper", "level": 84 },
  { "rank": 2, "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", "username": "PixelPioneer", "level": 79 },
  { "rank": 3, "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", "username": "NovaBlade", "level": 75 },
  { "rank": 4, "avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", "username": "CyberKnight", "level": 68 },
  { "rank": 5, "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", "username": "FrostByte", "level": 62 },
  { "rank": 6, "avatar": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150", "username": "IronLotus", "level": 55 },
  { "rank": 7, "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", "username": "AstraRunner", "level": 49 },
  { "rank": 8, "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", "username": "EchoRider", "level": 41 },
  { "rank": 9, "avatar": "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150", "username": "VortexSeeker", "level": 33 },
  { "rank": 10, "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150", "username": "NeonRogue", "level": 27 }
];

const Self = [
  { "rank": 22000, "avatar": "https://imgs.search.brave.com/_gJ4k7vLPBs5bHB-d9reIzu7I4EMqrbZRjRJOc-Lmu0/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kcmFn/bmVlbGNsdWIuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDI1/LzAyL2RjOGYyOWNm/MDc4OTUyNjcyZGNm/MWMxMmVjODM0Zjc0/LTE5MDUxOTk5Njcu/anBn", "username": "Sewo", "level": 2 }  
];

export default function App() {
  const container = useRef(null);
  const [category, setCategory] = useState('A');
  const me = Self[0];

  const percentile = (rank, net_player) => {
    return ((rank / (net_player + 1)) * 100).toFixed(1);
  };

  useGSAP(() => {
    gsap.from('.user-item', {
      opacity: 0,
      y: 15,
      stagger: 0.04,
      duration: 0.4,
      ease: 'power2.out'
    });
  }, { scope: container, dependencies: [category] });

  return (
    <div ref={container} className="outer">
      <legend className="info-tag">--------Category Selector--------</legend>
      <div className="category">
        <button onClick={() => setCategory('A')}>Category A</button>
        <button onClick={() => setCategory('B')}>Category B</button>
        <button onClick={() => setCategory('C')}>Category C</button>
      </div>

      <div className="details">

        <div className="leaderboard-header">
          <h4>Part of Top</h4>
          <h4>Rank</h4>
          <h4>Username</h4>
          <h4>Level</h4>
        </div>

        {details.map((player) => (
          <div className="user-item" data-rank={player.rank} key={player.rank}>
            <p>{percentile(player.rank - 1, details.length)}%</p>
            <p>#{player.rank}</p>
            <div className="user-profile">
              <img src={player.avatar} alt={player.username} />
              <span>{player.username}</span>
            </div>
            <p>Lv. {player.level}</p>
          </div>
        ))}
      </div>


      <div className="Your_info">
        <p>Top {percentile(me.rank, 25000)}%</p>
        <p>#{me.rank}</p>
        <div className="your-profile">
          <img src={me.avatar} alt={me.username} />
          <span>{me.username}</span>
        </div>
        <p>Lv. {me.level}</p>
      </div>
    </div>
  );
}