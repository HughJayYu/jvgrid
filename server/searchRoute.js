const express = require('express');
const sqlite3 = require('sqlite3');

const router = express.Router();

// Route: GET /api/search
router.get('/search', (req, res) => {
  const searchQuery = req.query.query;

  // Open connections to your SQLite3 databases
  const db = new sqlite3.Database('testdb.db');
  const db2 = new sqlite3.Database('testdb2.db');

  // Define your SQL query for fetching players
  const queryPlayers = `
    SELECT *
    FROM players
    WHERE player_tag LIKE ?
  `;

  // Define your SQL query for fetching mains
  const queryMains = `
    SELECT player_tag, player_main
    FROM mains
    WHERE player_tag LIKE ?
  `;

  const searchParam = `${searchQuery}%`;

  let playersData = [];
  let mainsData = [];

  // Execute the queries for players and mains
  db.all(queryPlayers, [searchParam], (err, playerRows) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }

    playersData = playerRows;

    db2.all(queryMains, [searchParam], (err, mainRows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      mainsData = mainRows;

      // Combine players and mains data
      const result = playersData.map((player) => {
        const mainsForPlayer = mainsData
          .filter((main) => main.player_tag === player.player_tag)
          .map((main) => main.player_main);

        return {
          player_tag: player.player_tag,
          player_mains: mainsForPlayer, 
		  nationality: player.nationality, 
		  pgru1: player.pgru1, 
		  pgru2: player.pgru2, 
		  ultrank22: player.ultrank22, 
		  lumirankmid23: player.lumirankmid23, 
		  ssc23place: player.ssc23place, 
		  kag10place: player.kag10place, 
		  genesis9place: player.genesis9place, 
		  bobc5place: player.bobc5place,
		  supermajortop8: player.supermajortop8, 
		  majortop8: player.majortop8,
		  btop4: player.btop4, 
		  winOnLeoAcola: player.winOnLeoAcola, 
		  evo19place: player.evo19place,
		  orionrank22: player.orionrank22, 
		  s4top100: player.s4top100, 
		  majorWinner: player.majorWinner,
        };
      });

      res.json(result);

      // Close the database connections
      db.close();
      db2.close();
    });
  });
});
// Route: GET /api/searchcondition
router.get('/searchcondition', (req, res) => {
  const searchQuery = req.query.searchQuery;
  const categories = ['nationality', 'pgru1', 'pgru2', 'ultrank22', 'lumirankmid23', 'ssc23place', 'kag10place', 'genesis9place', 'bobc5place', 'supermajortop8', 'majortop8', 'btop4', 'winOnLeoAcola', 'evo19place', 'orionrank22', 's4top100', 'majorWinner'];
  // Open connections to your SQLite3 databases
  const db = new sqlite3.Database('testdb.db');
  db.serialize(() => { 
    db.run('ATTACH DATABASE "testdb2.db" as db2'); 
// Generate the SELECT clause dynamically
	const selectColumns = categories.map((category) => `players.${category}`).join(' , ');

// Generate the GROUP BY clause dynamically
	const groupByColumns = ['players.player_tag'].concat(categories.map((category) => `players.${category}`)).join(' , ');
	
	const query = `
		SELECT 
			players.player_tag,
			GROUP_CONCAT(db2.mains.player_main) AS player_main,
			${selectColumns}
		FROM players
		INNER JOIN db2.mains ON players.player_tag = db2.mains.player_tag
		WHERE ${searchQuery}
		GROUP BY ${groupByColumns};
	`;

    let playersData = [];

    // Execute the query for players
    db.all(query, [], (err, playerRows) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      playersData = playerRows;
      const result = playersData.map((player) => {
        return {
          player_tag: player.player_tag,
          player_main: player.player_main,
          nationality: player.nationality,
          pgru1: player.pgru1,
          pgru2: player.pgru2,
          ultrank22: player.ultrank22,
          lumirankmid23: player.lumirankmid23,
          ssc23place: player.ssc23place,
          kag10place: player.kag10place,
          genesis9place: player.genesis9place,
          bobc5place: player.bobc5place,
		  supermajortop8: player.supermajortop8, 
		  majortop8: player.majortop8,
		  btop4: player.btop4, 
		  winOnLeoAcola: player.winOnLeoAcola, 
		  evo19place: player.evo19place,
		  orionrank22: player.orionrank22, 
		  s4top100: player.s4top100, 
		  majorWinner: player.majorWinner,
        };
      });

      res.json(result);

      // Close the database connections
      db.close();
    });
  });
});

module.exports = router;


