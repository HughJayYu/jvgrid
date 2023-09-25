const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('game_boards.db');
const axios = require('axios'); 

const arcadeCharacters = [
  'G&W', 'Pac-Man', 'Donkey Kong', 'Mario', 'Luigi', 'Little Mac',
  'Ryu', 'Ken', 'Terry', 'Kazuya'
];
const nesCharacters = [
  'Duck Hunt', 'Ice Climbers', 'R.O.B', 'Piranha Plant', 'Peach', 'Bowser',
  'Link', 'Zelda', 'Samus', 'Ridley', 'Simon', 'Pit', 'Palutena', 'Snake',
  'Mega Man', 'Hero', 'Marth', 'Meta Knight'
];
const snesCharacters = [
  'Captain Falcon', 'Yoshi', 'Fox', 'Falco', 'Ness', 'Diddy Kong', 'King K.Rool'
];
const gameboyCharacters = [
  'Daisy', 'Dr. Mario', 'Kirby', 'King Dedede', 'PT', 'Pikachu', 'Jigglypuff',
  'Mewtwo', 'Wario', 'Pichu', 'Zero Suit Samus'
];
const n64Characters = [
  'Wolf', 'Young Link', 'Sheik', 'Ganondorf', 'Banjo', 'Villager'
];
const gameCubeCharacters = [
  'Olimar', 'Bowser Jr', 'Toon Link', 'Dark Samus', 'Ike', 'Villager'
];
const wiiWiiUSwitchCharacters = [
  'Rosalina', 'Wii Fit Trainer', 'Shulk', 'Mii Brawler', 'Mii Swordfighter', 'Mii Gunner', 'Inkling', 'Min Min', 'Byleth', 'Aegis'
];
const fightersPass2Characters = [
  'Min Min', 'Steve', 'Sephiroth', 'Aegis', 'Kazuya', 'Sora'
];
const jrpgCharacters = [
  'Shulk', 'Aegis', 'Joker', 'Hero', 'Cloud', 'Sephiroth'
];
const superHeavies = [
	'Bowser', 'King K.Rool', 'Donkey Kong', 'King Dedede', 'Ganondorf', 'Incineroar', 'PT', 'Kazuya', 'Piranha Plant'
];
const europeanNations = [
	'Austria', 'Belgium', 'Denmark', 'Finland', 'France', 'Germany', 'Greece', 'Iceland', 'Ireland', 'Italy', 'Luxembourg', 'Netherlands', 'Norway', 'Poland', 'Portugal', 'Russia', 'Scotland', 'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom'
]; 
const cenamNations = [
	'Bahamas', 'Costa Rica', 'Cuba', 'Dominican Republic', 'El Salvador', 'Honduras', 'Guatemala', 'Jamaica', 'Nicaragua', 'Puerto Rico', 'Trinidad'
];
const oceaniaNations = [ 
	'Australia', 'Hong Kong', 'India', 'Indonesia', 'Madagascar', 'Malaysia', 'Micronesia', 'New Zealand', 'Philippines', 'Singapore', 'South Korea', 'Taiwan', 'Thailand', 'Vietnam', 'China', 'Guam'
];

const conditionDescriptions = [
  'Player was on OrionRank 2022 (Top 150 + HMs)',
  'Tag is six or more characters',
  'Tag is four or less characters',
  'Player made Top 4 at a B/B+ Tier Event in 2023',
  'Player was on the PGR Smash 4 Top 100 All Time',
  'Tag starts with "s"',
  'Tag starts with a vowel',
  'mains/secondaries a "Pokemon" character',
  'Player is from Japan',
  'Player was on PGRUv1 (Spring 2019, Top "51")',
  'Player was on PGRUv2 (Fall 2019, Top "51")',
  'Player was on UltRank 22 (Fall 2022, Top 101)',
  'Player was on LumiRank Midyear 23 (Summer 2023, Top 151)',
  'Player was at Super Smash Con 2023',
  'Player placed within Top 64 at Super Smash Con 2023',
  'Player is from the United States',
  'Player placed within Top 32 at a 2023 P Tier', 
  'Player placed in Top 16 at a 2023 P Tier', 
  'Player has an offline set win on MkLeo or Acola', 
  'mains/secondaries a "Mario" character (DK, Wario, Yoshi universes inclusive)', 
  'mains/secondaries a "Zelda" character',
  'mains/secondaries a "Fire Emblem" character', 
  'mains/secondaries Steve', 
  'mains/secondaries a "third party" character', 
  'mains/secondaries a "DLC" character (Smash 4 DLC inclusive)', 
  'mains/secondaries a character that first appeared on the Game Boy Advance, Nintendo DS, or Nintendo 3DS',
  'Player was at Genesis 9',
  'Player was at Battle of BC 5',
  'Player was at Kagaribi 10',
  'Player placed within Top 64 of Genesis 9', 
  'Player placed within Top 64 of Battle of BC 5',
  'Player placed within Top 64 of Kagaribi 10',
  'Player mains/secondaries a character that debuted in Smash 64',
  'Player mains/secondaries a character that debuted in Melee',
  'Player mains/secondaries a character that debuted in Brawl',
  'Player mains/secondaries a character that debuted in Smash 4',
  'Player mains/secondaries a character that debuted in Ultimate',
  'Player mains/secondaries a "Top Tier" (UltRank Feb 2023 Tier List, S tiers)', 
  'Player mains/secondaries a "High Tier" (UltRank Feb 2023 Tier List, A tiers)',
  'Player mains/secondaries a "Mid Tier" (UltRank Feb 2023 Tier List, B tiers)', 
  'Player mains/secondaries a "Low/Bottom Tier" (UltRank Feb 2023 Tier List, C+D Tiers)',
  'Player is not from Japan, Mexico, or the United States.',
  'Player has made Top 8 at a 2023 Supermajor+ (S/S+/P Tier)', 
  'Player has made Top 8 at a 2023 Major (A/A+/S/S+/P Tier)',
  'mains/secondaries a character that first appeared on arcade hardware', 
  'mains/secondaries a character that first appeared on the NES',
  'mains/secondaries a character that first appeared on the SNES', 
  'mains/secondaries a character that first appeared on the Game Boy or Game Boy Color', 
  'mains/secondaries a character that first appeared on the N64', 
  'mains/secondaries a character that first appeared on the GameCube', 
  'mains/secondaries a character that first appeared on the Nintendo Wii, Wii U, or Switch', 
  'mains/secondaries a Fighters Pass 2 character', 
  'mains/secondaries a Xenoblade, Persona, Dragon Quest, or Final Fantasy character', 
  'is from Mexico',
  'Player was at EVO 2019', 
  'Player placed within Top 64 at EVO 2019', 
  'Player has won a major', 
  'Player mains/secondaries R.O.B', 
  'Player mains/secondaries a superheavy (112 weight+)', 
  'Player is from Europe', 
  'Player is from North America', 
  'Player is from Oceania, South Asia, Madagascar, Southeast Asia, or non-Japan East Asia',
  'Player was on OrionRank Eclipse 2021',
  'Player has made Top 16 at any Genesis in Ultimate', 
  'Player has made Top 16 at any Smash Con in Ultimate', 
  'Player has made Top 16 at any Battle of BC/Port Priority in Ultimate', 
  'Player has made Top 8 at any Kagaribi', 
  'Player has made Top 16 at any "Makes Moves" tournament', 
  'Player placed within Top 64 at Frostbite 2020', 
  'Player was at Frostbite 2020', 
  'Player has made Top 16 at any Glitch in Ultimate',
];
const rowConditions = [
  {
	condition: (player) => player.orEclipse == "TRUE", 
	description: conditionDescriptions[62], 
	sqlCall: 'orEclipse = "TRUE"',
  }, 
  {
	condition: (player) => player.orionrank22 == "TRUE", 
	description: conditionDescriptions[0], 
	sqlCall: 'orionrank22 = "TRUE"',
  }, 
  {
    condition: (player) => player.player_tag.length >= 6,
    description: conditionDescriptions[1],
    sqlCall: 'LENGTH(players.player_tag) >= 6',
  },
  {
    condition: (player) => player.player_tag.length <= 4,
    description: conditionDescriptions[2],
    sqlCall: 'LENGTH(players.player_tag) <= 4',
  },
  {
	condition: (player) => player.btop4 == "TRUE", 
	description: conditionDescriptions[3], 
	sqlCall: 'btop4 = "TRUE"',
  }, 
  {
	condition: (player) => player.s4top100 == "TRUE", 
	description: conditionDescriptions[4], 
	sqlCall: 's4top100 = "TRUE"',
  }, 
  {
    condition: (player) => player.player_tag.toLowerCase().startsWith('s'),
    description: conditionDescriptions[5],
    sqlCall: 'LOWER(players.player_tag) LIKE "s%"',
  },
  {
    condition: (player) => player.player_tag.toLowerCase().startsWith('a') || player.player_tag.toLowerCase().startsWith('e') || player.player_tag.toLowerCase().startsWith('i') || player.player_tag.toLowerCase().startsWith('o') || player.player_tag.toLowerCase().startsWith('u'),
    description: conditionDescriptions[6],
    sqlCall: '(LOWER(players.player_tag) LIKE "a%" OR LOWER(players.player_tag) LIKE "e%" OR LOWER(players.player_tag) LIKE "i%" OR LOWER(players.player_tag) LIKE "o%" OR LOWER(players.player_tag) LIKE "u%")',
  },
  {
    condition: (player) => player.player_mains.some((main) => { 
      const pokemonCharacters = ['Pikachu', 'Pichu', 'PT', 'Jigglypuff', 'Mewtwo', 'Lucario', 'Greninja', 'Incineroar'];
      return pokemonCharacters.some(character => main.includes(character));
    }), 
    description: conditionDescriptions[7],
    sqlCall: 'players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main LIKE "%Pikachu%" OR player_main LIKE "%Pichu%" OR player_main LIKE "%PT%" OR player_main LIKE "%Jigglypuff%" OR player_main LIKE "%Mewtwo%" OR player_main LIKE "%Lucario%" OR player_main LIKE "%Greninja%" OR player_main LIKE "%Incineroar%")',
  },
  {
    condition: (player) => player.winOnLeoAcola == "TRUE",
    description: conditionDescriptions[18],
    sqlCall: 'winOnLeoAcola = "TRUE"'
  },
  {
    condition: (player) => player.player_mains.some((main) => { 
      const marioCharacters = ['Mario', 'Luigi', 'Dr. Mario', 'Peach', 'Daisy', 'Bowser', 'Bowser Jr', 'Rosalina', 'Piranha Plant', 'Yoshi', 'Wario', 'Donkey Kong', 'Diddy Kong', 'King K.Rool'];
      return marioCharacters.some(character => main.includes(character));
    }), 
    description: conditionDescriptions[19],
    sqlCall: 'players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main LIKE "%Mario%" OR player_main LIKE "%Luigi%" OR player_main LIKE "%Dr. Mario%" OR player_main LIKE "%Peach%" OR player_main LIKE "%Daisy%" OR player_main LIKE "%Bowser%" OR player_main LIKE "%Bowser Jr%" OR player_main LIKE "%Rosalina%" OR player_main LIKE "%Piranha Plant%" OR player_main LIKE "%Yoshi%" OR player_main LIKE "%Wario%" OR player_main LIKE "%Donkey Kong%" OR player_main LIKE "%Diddy Kong%" OR player_main LIKE "%King K.Rool%")',
  },
  {
    condition: (player) => player.player_mains.some((main) => { 
      const zeldaCharacters = ['Link', 'Toon Link', 'Young Link', 'Zelda', 'Sheik', 'Ganondorf'];
      return zeldaCharacters.some(character => main.includes(character));
    }), 
    description: conditionDescriptions[20],
    sqlCall: 'players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main LIKE "%Link%" OR player_main LIKE "%Toon Link%" OR player_main LIKE "%Young Link%" OR player_main LIKE "%Zelda%" OR player_main LIKE "%Sheik%" OR player_main LIKE "%Ganondorf%")',
  }, 
  {
    condition: (player) => player.player_mains.some((main) => { 
      const fireEmblemCharacters = ['Marth', 'Roy', 'Lucina', 'Chrom', 'Ike', 'Robin', 'Corrin', 'Byleth'];
      return fireEmblemCharacters.some(character => main.includes(character));
    }), 
    description: conditionDescriptions[21],
    sqlCall: 'players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main LIKE "%Marth%" OR player_main LIKE "%Roy%" OR player_main LIKE "%Lucina%" OR player_main LIKE "%Chrom%" OR player_main LIKE "%Ike%" OR player_main LIKE "%Robin%" OR player_main LIKE "%Corrin%" OR player_main LIKE "%Byleth%")',
  },  
  {
    condition: (player) => player.player_mains.some((main) => { 
      const thirdPartyCharacters = ['Sonic', 'Snake', 'Pac-Man', 'Mega Man', 'Ryu', 'Ken', 'Cloud', 'Bayonetta', 'Simon', 'Richter', 'Joker', 'Hero', 'Banjo', 'Terry', 'Steve', 'Sephiroth', 'Kazuya', 'Sora'];
      return thirdPartyCharacters.some(character => main.includes(character)); 
    }), 
    description: conditionDescriptions[23],
    sqlCall: 'players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main LIKE "%Sonic%" OR player_main LIKE "%Snake%" OR player_main LIKE "%Pac-Man%" OR player_main LIKE "%Mega Man%" OR player_main LIKE "%Ryu%" OR player_main LIKE "%Ken%" OR player_main LIKE "%Cloud%" OR player_main LIKE "%Bayonetta%" OR player_main LIKE "%Simon%" OR player_main LIKE "%Richter%" OR player_main LIKE "%Joker%" OR player_main LIKE "%Hero%" OR player_main LIKE "%Banjo%" OR player_main LIKE "%Terry%" OR player_main LIKE "%Steve%" OR player_main LIKE "%Sephiroth%" OR player_main LIKE "%Kazuya%" OR player_main LIKE "%Sora%")',
  },
  {
    condition: (player) => player.player_mains.some((main) => { 
      const dlcCharacters = ['Mewtwo', 'Roy', 'Lucas', 'Ryu', 'Corrin', 'Cloud', 'Bayonetta', 'Piranha Plant', 'Joker', 'Hero', 'Banjo', 'Terry', 'Byleth', 'Min Min', 'Steve', 'Sephiroth', 'Aegis', 'Kazuya', 'Sora'];
      return dlcCharacters.some(character => main.includes(character)); 
    }), 
    description: conditionDescriptions[24],
    sqlCall: 'players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main LIKE "%Mewtwo%" OR player_main LIKE "%Roy%" OR player_main LIKE "%Lucas%" OR player_main LIKE "%Ryu%" OR player_main LIKE "%Corrin%" OR player_main LIKE "%Cloud%" OR player_main LIKE "%Bayonetta%" OR player_main LIKE "%Piranha Plant%" OR player_main LIKE "%Joker%" OR player_main LIKE "%Hero%" OR player_main LIKE "%Banjo%" OR player_main LIKE "%Terry%" OR player_main LIKE "%Byleth%" OR player_main LIKE "%Min Min%" OR player_main LIKE "%Steve%" OR player_main LIKE "%Sephiroth%" OR player_main LIKE "%Aegis%" OR player_main LIKE "%Kazuya%" OR player_main LIKE "%Sora%")',
  },
  {
	condition: (player) => player.supermajortop8 == "TRUE", 
	description: conditionDescriptions[42], 
	sqlCall: 'supermajortop8 = "TRUE"',
  }, 
  {
	condition: (player) => player.majortop8 == "TRUE", 
	description: conditionDescriptions[43], 
	sqlCall: 'majortop8 = "TRUE"', 
  },
  {
    condition: (player) => player.genesis9place > 0 && player.genesis9place <= 64,
    description: conditionDescriptions[29],
    sqlCall: 'genesis9place > 0 AND genesis9place <= 64',
  },
  {
    condition: (player) => player.bobc5place > 0 && player.bobc5place <= 64,
    description: conditionDescriptions[30],
    sqlCall: 'bobc5place > 0 AND bobc5place <= 64',
  },
  {
    condition: (player) => player.kag10place > 0 && player.kag10place <= 64,
    description: conditionDescriptions[31],
    sqlCall: 'kag10place > 0 AND kag10place <= 64',
  },
  {
    condition: (player) => (
      player.player_mains.includes('G&W') ||
      player.player_mains.includes('Pac-Man') ||
      player.player_mains.includes('Donkey Kong') ||
      player.player_mains.includes('Mario') ||
      player.player_mains.includes('Luigi') ||
      player.player_mains.includes('Little Mac') ||
      player.player_mains.includes('Ryu') ||
      player.player_mains.includes('Ken') ||
      player.player_mains.includes('Terry') ||
      player.player_mains.includes('Kazuya')
    ),
    description: conditionDescriptions[44],
    sqlCall: `players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main IN ("G&W","Pac-Man","Donkey Kong","Mario","Luigi","Little Mac","Ryu","Ken","Terry","Kazuya"))`,
  },
  {
    condition: (player) => (
      player.player_mains.includes('Duck Hunt') ||
      player.player_mains.includes('Ice Climbers') ||
      player.player_mains.includes('R.O.B') ||
      player.player_mains.includes('Piranha Plant') ||
      player.player_mains.includes('Peach') ||
      player.player_mains.includes('Bowser') ||
      player.player_mains.includes('Link') ||
      player.player_mains.includes('Zelda') ||
      player.player_mains.includes('Samus') ||
      player.player_mains.includes('Ridley') ||
      player.player_mains.includes('Simon') ||
      player.player_mains.includes('Pit') ||
      player.player_mains.includes('Palutena') ||
      player.player_mains.includes('Snake') ||
      player.player_mains.includes('Mega Man') ||
      player.player_mains.includes('Hero') ||
      player.player_mains.includes('Marth') ||
      player.player_mains.includes('Meta Knight')
    ),
    description: conditionDescriptions[45],
    sqlCall: `players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main IN ("Duck Hunt","Ice Climbers","R.O.B","Piranha Plant","Peach","Bowser","Link","Zelda","Samus","Ridley","Simon","Pit","Palutena","Snake","Mega Man","Hero","Marth","Meta Knight"))`,
  },
/*
  {
    condition: (player) => (
      player.player_mains.includes('Captain Falcon') ||
      player.player_mains.includes('Yoshi') ||
      player.player_mains.includes('Fox') ||
      player.player_mains.includes('Falco') ||
      player.player_mains.includes('Ness') ||
      player.player_mains.includes('Diddy Kong') ||
      player.player_mains.includes('King K.Rool')
    ),
    description: conditionDescriptions[46],
    sqlCall: `players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main IN ("Captain Falcon","Yoshi","Fox","Falco","Ness","Diddy Kong","King K.Rool"))`,
  },
  {
    condition: (player) => (
      player.player_mains.includes('Daisy') ||
      player.player_mains.includes('Dr. Mario') ||
      player.player_mains.includes('Kirby') ||
      player.player_mains.includes('King Dedede') ||
      player.player_mains.includes('PT') ||
      player.player_mains.includes('Pikachu') ||
      player.player_mains.includes('Jigglypuff') ||
      player.player_mains.includes('Mewtwo') ||
      player.player_mains.includes('Wario') ||
      player.player_mains.includes('Pichu')
    ),
    description: conditionDescriptions[47],
    sqlCall: `players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main IN ("Daisy","Dr. Mario","Kirby","King Dedede","PT","Pikachu","Jigglypuff","Mewtwo","Wario","Pichu"))`,
  }, 
*/
  {
    condition: (player) => player.evo19place > 0,
    description: conditionDescriptions[54],
	sqlCall: 'evo19place' > 0,
  },  
  {
    condition: (player) => player.evo19place > 0 && player.evo19place < 64,
    description: conditionDescriptions[55],
	sqlCall: 'evo19place > 0 AND evo19place < 64',
  },  
  {
    condition: (player) => player.majorWinner == "TRUE",
    description: conditionDescriptions[56],
    sqlCall: 'majorWinner = "TRUE"',
  },
  {
    condition: (player) => player.player_mains.includes('R.O.B'),
    description: conditionDescriptions[57],
    sqlCall: 'players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main LIKE "%R.O.B%")',
  },  
  {
    condition: (player) => (
      player.player_mains.includes('Bowser') ||
      player.player_mains.includes('King K.Rool') ||
      player.player_mains.includes('Donkey Kong') ||
      player.player_mains.includes('King Dedede') ||
      player.player_mains.includes('Ganondorf') ||
      player.player_mains.includes('Incineroar') ||
      player.player_mains.includes('PT') ||
      player.player_mains.includes('Kazuya') ||
      player.player_mains.includes('Piranha Plant')
    ),
    description: conditionDescriptions[58],
    sqlCall: `players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main IN ("Bowser","King K.Rool","Donkey Kong","King Dedede","Ganondorf","Incineroar","PT","Kazuya","Piranha Plant"))`,
  },
  {
    condition: (player) => player.makesmovesTop16 == 'TRUE',
    description: conditionDescriptions[67],
    sqlCall: 'makesmovesTop16 = "TRUE"',
  },     
  {
    condition: (player) => player.fb20place > 0 && player.fb20place < 64,
    description: conditionDescriptions[68],
	sqlCall: 'fb20place > 0 AND fb20place < 64',
  },  
  {
    condition: (player) => player.glitchTop16 == 'TRUE',
    description: conditionDescriptions[65],
    sqlCall: 'glitchTop16 = "TRUE"',
  },   
];
const columnConditions = [
  {
    condition: (player) => player.fb20place > 0,
    description: conditionDescriptions[69],
	sqlCall: 'fb20place > 0',
  },  
  {
    condition: (player) => player.player_mains.includes('Steve'),
    description: conditionDescriptions[22],
    sqlCall: 'players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main LIKE "%Steve%")',
  },
  {
    condition: (player) => player.nationality == 'Japan',
    description: conditionDescriptions[8],
    sqlCall: 'nationality = "Japan"',
  },
  {
    condition: (player) => player.pgru1 == "TRUE",
    description: conditionDescriptions[9],
    sqlCall: 'pgru1 = "TRUE"',
  },
  {
    condition: (player) => player.pgru2 == "TRUE",
    description: conditionDescriptions[10],
    sqlCall: 'pgru2 = "TRUE"',
  },
  {
    condition: (player) => player.ultrank22 == "TRUE",
    description: conditionDescriptions[11],
    sqlCall: 'ultrank22 = "TRUE"',
  },
  {
    condition: (player) => player.lumirankmid23 == "TRUE",
    description: conditionDescriptions[12],
    sqlCall: 'lumirankmid23 = "TRUE"',
  },
  {
    condition: (player) => player.ssc23place > 0,
    description: conditionDescriptions[13],
    sqlCall: 'ssc23place > 0',
  },
  {
    condition: (player) => player.ssc23place > 0 && player.ssc23place < 64,
    description: conditionDescriptions[14],
    sqlCall: 'ssc23place > 0 AND ssc23place < 64',
  },
  {
    condition: (player) => player.nationality == 'United States',
    description: conditionDescriptions[15],
    sqlCall: 'nationality = "United States"',
  },
  {
    condition: (player) => (player.ssc23place > 0 && player.ssc23place < 32) || (player.kag10place > 0 && player.kag10place < 32) || (player.genesis9place > 0 && player.genesis9place < 32) || (player.bobc5place > 0 && player.bobc5place < 32),
    description: conditionDescriptions[16],
    sqlCall: '((ssc23place > 0 AND ssc23place < 32) OR (kag10place > 0 AND kag10place < 32) OR (genesis9place > 0 AND genesis9place < 32) OR (bobc5place > 0 AND bobc5place < 32))',
  },
  {
    condition: (player) => (player.ssc23place > 0 && player.ssc23place < 16) || (player.kag10place > 0 && player.kag10place < 16) || (player.genesis9place > 0 && player.genesis9place < 16) || (player.bobc5place > 0 && player.bobc5place < 16),
    description: conditionDescriptions[17],
    sqlCall: '((ssc23place > 0 AND ssc23place < 16) OR (kag10place > 0 AND kag10place < 16) OR (genesis9place > 0 AND genesis9place < 16) OR (bobc5place > 0 AND bobc5place < 16))',
  },
  {
    condition: (player) => player.player_mains.some((main) => {
      const modernHandheldCharacters = ['Roy', 'Lucas', 'Lucario', 'Dark Pit', 'Robin', 'Chrom', 'Lucina', 'Isabelle', 'Greninja', 'Corrin', 'Incineroar', 'Zero Suit Samus'];
      return modernHandheldCharacters.includes(main);
    }),
    description: conditionDescriptions[25],
    sqlCall: 'players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main LIKE "%Roy%" OR player_main LIKE "%Lucas%" OR player_main LIKE "%Zero Suit Samus%" OR player_main LIKE "%Lucario%" OR player_main LIKE "%Dark Pit%" OR player_main LIKE "%Robin%" OR player_main LIKE "%Chrom%" OR player_main LIKE "%Lucina%" OR player_main LIKE "%Isabelle%" OR player_main LIKE "%Greninja%" OR player_main LIKE "%Corrin%" OR player_main LIKE "%Incineroar%")',
  },
  {
    condition: (player) => player.genesis9place > 0,
    description: conditionDescriptions[26],
    sqlCall: 'genesis9place > 0',
  },
  {
    condition: (player) => player.bobc5place > 0,
    description: conditionDescriptions[27],
    sqlCall: 'bobc5place > 0',
  },
  {
    condition: (player) => player.kag10place > 0,
    description: conditionDescriptions[28],
    sqlCall: 'kag10place > 0',
  },
  {
    condition: (player) => player.player_mains.some((main) => {
      const smash64Characters = ['Mario', 'Donkey Kong', 'Link', 'Samus', 'Yoshi', 'Kirby', 'Fox', 'Pikachu', 'Luigi', 'Ness', 'Captain Falcon', 'Jigglypuff'];
      return smash64Characters.includes(main);
    }),
    description: conditionDescriptions[32],
    sqlCall: 'players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main LIKE "%Mario%" OR player_main LIKE "%Donkey Kong%" OR player_main LIKE "%Link%" OR player_main LIKE "%Samus%" OR player_main LIKE "%Yoshi%" OR player_main LIKE "%Kirby%" OR player_main LIKE "%Fox%" OR player_main LIKE "%Pikachu%" OR player_main LIKE "%Luigi%" OR player_main LIKE "%Ness%" OR player_main LIKE "%Captain Falcon%" OR player_main LIKE "%Jigglypuff%")',
  },
  {
    condition: (player) => player.player_mains.some((main) => {
      const meleeCharacters = ['Peach', 'Bowser', 'Ice Climbers', 'Sheik', 'Zelda', 'Dr. Mario', 'Pichu', 'Falco', 'Marth', 'Young Link', 'Ganondorf', 'Mewtwo', 'Roy', 'G&W'];
      return meleeCharacters.includes(main);
    }),
    description: conditionDescriptions[33],
    sqlCall: 'players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main LIKE "%Peach%" OR player_main LIKE "%Bowser%" OR player_main LIKE "%Ice Climbers%" OR player_main LIKE "%Sheik%" OR player_main LIKE "%Zelda%" OR player_main LIKE "%Dr. Mario%" OR player_main LIKE "%Pichu%" OR player_main LIKE "%Falco%" OR player_main LIKE "%Marth%" OR player_main LIKE "%Young Link%" OR player_main LIKE "%Ganondorf%" OR player_main LIKE "%Mewtwo%" OR player_main LIKE "%Roy%" OR player_main LIKE "%G&W%")',
  },
  {
    condition: (player) => player.player_mains.some((main) => {
      const brawlCharacters = ['Meta Knight', 'Pit', 'Zero Suit Samus', 'Wario', 'Snake', 'Ike', 'PT', 'Diddy Kong', 'Lucas', 'Sonic', 'King Dedede', 'Olimar', 'Lucario', 'R.O.B', 'Toon Link', 'Wolf'];
      return brawlCharacters.includes(main);
    }),
    description: conditionDescriptions[34],
    sqlCall: 'players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main LIKE "%Meta Knight%" OR player_main LIKE "%Pit%" OR player_main LIKE "%Zero Suit Samus%" OR player_main LIKE "%Wario%" OR player_main LIKE "%Snake%" OR player_main LIKE "%Ike%" OR player_main LIKE "%PT%" OR player_main LIKE "%Diddy Kong%" OR player_main LIKE "%Lucas%" OR player_main LIKE "%Sonic%" OR player_main LIKE "%King Dedede%" OR player_main LIKE "%Olimar%" OR player_main LIKE "%Lucario%" OR player_main LIKE "%R.O.B%" OR player_main LIKE "%Toon Link%" OR player_main LIKE "%Wolf%")',
  },
  {
    condition: (player) => player.player_mains.some((main) => {
      const smash4Characters = ['Villager', 'Mega Man', 'Wii Fit Trainer', 'Rosalina', 'Little Mac', 'Greninja', 'Mii Brawler', 'Mii Swordfighter', 'Mii Gunner', 'Palutena', 'Pac-Man', 'Robin', 'Shulk', 'Bowser Jr', 'Duck Hunt', 'Ryu', 'Cloud', 'Corrin', 'Bayonetta', 'Lucina', 'Dark Pit'];
      return smash4Characters.includes(main);
    }),
    description: conditionDescriptions[35],
    sqlCall: 'players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main LIKE "%Villager%" OR player_main LIKE "%Mega Man%" OR player_main LIKE "%Wii Fit Trainer%" OR player_main LIKE "%Rosalina%" OR player_main LIKE "%Little Mac%" OR player_main LIKE "%Greninja%" OR player_main LIKE "%Mii Brawler%" OR player_main LIKE "%Mii Swordfighter%" OR player_main LIKE "%Mii Gunner%" OR player_main LIKE "%Palutena%" OR player_main LIKE "%Pac-Man%" OR player_main LIKE "%Robin%" OR player_main LIKE "%Shulk%" OR player_main LIKE "%Bowser Jr%" OR player_main LIKE "%Duck Hunt%" OR player_main LIKE "%Ryu%" OR player_main LIKE "%Cloud%" OR player_main LIKE "%Corrin%" OR player_main LIKE "%Bayonetta%" OR player_main LIKE "%Lucina%" OR player_main LIKE "%Dark Pit%")',
  },
  {
    condition: (player) => player.player_mains.some((main) => {
      const ultimateCharacters = ['Inkling', 'Ridley', 'Simon', 'Richter', 'King K.Rool', 'Isabelle', 'Incineroar', 'Dark Samus', 'Daisy', 'Chrom', 'Piranha Plant', 'Joker', 'Hero', 'Banjo', 'Terry', 'Byleth', 'Min Min', 'Steve', 'Sephiroth', 'Pyra/Mythra', 'Kazuya', 'Sora', 'Ken'];
      return ultimateCharacters.includes(main);
    }),
    description: conditionDescriptions[36],
    sqlCall: 'players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main LIKE "%Inkling%" OR player_main LIKE "%Ridley%" OR player_main LIKE "%Simon%" OR player_main LIKE "%Richter%" OR player_main LIKE "%King K.Rool%" OR player_main LIKE "%Isabelle%" OR player_main LIKE "%Incineroar%" OR player_main LIKE "%Dark Samus%" OR player_main LIKE "%Daisy%" OR player_main LIKE "%Chrom%" OR player_main LIKE "%Piranha Plant%" OR player_main LIKE "%Joker%" OR player_main LIKE "%Hero%" OR player_main LIKE "%Banjo%" OR player_main LIKE "%Terry%" OR player_main LIKE "%Byleth%" OR player_main LIKE "%Min Min%" OR player_main LIKE "%Steve%" OR player_main LIKE "%Sephiroth%" OR player_main LIKE "%Pyra/Mythra%" OR player_main LIKE "%Kazuya%" OR player_main LIKE "%Sora%" OR player_main LIKE "%Ken%")',
  },
  {
    condition: (player) => { 
      const topTierCharacters = ['Steve', 'Aegis', 'Joker', 'Sonic', 'Fox', 'R.O.B', 'Kazuya', 'Roy', 'Peach', 'Daisy', 'Cloud', 'Wolf', 'Diddy Kong', 'Pikachu', 'Pac-Man', 'Snake', 'Min Min', 'Palutena', 'G&W', 'Shulk'];
      return player.player_mains.some((main) => topTierCharacters.includes(main));
    }, 
    description: conditionDescriptions[37],
    sqlCall: 'players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main LIKE "%Steve%" OR player_main LIKE "%Aegis%" OR player_main LIKE "%Joker%" OR player_main LIKE "%Sonic%" OR player_main LIKE "%Fox%" OR player_main LIKE "%R.O.B%" OR player_main LIKE "%Kazuya%" OR player_main LIKE "%Roy%" OR player_main LIKE "%Peach%" OR player_main LIKE "%Daisy%" OR player_main LIKE "%Cloud%" OR player_main LIKE "%Wolf%" OR player_main LIKE "%Diddy Kong%" OR player_main LIKE "%Pikachu%" OR player_main LIKE "%Pac-Man%" OR player_main LIKE "%Snake%" OR player_main LIKE "%Min Min%" OR player_main LIKE "%Palutena%" OR player_main LIKE "%G&W%" OR player_main LIKE "%Shulk%")',
  },
  {
    condition: (player) => { 
      const highTierCharacters = ['Yoshi', 'Mario', 'Lucina', 'PT', 'Wario', 'Samus', 'Dark Samus', 'Zero Suit Samus', 'Sephiroth', 'Olimar', 'Young Link', 'Terry', 'Sora', 'Byleth', 'Greninja', 'Ken', 'Sheik', 'Ryu', 'Mii Brawler', 'Mega Man'];
      return player.player_mains.some((main) => highTierCharacters.includes(main));
    }, 
    description: conditionDescriptions[38],
    sqlCall: 'players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main LIKE "%Yoshi%" OR player_main LIKE "%Mario%" OR player_main LIKE "%Lucina%" OR player_main LIKE "%PT%" OR player_main LIKE "%Wario%" OR player_main LIKE "%Samus%" OR player_main LIKE "%Dark Samus%" OR player_main LIKE "%Zero Suit Samus%" OR player_main LIKE "%Sephiroth%" OR player_main LIKE "%Olimar%" OR player_main LIKE "%Young Link%" OR player_main LIKE "%Terry%" OR player_main LIKE "%Sora%" OR player_main LIKE "%Byleth%" OR player_main LIKE "%Greninja%" OR player_main LIKE "%Ken%" OR player_main LIKE "%Sheik%" OR player_main LIKE "%Ryu%" OR player_main LIKE "%Mii Brawler%" OR player_main LIKE "%Mega Man%")',
  },
  {
    condition: (player) => { 
      const midTierCharacters = ['Captain Falcon', 'Ness', 'Falco', 'Corrin', 'Chrom', 'Hero', 'Bayonetta', 'Inkling', 'Luigi', 'Rosalina', 'Toon Link', 'Bowser', 'Meta Knight', 'Pit', 'Dark Pit', 'Link', 'Marth', 'Pichu', 'Ice Climbers'];
      return player.player_mains.some((main) => midTierCharacters.includes(main));
    }, 
    description: conditionDescriptions[39],
    sqlCall: 'players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main LIKE "%Captain Falcon%" OR player_main LIKE "%Ness%" OR player_main LIKE "%Falco%" OR player_main LIKE "%Corrin%" OR player_main LIKE "%Chrom%" OR player_main LIKE "%Hero%" OR player_main LIKE "%Bayonetta%" OR player_main LIKE "%Inkling%" OR player_main LIKE "%Luigi%" OR player_main LIKE "%Rosalina%" OR player_main LIKE "%Toon Link%" OR player_main LIKE "%Bowser%" OR player_main LIKE "%Meta Knight%" OR player_main LIKE "%Pit%" OR player_main LIKE "%Dark Pit%" OR player_main LIKE "%Link%" OR player_main LIKE "%Marth%" OR player_main LIKE "%Pichu%" OR player_main LIKE "%Ice Climbers%")',
  },
  {
    condition: (player) => { 
      const lowTierCharacters = ['Wii Fit Trainer', 'Lucas', 'Jigglypuff', 'Ridley', 'Mii Gunner', 'Robin', 'Mewtwo', 'Incineroar', 'Ike', 'Banjo', 'Duck Hunt', 'Simon', 'Richter', 'Villager', 'Donkey Kong', 'Lucario', 'Bowser Jr', 'Isabelle', 'King K.Rool', 'Zelda', 'Kirby', 'Piranha Plant', 'Mii Swordfighter', 'Dr. Mario', 'King Dedede', 'Little Mac', 'Ganondorf'];
      return player.player_mains.some((main) => lowTierCharacters.includes(main));
    }, 
    description: conditionDescriptions[40],
    sqlCall: 'players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main LIKE "%Wii Fit Trainer%" OR player_main LIKE "%Lucas%" OR player_main LIKE "%Jigglypuff%" OR player_main LIKE "%Ridley%" OR player_main LIKE "%Mii Gunner%" OR player_main LIKE "%Robin%" OR player_main LIKE "%Mewtwo%" OR player_main LIKE "%Incineroar%" OR player_main LIKE "%Ike%" OR player_main LIKE "%Banjo%" OR player_main LIKE "%Duck Hunt%" OR player_main LIKE "%Simon%" OR player_main LIKE "%Richter%" OR player_main LIKE "%Villager%" OR player_main LIKE "%Donkey Kong%" OR player_main LIKE "%Lucario%" OR player_main LIKE "%Bowser Jr.%" OR player_main LIKE "%Isabelle%" OR player_main LIKE "%King K.Rool%" OR player_main LIKE "%Zelda%" OR player_main LIKE "%Kirby%" OR player_main LIKE "%Piranha Plant%" OR player_main LIKE "%Mii Swordfighter%" OR player_main LIKE "%Dr. Mario%" OR player_main LIKE "%King Dedede%" OR player_main LIKE "%Little Mac%" OR player_main LIKE "%Ganondorf%")',
  },
  {
    condition: (player) =>
      player.nationality !== 'Japan' && player.nationality !== 'Mexico' && player.nationality !== 'United States',
    description: conditionDescriptions[41],
    sqlCall: 'nationality != "Japan" AND nationality != "Mexico" AND nationality != "United States"',
  },
/*
  {
    condition: (player) => (
      player.player_mains.includes('Wolf') ||
      player.player_mains.includes('Young Link') ||
      player.player_mains.includes('Sheik') ||
      player.player_mains.includes('Ganondorf') ||
      player.player_mains.includes('Banjo') ||
      player.player_mains.includes('Villager')
    ),
    description: conditionDescriptions[48],
    sqlCall: `players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main IN ("Wolf","Young Link","Sheik","Ganondorf","Banjo","Villager"))`,
  },
*/
  {
    condition: (player) => (
      player.player_mains.includes('Olimar') ||
      player.player_mains.includes('Bowser Jr') ||
      player.player_mains.includes('Toon Link') ||
      player.player_mains.includes('Dark Samus') ||
      player.player_mains.includes('Ike') ||
      player.player_mains.includes('Villager')
    ),
    description: conditionDescriptions[49],
    sqlCall: `players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main IN ("Olimar","Bowser Jr","Toon Link","Dark Samus","Ike","Villager"))`,
  },
  {
    condition: (player) => (
      player.player_mains.includes('Rosalina') ||
      player.player_mains.includes('Wii Fit Trainer') ||
      player.player_mains.includes('Shulk') ||
      player.player_mains.includes('Mii Brawler') ||
      player.player_mains.includes('Mii Swordfighter') ||
      player.player_mains.includes('Mii Gunner') ||
      player.player_mains.includes('Inkling') ||
      player.player_mains.includes('Min Min') ||
      player.player_mains.includes('Byleth') ||
      player.player_mains.includes('Aegis')
    ),
    description: conditionDescriptions[50],
    sqlCall: `players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main IN ("Rosalina","Wii Fit Trainer","Shulk","Mii Brawler","Mii Swordfighter","Mii Gunner","Inkling","Min Min","Byleth","Aegis"))`,
  },
  {
    condition: (player) => (
      player.player_mains.includes('Min Min') ||
      player.player_mains.includes('Steve') ||
      player.player_mains.includes('Sephiroth') ||
      player.player_mains.includes('Aegis') ||
      player.player_mains.includes('Kazuya') ||
      player.player_mains.includes('Sora')
    ),
    description: conditionDescriptions[51],
    sqlCall: `players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main IN ("Min Min","Steve","Sephiroth","Aegis","Kazuya","Sora"))`,
  },
  {
    condition: (player) => (
      player.player_mains.includes('Shulk') ||
      player.player_mains.includes('Aegis') ||
      player.player_mains.includes('Joker') ||
      player.player_mains.includes('Hero') ||
      player.player_mains.includes('Cloud') ||
      player.player_mains.includes('Sephiroth')
    ),
    description: conditionDescriptions[52],
    sqlCall: `players.player_tag IN (SELECT player_tag FROM db2.mains WHERE player_main IN ("Shulk","Aegis","Joker","Hero","Cloud","Sephiroth"))`,
  },
  {
    condition: (player) => player.nationality == 'Mexico',
    description: conditionDescriptions[53],
    sqlCall: 'nationality = "Mexico"',
  },   
  {
   condition: (player) => (
     player.nationality === 'Austria' ||
     player.nationality === 'Belgium' ||
     player.nationality === 'Denmark' ||
     player.nationality === 'Finland' ||
     player.nationality === 'France' ||
     player.nationality === 'Germany' ||
     player.nationality === 'Greece' ||
     player.nationality === 'Iceland' ||
     player.nationality === 'Ireland' ||
     player.nationality === 'Italy' ||
     player.nationality === 'Luxembourg' ||
     player.nationality === 'Netherlands' ||
     player.nationality === 'Norway' ||
     player.nationality === 'Poland' ||
     player.nationality === 'Portugal' ||
     player.nationality === 'Russia' ||
     player.nationality === 'Scotland' ||
     player.nationality === 'Spain' ||
     player.nationality === 'Sweden' ||
     player.nationality === 'Switzerland' ||
     player.nationality === 'Turkey' ||
     player.nationality === 'Ukraine' ||
     player.nationality === 'United Kingdom'
   ),
    description: conditionDescriptions[59],
    sqlCall: '(nationality = "Austria" OR nationality = "Belgium" OR nationality = "Denmark" OR nationality = "Finland" OR nationality = "France" OR nationality = "Germany" OR nationality = "Greece" OR nationality = "Iceland" OR nationality = "Ireland" OR nationality = "Italy" OR nationality = "Luxembourg" OR nationality = "Netherlands" OR nationality = "Norway" OR nationality = "Poland" OR nationality = "Portugal" OR nationality = "Russia" OR nationality = "Scotland" OR nationality = "Spain" OR nationality = "Sweden" OR nationality = "Switzerland" OR nationality = "Turkey" OR nationality = "Ukraine" OR nationality = "United Kingdom")',
  },
  {
    condition: (player) => (
    player.nationality === 'Bahamas' ||
    player.nationality === 'Costa Rica' ||
    player.nationality === 'Cuba' ||
    player.nationality === 'Dominican Republic' ||
    player.nationality === 'El Salvador' ||
    player.nationality === 'Honduras' ||
    player.nationality === 'Guatemala' ||
    player.nationality === 'Jamaica' ||
    player.nationality === 'Nicaragua' ||
    player.nationality === 'Puerto Rico' ||
    player.nationality === 'Trinidad'
  ),
    description: conditionDescriptions[60],
    sqlCall: '(nationality = "Bahamas" OR nationality = "Costa Rica" OR nationality = "Cuba" OR nationality = "Dominican Republic" OR nationality = "El Salvador" OR nationality = "Honduras" OR nationality = "Guatemala" OR nationality = "Jamaica" OR nationality = "Nicaragua" OR nationality = "Puerto Rico" OR nationality = "Trinidad")',
  },
  {
    condition: (player) => (
    player.nationality === 'Australia' ||
    player.nationality === 'Hong Kong' ||
    player.nationality === 'India' ||
    player.nationality === 'Indonesia' ||
    player.nationality === 'Madagascar' ||
    player.nationality === 'Malaysia' ||
    player.nationality === 'Micronesia' ||
    player.nationality === 'New Zealand' ||
    player.nationality === 'Philippines' ||
    player.nationality === 'Singapore' ||
    player.nationality === 'South Korea' ||
    player.nationality === 'Taiwan' ||
    player.nationality === 'Thailand' ||
    player.nationality === 'Vietnam' || 
	player.nationality === 'China' || 
	player.nationality === 'Guam'
  ),
    description: conditionDescriptions[61],
    sqlCall: '(nationality = "Australia" OR nationality = "China" OR nationality = "Hong Kong" OR nationality = "India" OR nationality = "Indonesia" OR nationality = "Madagascar" OR nationality = "Malaysia" OR nationality = "Micronesia" OR nationality = "New Zealand" OR nationality = "Philippines" OR nationality = "Singapore" OR nationality = "South Korea" OR nationality = "Taiwan" OR nationality = "Thailand" OR nationality = "Vietnam" OR nationality = "Guam")',
  },
  {
    condition: (player) => player.genesisTop16 == 'TRUE',
    description: conditionDescriptions[63],
    sqlCall: 'genesisTop16 = "TRUE"',
  },   
   {
    condition: (player) => player.sscTop16 == 'TRUE',
    description: conditionDescriptions[64],
    sqlCall: 'sscTop16 = "TRUE"',
  },    
  {
    condition: (player) => player.bobcppTop16 == 'TRUE',
    description: conditionDescriptions[65],
    sqlCall: 'bobcppTop16 = "TRUE"',
  },   
  {
    condition: (player) => player.kagTop8 == 'TRUE',
    description: conditionDescriptions[66],
    sqlCall: 'kagTop8 = "TRUE"',
  },   
];

async function fetchGrid() {
	const row = [];
	const fullPossibleAnswers = []; 
	const numRandomConditions = 3;
	const numRows = 3;
	const numColumns = 3;
	const usedRowIndices = [];
	const usedColumnIndices = [];
	const randomRowConditions = [];
	const randomColumnConditions = [];
	const axiosPromises = []; 
	const possibleAnswers = Array.from({ length: numRows }, () =>
      Array.from({ length: numColumns }, () => 0)
	);
	const answerKey = Array.from ({ length: numRows }, () => 
	   Array.from({ length: numColumns }, () => 0) 
	); 
	const grid = Array.from({ length: numRows }, () =>
      Array.from({ length: numColumns }, () => 0)
	);
	for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
        let randomRowIndex;
        do {
          randomRowIndex = Math.floor(Math.random() * rowConditions.length);
        } while (usedRowIndices.includes(randomRowIndex));
        usedRowIndices.push(randomRowIndex);
		
		randomRowConditions.push(rowConditions[randomRowIndex]);
		
	}
	for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
		let randomColumnIndex;
		do {
          randomColumnIndex = Math.floor(
            Math.random() * columnConditions.length
          );
        } while (usedColumnIndices.includes(randomColumnIndex));
        usedColumnIndices.push(randomColumnIndex);
		
        randomColumnConditions.push(columnConditions[randomColumnIndex]);		
	}
	
	for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
		for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {

        const searchQuery = generateSearchQuery(
          randomRowConditions[rowIndex],
          randomColumnConditions[columnIndex]
        );
		
		const encodedSearchQuery = encodeURIComponent(searchQuery); 	
      // MAKE SURE TO ADD THE http://localhost:8081 WHEN YOU REGENERATE BOARDS
      axiosPromises.push(
        axios.get(`/api/searchcondition?searchQuery=${encodedSearchQuery}`)
      );
    }
  }

  // Use Promise.all to wait for all Axios requests to complete
  const axiosResponses = await Promise.all(axiosPromises);

  // Now, you can process the responses and populate possibleAnswers
  axiosResponses.forEach((response, index) => {
    const rowIndex = Math.floor(index / numColumns);
    const columnIndex = index % numColumns;
    const matchingPlayers = response.data;

    possibleAnswers[rowIndex][columnIndex] = matchingPlayers.length;
    answerKey[rowIndex][columnIndex] = matchingPlayers;
  }); 
  // Fill grid
  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
	for (let columnIndex = 0; columnIndex < numColumns; columnIndex++) {
		let data = [randomRowConditions[rowIndex], randomColumnConditions[columnIndex]]; 
		grid[rowIndex][columnIndex] = data;
	}
}



  // Resolve the promise with possibleAnswers
  return {
	  grid,
	  randomRowConditions,
	  randomColumnConditions,
	  possibleAnswers,
	  answerKey,
  };
}

 
 db.run(`
  CREATE TABLE IF NOT EXISTS daily_data (
    day INTEGER PRIMARY KEY,
    grid TEXT,
    randomRowConditions TEXT,
    randomColumnConditions TEXT,
    possibleAnswers TEXT,
    answerKey TEXT
  )
`);
 
(async () => {
    let day = 1;
    const maxDays = 200; // Set the maximum number of days

    while (day <= maxDays) {
        console.log('Calling');
        const { grid, randomRowConditions, randomColumnConditions, possibleAnswers, answerKey } = await fetchGrid(); // Wait for the API request to complete
        // Check for softlock

		if (!(
		possibleAnswers[0].includes(0) || possibleAnswers[1].includes(0) || possibleAnswers[2].includes(0) || 
		possibleAnswers[0].includes(1) || possibleAnswers[0].includes(2) || possibleAnswers[1].includes(1) || 
		possibleAnswers[1].includes(2) || possibleAnswers[2].includes(1) || possibleAnswers[2].includes(2) ||
		possibleAnswers[0].includes(3) || possibleAnswers[1].includes(3) || possibleAnswers[2].includes(3) ||
		possibleAnswers[0].includes(4) || possibleAnswers[1].includes[4] || possibleAnswers[2].includes(4) || 
		possibleAnswers[0].includes(5) || possibleAnswers[1].includes[5] || possibleAnswers[2].includes(5)
		
		)) {
            // Insert data into the database here
            db.run(
                'INSERT INTO daily_data (day, grid, randomRowConditions, randomColumnConditions, possibleAnswers, answerKey) VALUES (?, ?, ?, ?, ?, ?)',
                [day, JSON.stringify(grid), JSON.stringify(randomRowConditions, customSerializer), JSON.stringify(randomColumnConditions, customSerializer), JSON.stringify(possibleAnswers), JSON.stringify(answerKey)],
				
				(err) => {
                    if (err) {
                        console.error('Error inserting data into the database.');
                    }
                }
            );

            day++; // Increment day
        } else {
            console.log("Oops! Softlock!");
        }
    }
    console.log("Completed all days");
	console.log
	db.close((error) => {
  if (error) {
    console.error('Error closing the database:', error.message);
  } else {
    console.log('Database closed successfully.');
  }
});
})();



function generateSearchQuery(rowCondition, columnCondition) {
  // Define a template for the SQL query fragment
  const queryFragment = `${rowCondition.sqlCall} AND ${columnCondition.sqlCall}`;

  return queryFragment;
}

function customSerializer(key, value) { 
	if (typeof value === 'function') { 
		return value.toString(); 
	}
	return value; 
}