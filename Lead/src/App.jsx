import React, { useRef, useState } from 'react';
import './index.css';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

// Default static fallback image for users without a profile picture
const DEFAULT_AVATAR = "https://i.ibb.co/Q7Nrs6BL/Lmpw-Zw.jpg";

// Reusable Avatar component
function Avatar({ src, alt }) {
  // If src is missing (null/undefined/empty), immediately use DEFAULT_AVATAR
  const [imgSrc, setImgSrc] = useState(src || DEFAULT_AVATAR);

  return (
    <img
      src={imgSrc}
      alt={alt || "User Avatar"}
      onError={() => setImgSrc(DEFAULT_AVATAR)} // Handles broken links (404s)
    />
  );
}

// Simulated Database Response (users with and without custom profile pictures)
const details = [
  { "rank": 1, "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", "username": "ShadowViper", "level": 84 },
  { "rank": 2, "avatar": null, "username": "PixelPioneer", "level": 79 }, // No avatar uploaded -> Shows Default
  { "rank": 3, "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", "username": "NovaBlade", "level": 75 },
  { "rank": 4, "avatar": "", "username": "CyberKnight", "level": 68 }, // Empty avatar uploaded -> Shows Default
  { "rank": 5, "avatar": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150", "username": "FrostByte", "level": 62 },
  { "rank": 6, "avatar": null, "username": "IronLotus", "level": 55 },
  { "rank": 7, "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150", "username": "AstraRunner", "level": 49 },
  { "rank": 8, "avatar": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150", "username": "EchoRider", "level": 41 },
  { "rank": 9, "avatar": null, "username": "VortexSeeker", "level": 33 },
  { "rank": 10, "avatar": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150", "username": "NeonRogue", "level": 27 }
];

export default function App() {
  const container = useRef(null);
  const [category, setCategory] = useState('A');

  // Currently logged-in user state
  const [me, setMe] = useState({
    rank: 22000,
    avatar: null, // Initially has no custom avatar
    username: "Sewo",
    level: 2
  });

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

  // Handle local file upload and convert to a shareable link/preview
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    /* PRODUCTION STEPS FOR FULL INTEGRATION:
       1. const formData = new FormData();
       2. formData.append('avatar', file);
       3. const response = await fetch('/api/user/upload-avatar', { method: 'POST', body: formData });
       4. const data = await response.json();
       5. setMe(prev => ({ ...prev, avatar: data.publicImageUrl }));
    */

    // Client-side preview for testing:
    const tempPreviewUrl = URL.createObjectURL(file);
    setMe((prev) => ({ ...prev, avatar: tempPreviewUrl }));
  };

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
              <Avatar src={player.avatar} alt={player.username} />
              <span>{player.username}</span>
            </div>
            <p>Lv. {player.level}</p>
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
        <p>Lv. {me.level}</p>
      </div>
    </div>
  );
}