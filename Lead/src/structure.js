const details = [
  { "rank": 1, "username": "ShadowViper", "level": 84 },
  { "rank": 2, "username": "PixelPioneer", "level": 79 },
  { "rank": 3, "username": "NovaBlade", "level": 75 },
  { "rank": 4, "username": "CyberKnight", "level": 68 },
  { "rank": 5, "username": "FrostByte", "level": 62 },
  { "rank": 6, "username": "IronLotus", "level": 55 },
  { "rank": 7, "username": "AstraRunner", "level": 49 },
  { "rank": 8, "username": "EchoRider", "level": 41 },
  { "rank": 9, "username": "VortexSeeker", "level": 33 },
  { "rank": 10, "username": "NeonRogue", "level": 27 }
];

const Self = [
  { "rank": 22000, "username": "Sewo", "level": 2 }
];

const index = 0;

let outer = document.createElement("div");
outer.className = 'outer';

let category = document.createElement("div");
category.className = 'Sections';

let User_card = document.createElement("div");
User_card.className = 'details';

let Self_info = document.createElement("div");
Self_info.className = 'Your_info';

outer.appendChild(category);
outer.appendChild(User_card);
outer.appendChild(Self_info);

document.body.append(outer);

const userDetail = details.map(player => `
  <div class="user-item">
    <p>${player.rank}</p>
    
    <div class="user-profile">
      <i class="fa-regular fa-circle-user" style="color: rgb(4, 68, 68);"></i>
      <span>${player.username}</span>
    </div>

    <p>${player.level}</p>
  </div>
`).join("");

User_card.innerHTML = userDetail;

const me = Self[0];
Self_info.innerHTML = `
  <p>${me.rank}</p>
  
  <div class="user-profile">
    <i class="fa-regular fa-circle-user" style="color: rgb(4, 68, 68);"></i>
    <span>${me.username}</span>
  </div>

  <p>${me.level}</p>
`;