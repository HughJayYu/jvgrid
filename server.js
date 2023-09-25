const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const sqlite3 = require('sqlite3');
const path = require('path');
const app = express();
const port = 8081;

// Middleware
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS (if needed)

// Open a connection to your SQLite3 database
const db = new sqlite3.Database('testdb.db');
const db2 = new sqlite3.Database('testdb2.db');


const searchRoute = require('./server/searchRoute');
app.use('/api', searchRoute);

// Initialize storedBoardData
let storedBoardData = null;
let boardID = 14;
//BOARD GENERATION COMMENT STARTS HERE

const db3 = new sqlite3.Database('game_boards.db');
db3.get('SELECT * from daily_data WHERE day = 13', [], (err, row) => {
	if (err) { 
		console.error('Error retrieving initial board:', err); 
	} else { 
		console.log("Getting initial board."); 
		storedBoardData = row; 
	}
});
// Schedule a task to retrieve a board
cron.schedule('0 9 * * *', () => {
  console.log("Getting new board.");
  db3.get('SELECT * FROM daily_data WHERE day = ?', [boardID], (err, row) => {
    if (err) {
      console.error('Error retrieving board:', err);
    } else {
      storedBoardData = row;
      console.log(storedBoardData.possibleAnswers);
      boardID = boardID < 200 ? boardID + 1 : 1;
    }
  });
});

// API Routes
app.get('/api/board', (req, res) => {
  res.json(storedBoardData);
});

const gameData = [];

app.post('/api/save-game-data', (req, res) => {
  const { matchingSquaresCount } = req.body;
  console.log("Game data pushed.");
  gameData.push(matchingSquaresCount);
  console.log("Global game number: #" + gameData.length);
  res.sendStatus(200);
});

app.get('/api/global-stats', (req, res) => {
  const frequencyCounts = new Array(10).fill(0);
  gameData.forEach((matchingSquaresCount) => {
    frequencyCounts[matchingSquaresCount]++;
  });
  res.json({ frequencies: frequencyCounts });
});

const rarityData = {};

function calculateRarityScores(rowCondition, columnCondition, player) {
  const conditionKey = `${rowCondition.description}_${columnCondition.description}`;
  rarityData[conditionKey] = rarityData[conditionKey] || {};
  const squareData = rarityData[conditionKey];
  const playerTag = player.player_tag;
  squareData[playerTag] = (squareData[playerTag] || 0) + 1;
  const totalResponses = Object.values(squareData).reduce((total, count) => total + count, 0);
  const playerCount = squareData[playerTag];
  const rarityPercentage = ((playerCount / totalResponses) * 100).toFixed(2);
  return rarityPercentage;
}

app.post('/api/send-rarity-data', (req, res) => {
  const getData = req.body;
  const rowCondition = deserializeRowOrColumnCondition(getData.rowCondition);
  const columnCondition = deserializeRowOrColumnCondition(getData.columnCondition);
  const rarityPercentage = calculateRarityScores(rowCondition, columnCondition, getData.player);
  console.log("Row Condition: " + rowCondition.description + " Column Condition: " + columnCondition.description + " Player Tag: " + getData.player.player_tag + " Percentage: " + rarityPercentage);
  res.json({ rarityPercentage });
});

app.get('/api/rarity-scores', (req, res) => {
  res.json({ rarityData });
});

// Serve Nuxt 3 frontend
app.use(express.static(path.join(__dirname, '.output/client')));

//BOARD GENERATION CLOSE COMMENT GOES HERE
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function deserializeCondition(conditionString) {
  try {
    if (conditionString && typeof conditionString === 'string') {
      return eval(`(${conditionString})`);
    } else {
      console.error('Invalid conditionString:', conditionString);
      return null;
    }
  } catch (error) {
    console.error('Error deserializing condition:', error);
    return null;
  }
}

function deserializeRowOrColumnCondition(conditionObject) {
  if (conditionObject) {
    conditionObject.condition = deserializeCondition(conditionObject.condition);
    return conditionObject;
  } else {
    console.error('Invalid conditionObject:', conditionObject);
    return null;
  }
}
