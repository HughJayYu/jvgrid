

const sqlite3 = require('sqlite3').verbose();

// Replace 'your-database-file.db' with the actual path to your SQLite database file
const dbPath = 'game_boards.db';

// Replace 'your-table-name' with the name of the table where you want to perform the replacement
const tableName = 'daily_data';

// Connect to the SQLite database
const db = new sqlite3.Database(dbPath);

// Replace occurrences of "R.O.B." with "R.O.B"
db.serialize(() => {
	    db.get("select name from sqlite_master where type='table'", function (err, table) {
        console.log(table);
    });
  db.run(`UPDATE ${tableName} SET randomColumnConditions = REPLACE(randomColumnConditions, 'R.O.B.', 'R.O.B')`, (err) => {
    if (err) {
      console.error('Error updating data:', err.message);
    } else {
      console.log('Replacements completed successfully.');
    }

    // Close the database connection
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database closed.');
      }
    });
  });
});