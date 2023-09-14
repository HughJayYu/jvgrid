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


app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/', serveStatic(path.join(__dirname, '.output')));


// Middleware
1
// Middleware to handle API routes
app.use((req, res, next) => {
  // Check if the request URL starts with "/api/"
  if (req.url.startsWith('/api/')) {
    // Request is for the API, continue to API routes
    next();
  } else {
    // Request is for the front-end, serve the HTML file
    res.sendFile(path.join(__dirname, '.output', 'index.html'));
  }
});
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
  // Calculate frequencies of guessesLeft values (0-9)
  const frequencyCounts = new Array(10).fill(0);

  gameData.forEach((matchingSquaresCount) => {
    frequencyCounts[matchingSquaresCount]++;
  });
  res.json({ frequencies: frequencyCounts });
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
  // Retrieve the rarity data from the request body
  const getData = req.body;
  // Calculate rarity scores for the specific conditions
  const rowCondition = deserializeRowOrColumnCondition(getData.rowCondition);
  const columnCondition = deserializeRowOrColumnCondition(getData.columnCondition);
  const rarityPercentage = calculateRarityScores(rowCondition, columnCondition, getData.player);
  console.log(rarityPercentage); 
  // Respond with the rarity percentage in the JSON response
  res.json({ rarityPercentage });
});

app.get('/api/rarity-scores', (req, res) => {

  // Send the rarity scores as a JSON response
  res.json({ rarityData });
  
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
