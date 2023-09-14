const sqlite3 = require('sqlite3').verbose(); 
const intro = "a"; 
var test = intro.concat("%");
console.log(test);
let db = new sqlite3.Database('./testdb.db', (err) => {
	if (err) {
    console.error(err.message);
  }
  console.log('Connected to the player database.');
});

let db2 = new sqlite3.Database('./testdb2.db', (err) => {
	if (err) throw err; 
	console.log('Connected to the mains database.'); 
}); 
	console.log("Select United States players at Super Smash Con 2023");

db.serialize(() => {
  db.each(`SELECT player_tag as tag,
                  supermajortop8 as smt8
           FROM players`, (err, row) => {
    if (err) throw err;
    console.log(row.tag + "\t" + row.smt8);
  });
});


db.serialize(() => {
  db.each(`SELECT * FROM players WHERE player_tag LIKE ?`, test, function (err, row) {
	  if (err) throw err; 
	  console.log(row.player_tag + "\t" + row.ssc23place); 
  }); 
});

/*
db2.serialize(() => {
	db2.each(`SELECT player_tag as tag, player_main as main FROM mains`, function (err, row) { 
	if (err) throw err; 
	console.log(row.tag + "\t" + row.main); 
	}); 
}); 
*/
/*
db2.serialize(() => {
	console.log("Select Steve and Kazuya players in database"); 
	db2.each(`SELECT player_tag as tag, player_main as main FROM mains WHERE (player_main = "Steve") OR (player_main = "Kazuya")`, function (err, row) { 
	if (err) throw err; 
	console.log(row.tag + "\t" + row.main); 
	}); 
}); 
*/

db2.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the mains database connection.');
});
db.close((err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Close the player database connection.');
});