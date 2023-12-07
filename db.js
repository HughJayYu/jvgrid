const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
const filepath = "./testdb.db";
const filepath2 = "./testdb2.db"; 

function connectToDatabase() {
  if (fs.existsSync(filepath)) {
    return [new sqlite3.Database(filepath), new sqlite3.Database(filepath2)]; 
  } else {
	const db = new sqlite3.Database(filepath); 
	const db2 = new sqlite3.Database(filepath2); 
	createTable(db, db2);
	console.log("Connected to databases successfully"); 
	return [db, db2]; 
  }
}
/*
function connectToDatabase2() {
  if (fs.existsSync(filepath2)) {
    return new sqlite3.Database(filepath2);
  } else {
	const db2 = new sqlite3.Database(filepath2, (err) => { 
	 if (err) throw err; 
	createTable2(db2) 
	console.log("Connected to database 2 successfully"); 
	}); 
	return db2; 
  }
}
*/
function createTable(db, db2){
	db.exec(`
	CREATE TABLE players
	(
		player_tag		VARCHAR(40),
		nationality		VARCHAR(20),
		pgru1			BOOL, 
		pgru2			BOOL, 
		ultrank22		BOOL,
		lumirankmid23	BOOL, 
		ssc23place		INT, 
		kag10place		INT,
		genesis9place	INT, 
		bobc5place		INT,
		supermajortop8	BOOL, 
		majortop8		BOOL, 
		btop4			BOOL, 
		winOnLeoAcola	BOOL, 
		evo19place		INT, 
		orionrank22		BOOL, 
		orEclipse		BOOL,
		s4top100		BOOL, 
		majorWinner		BOOL,
		glitchTop16		BOOL,
		genesisTop16	BOOL, 
		sscTop16		BOOL, 
		bobcppTop16		BOOL, 
		kagTop8			BOOL, 
		makesmovesTop16	BOOL, 
		fb20place		INT,
		kag11place		INT,
		pp8place		INT
	)
	`);
	db2.exec(`
	CREATE TABLE mains
	(
		player_tag		VARCHAR(33),
		player_main		VARCHAR(18)
	)
	`);
}

module.exports = connectToDatabase(); 