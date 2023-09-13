import { rowConditions, columnConditions } from '/conditions.js';
import axios from 'axios'; 

export function initializeGridWithConditions() {
  const numRandomConditions = 3;
  const maxAttempts = 100; 
  const numRows = 3;
  const numColumns = 3;
  const usedRowIndices = [];
  const usedColumnIndices = [];
	
  
  const randomRowConditions = [];
  const randomColumnConditions = [];
  const possibleAnswers = Array.from({ length: numRows }, () =>
      Array.from({ length: numColumns }, () => 0)
   );
   const answerKey = Array.from ({ length: numRows }, () => 
	   Array.from({ length: numColumns }, () => 0) 
	); 
 const grid = Array.from({ length: numRows }, () =>
      Array.from({ length: numColumns }, () => 0)
   );

  try {
    // Create an empty 3x3 array to store possible answers count
	const row = [];
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
		//

        const searchQuery = generateSearchQuery(
          randomRowConditions[rowIndex],
          randomColumnConditions[columnIndex]
        );
		
		const encodedSearchQuery = encodeURIComponent(searchQuery); 	
		axios.get(`http://localhost:8000/api/searchcondition?searchQuery=${encodedSearchQuery}`)
		  .then((response) => {
			// Extract the list of matching players from the response data
			const matchingPlayers = response.data;
			// Now, you have the list of players that match the searchQuery
			// You can perform operations on matchingPlayers or add them to a list as needed
			possibleAnswers[rowIndex][columnIndex] = matchingPlayers.length; 
			answerKey[rowIndex][columnIndex] = matchingPlayers; 
		  })
		  .catch((error) => {
			console.error('Error fetching player data:', error);
			// Handle errors as needed
		  });	
		  row.push([randomRowConditions[rowIndex], randomColumnConditions[columnIndex]]);
		  grid[rowIndex][columnIndex] = row[row.length-1]; 
		}
	} 
    // Return an object containing both grid and conditions
    return {
      grid,
      randomRowConditions,
      randomColumnConditions,
	  possibleAnswers,
	  answerKey,
    };
  } catch (error) {
    console.error('Error:', error);
    // Handle the error as needed (e.g., return null or an error object)
    return {
      grid: null,
      randomRowConditions: null,
      randomColumnConditions: null,
	  possibleAnswers: null,
	  answerKey: null, 
    };
  }
}
// Function to generate the search query based on conditions
function generateSearchQuery(rowCondition, columnCondition) {
  // Define a template for the SQL query fragment
  const queryFragment = `${rowCondition.sqlCall} AND ${columnCondition.sqlCall}`;

  return queryFragment;
}
