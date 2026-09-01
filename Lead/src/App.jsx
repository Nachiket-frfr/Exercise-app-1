import React, { useRef, useState, useMemo } from 'react';
import './index.css';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const DEFAULT_AVATAR = "https://i.ibb.co/Q7Nrs6BL/Lmpw-Zw.jpg";

function Avatar({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_AVATAR);

  return (
    <img
      src={imgSrc}
      alt={alt || "User Avatar"}
      onError={() => setImgSrc(DEFAULT_AVATAR)}
    />
  );
}

const details = [
  { rank: 1, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", username: "ShadowViper", level: 84, totalVolume: 1250000, bestDailyVolume: 145000 },
  { rank: 2, avatar: null, username: "PixelPioneer", level: 79, totalVolume: 2100000, bestDailyVolume: 180000 },
  { rank: 3, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", username: "NovaBlade", level: 75, totalVolume: 980000, bestDailyVolume: 310000 },
  { rank: 4, avatar: "", username: "CyberKnight", level: 68, totalVolume: 1150000, bestDailyVolume: 120000 },
  { rank: 5, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", username: "FrostByte", level: 62, totalVolume: 850000, bestDailyVolume: 95000 },
  { rank: 6, avatar: null, username: "IronLotus", level: 55, totalVolume: 1420000, bestDailyVolume: 210000 },
  { rank: 7, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", username: "AstraRunner", level: 49, totalVolume: 620000, bestDailyVolume: 88000 },
  { rank: 8, avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", username: "EchoRider", level: 41, totalVolume: 450000, bestDailyVolume: 65000 },
  { rank: 9, avatar: null, username: "VortexSeeker", level: 33, totalVolume: 310000, bestDailyVolume: 42000 },
  { rank: 10, avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150", username: "NeonRogue", level: 27, totalVolume: 190000, bestDailyVolume: 28000 }
];

export default function App() {
  const container = useRef(null);
  const [category, setCategory] = useState('A');

  const [me, setMe] = useState({
    rank: 22000,
    avatar: null,
    username: "Sewo",
    level: 2,
    totalVolume: 45000,
    bestDailyVolume: 12000
  });

  const percentile = (rank, net_player) => {
    return ((rank / (net_player + 1)) * 100).toFixed(1);
  };

// THis is @1 used this to sort across multiple categories
const processedDetails = useMemo(() => {
    const list = [...details];
    if (category === 'B') {
      return list.sort((a, b) => b.totalVolume - a.totalVolume);
    } else if (category === 'C') {
      return list.sort((a, b) => b.bestDailyVolume - a.bestDailyVolume);
    }
    return list.sort((a, b) => b.level - a.level);
  }, [category]);

// used a switch case for self- 
const getDisplayValue= (player) => {
  switch(category){
    case 'B':
      return player.totalVolume.toLocaleString();
      case 'C':
        return player.bestDailyVolume.toLocaleString();
       case 'A':
        default:
          return  'Lv.' + ' '+ player.level; 
  }
};
const getHeaderTitle = () => {
    switch (category) {
      case 'B':
        return 'Total Volume';
      case 'C':
        return '1 Day Max Volume';
      case 'A':
      default:
        return 'Level';
    }
  };

  //  animation for when category state changes
  useGSAP(() => {
    gsap.from('.user-item', {
      opacity: 0,
      y: 15,
      stagger: 0.04,
      duration: 0.4,
      ease: 'power2.out'
    });
  }, { scope: container, dependencies: [category] });

  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const tempPreviewUrl = URL.createObjectURL(file);
    setMe((prev) => ({ ...prev, avatar: tempPreviewUrl }));
  };

  return (
    <div ref={container} className="outer">
      <legend className="info-tag">--------Category Selector--------</legend>

      {/* used category A,B,C , can add more to it by changing at @1 and adding more buttons here*/}
      <div className="category">
        <button onClick={() => setCategory('A')}>Level</button>
        <button onClick={() => setCategory('B')}>Total Volume</button>
        <button onClick={() => setCategory('C')}>1 Day Volume</button>
      </div>

      <div className="details">
        {/* Dynamic Table Header */}
        <div className="leaderboard-header">
          <h4>Part of Top</h4>
          <h4>Rank</h4>
          <h4>Username</h4>
          <h4>
            {category === 'A' && 'Level'}
            {category === 'B' && 'Total Volume'}
            {category === 'C' && '1 Day Max Volume'}
          </h4>
        </div>

        {/* Dynamic Rows */}
        {processedDetails.map((player, index) => (
          <div className="user-item" data-rank={index + 1} key={player.username}>
            <p>{percentile(index, details.length)}%</p>
            <p>#{index + 1}</p>
            <div className="user-profile">
              <Avatar src={player.avatar} alt={player.username} />
              <span>{player.username}</span>
            </div>
            <p>
              {category === 'A' && `Lv. ${player.level}`}
              {category === 'B' && player.totalVolume.toLocaleString()}
              {category === 'C' && player.bestDailyVolume.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Pinned Bottom Card for Logged-in User */}
      <div className="Your_info">
        <p>Top {percentile(me.rank, 25000)}%</p>
        <p>#{me.rank}</p>
        <div className="your-profile">
          <label htmlFor="avatar-upload" style={{ cursor: 'pointer' }} title="Click to upload profile picture">
            <Avatar src={me.avatar} alt={me.username} />
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            style={{ display: 'none' }}
          />
          <span>{me.username}</span>
        </div>
        <p>{getDisplayValue(me)}</p>
      </div>
    </div>
  );
}