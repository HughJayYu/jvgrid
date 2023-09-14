// Clear the module cache to ensure fresh imports
Object.keys(require.cache).forEach((key) => {
  delete require.cache[key];
});

const express = require('express');
const serveStatic = require('serve-static');
const cors = require('cors'); // If you need CORS support
const cron = require('node-cron'); 
const sqlite3 = require('sqlite3');
const path = require('path'); // Import the 'path' moduled
const axios = require ('axios'); 
const app = express();
const port = process.env.PORT || 8081; // Use process.env.PORT for flexibility
const apiBaseUrl = process.env.API_BASE_URL || 'http://jvgrid.com/api/';

app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/', serveStatic(path.join(__dirname, 'dist')));


// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS (if needed)

// Open a connection to your SQLite3 database
const db = new sqlite3.Database('testdb.db');
const db2 = new sqlite3.Database('testdb2.db'); 

// Routes
const searchRoute = require('./server/searchRoute');
app.use('/api', searchRoute);

const db3 = new sqlite3.Database('game_boards.db'); 
db3.get('SELECT * from daily_data WHERE day = 1', [], (err, row) => {
	if (err) { 
		console.error('Error retrieving initial board:', err); 
	} else { 
		console.log("Getting initial board."); 
		storedBoardData = row; 
	}
});
boardID = 2;  //for now
console.log("boardID is now " + boardID);
cron.schedule('0 9 * * *', () => {
  // Implement the code to retrieve a board here
  // This code should fetch a single board from your database
  // You can use db.get or any other method you prefer
  console.log("?"); 

  // After fetching the board, you can send it to the client or store it for future use
  db3.get('SELECT * FROM daily_data WHERE day = ?', [boardID], (err, row) => {
     if (err) {
       console.error('Error retrieving board:', err);
     } else {
       // Send the board as a response or store it
	   console.log("Getting new board."); 
       //res.json(row); // Sending as a response
       // Store the board data for future use
       storedBoardData = row;
	   console.log(storedBoardData.possibleAnswers); 
	   if (boardID < 200){
		   boardID = boardID + 1; 
	   } else { 
		   boardID = 1; 
	   }
     }
   });
});
app.get('/api/board', (req, res) => {
  axios.get(`${apiBaseUrl}board`)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error('Error retrieving board:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});
const gameData = []; 


app.post('/api/save-game-data', (req, res) => {
  const { matchingSquaresCount } = req.body;
  axios.post(`${apiBaseUrl}save-game-data`, { matchingSquaresCount })
    .then(() => {
      console.log("Game data pushed.");
      res.sendStatus(200);
    })
    .catch((error) => {
      console.error('Error saving game data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});
app.get('/api/global-stats', (req, res) => {
  axios.get(`${apiBaseUrl}global-stats`)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error('Error retrieving global stats:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});



// Define a function to calculate rarity scores
const rarityData = {};

function calculateRarityScores(rowCondition, columnCondition, player) {
  // Create a unique key for this combination of conditions
  const conditionKey = `${rowCondition.description}_${columnCondition.description}`;

  // Initialize the rarity data for this combination if it doesn't exist
  if (!rarityData[conditionKey]) {
    rarityData[conditionKey] = {};
  }

  const squareData = rarityData[conditionKey];

  const playerTag = player.player_tag;

  // Check if the selected player has already been chosen for this combination
  if (!squareData[playerTag]) {
    squareData[playerTag] = 0;
  }

  // Increment the count for the selected player
  squareData[playerTag] += 1;

  // Calculate the rarity percentage for the selected player under this condition key
  const totalResponses = Object.values(squareData).reduce((total, count) => total + count, 0);
  const playerCount = squareData[playerTag];
  const rarityPercentage = ((playerCount / totalResponses) * 100).toFixed(2);

  // Return the rarity percentage
  return rarityPercentage;
}

app.post('/api/send-rarity-data', (req, res) => {
  const { rowCondition, columnCondition, player } = req.body;
  axios.post(`${apiBaseUrl}send-rarity-data`, { rowCondition, columnCondition, player })
    .then((response) => {
      const rarityPercentage = response.data.rarityPercentage;
      console.log(rarityPercentage);
      res.json({ rarityPercentage });
    })
    .catch((error) => {
      console.error('Error sending rarity data:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});
app.get('/api/rarity-scores', (req, res) => {
  axios.get(`${apiBaseUrl}rarity-scores`)
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error('Error retrieving rarity scores:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


function deserializeCondition(conditionString) {
  try {
    if (conditionString && typeof conditionString === 'string') {
      // Create a new function from the deserialized string
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

// Custom deserializer for the 'rowCondition' or 'columnCondition'
function deserializeRowOrColumnCondition(conditionObject) {
  if (conditionObject) {
    conditionObject.condition = deserializeCondition(conditionObject.condition);
    return conditionObject;
  } else {
    console.error('Invalid conditionObject:', conditionObject);
    return null;
  }
} 
