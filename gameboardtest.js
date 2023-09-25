const sqlite3 = require('sqlite3').verbose();

// Open the database connection
const db = new sqlite3.Database('game_boards.db');

// Define the SQL query to select all rows from the game_boards table
const query = 'SELECT * FROM daily_data';

// Execute the query to retrieve data
db.all(query, [], (err, rows) => {
  if (err) {
    console.error('Error reading data from the database:', err.message);
  } else {
    // Print the retrieved data
    console.log('Retrieved data from daily_data table:');
	console.log(rows[4].randomRowConditions);
	console.log(rows[4].randomColumnConditions);
    rows.forEach((row) => {
      console.log(row.possibleAnswers);
    });
  }

  // Close the database connection
  db.close((error) => {
    if (error) {
      console.error('Error closing the database:', error.message);
    } else {
      console.log('Database closed successfully.');
    }
  });
});
