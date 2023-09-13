
<template>
  <div>
    <!-- Add an overlay to dim the background when the dialog is shown -->
    <div class="search-dialog-overlay" v-if="showSearchDialog">
      <search-dialog @result-selected="handleResultSelected" :rowIndex="clickedRowIndex" :columnIndex="clickedColumnIndex" @close-dialog="closeSearchDialog" />
    </div>
    <div class="game-container">
      <div class="grid-container" v-if="conditionsLoaded">
        <!-- Display column titles above each column -->
        <div class="grid">
          <div class="grid-row">
		  <div class = "column-labels">
            <div class="grid-column" v-for="(column, columnIndex) in grid" :key="columnIndex">
              <div class="column-condition">
                {{ randomColumnConditions[columnIndex].description }}
              </div>
            </div>
			</div>
          </div>
        </div>

        <div class="grid">
          <div class="grid-row" v-for="(row, rowIndex) in grid" :key="rowIndex">
            <div class="row-condition">{{ randomRowConditions[rowIndex].description }}</div>
            <div
              class="grid-box"
              v-for="(square, columnIndex) in row"
              :key="columnIndex"
              @click="openSearchDialog(rowIndex, columnIndex)"
              @mouseenter="darkenGridBox(rowIndex, columnIndex)"
              @mouseleave="undarkenGridBox(rowIndex, columnIndex)"
            >
              <div
                :class="['grid-box', grid[rowIndex][columnIndex].isMatching ? 'matched' : '', grid[rowIndex][columnIndex].darkened ? 'darkened' : '']"
              >
                {{ grid[rowIndex][columnIndex] ? grid[rowIndex][columnIndex].player_tag : '' }}
				<span class="rarity-score" v-if="square.isMatching">
				  {{ grid[rowIndex][columnIndex].rarityScore }}%
				</span>
              </div>
            </div>
          </div>
        </div>
      </div>
	<div class="guesses-left-container">
	  <p>Guesses Left: <span class="guesses-number" :class="transitionClass">{{ guessesLeft }}</span></p>
      <button
        class="give-up-button"
        @click="handleGiveUp"
      >
        {{ guessesLeft === 0 ? 'Show Summary' : 'Give Up' }}
      </button>
    </div>	
    </div>
	<game-over v-if="showGameOver" :progressGrid = "grid" :possibleAnswers = "possibleAnswers" :answerKey = "answerKey" :boardID = "boardID" @close-message="handleCloseMessage" />
  </div>
</template>


<script>

import SearchDialog from '/components/search-dialog.vue'; 
import GameOver from '/components/game-over.vue'; 
import { initializeGridWithConditions } from '../boardgeneration.js'; 
import { arcadeCharacters, nesCharacters, snesCharacters, gameboyCharacters, n64Characters, gameCubeCharacters, wiiWiiUSwitchCharacters, fightersPass2Characters, jrpgCharacters, superHeavies, europeanNations, cenamNations, oceaniaNations } from '../categories.js';
export default {
  components: {
    SearchDialog,
	GameOver, 
  },
  data() {
    return {
      selectedValue: '', // Initialize as needed
      grid: [
        // Initialize the grid with square objects that include isMatching
        // For example, initialize a 3x3 grid with isMatching set to false for each square
        [{ player_tag: null, isMatching: false }, { player_tag: null, isMatching: false }, { player_tag: null, isMatching: false }],
        [{ player_tag: null, isMatching: false }, { player_tag: null, isMatching: false }, { player_tag: null, isMatching: false }],
        [{ player_tag: null, isMatching: false }, { player_tag: null, isMatching: false }, { player_tag: null, isMatching: false }],
      ], // Initialize an empty array
      conditionsLoaded: false, // Add a loading flag
	  cookiesLoaded: false,
      randomRowConditions: [], // Store randomly chosen rowConditions
      randomColumnConditions: [], // Store randomly chosen columnConditions
      rowConditions: [], 
      columnConditions: [],
	  showSearchDialog: false, 
	  clickedRowIndex: '', 
	  clickedColumnIndex: '',
	  selectedCell: {
		rowIndex: -1,
		columnIndex: -1,
	  },
	  guessesLeft: 9,
	  selectedPlayers: [],
	  wrongGuess: false, 
	  transitionClass: '', 
	  showGameOver: false,
	  possibleAnswers: [], 
	  answerKey: [], 
	  boardData: null,
	  boardID: '',
	  oldBoardID: '',
	  completedState: false,
    };
  }, 
  watch: { 
	guessesLeft(newGuessesLeft) { 
		const isGridFull = this.grid.every((row) => row.every((cell) => cell.isMatching)); 
		if (newGuessesLeft === 0) { 
			const tempGuessesLeft = this.guessesLeft
			const matchingSquaresCount = this.grid.flat().filter(square => square.isMatching).length;
			if (!isGridFull && !this.completedState) { 
				console.log("Working as intended."); 
				fetch('http://localhost:8000/api/save-game-data', {
				  method: 'POST',
				  headers: {
					'Content-Type': 'application/json',
				  },
				  body: JSON.stringify({ matchingSquaresCount}),
				})
				  .then(response => {
					if (response.ok) {
					  console.log('Game data saved successfully.');
					  this.completedState = true; 
					  localStorage.setItem('completedState', this.completedState); 
					} else {
					  console.error('Error saving game data:', response.status);
					}
				  })
				  .catch(error => {
					console.error('Network error:', error);
				  });				
				this.showGameOver = true; 

			}
			this.showGameOver = true; 	
		}
	}
  },
  mounted() {
	  // Check if guessesLeft is stored in localStorage
    // Make an HTTP GET request to fetch the board data
    fetch('http://localhost:8000/api/board')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {

        // Handle the received board data
        this.boardID = JSON.parse(data.day);
		this.grid = JSON.parse(data.grid);
		this.randomRowConditions = JSON.parse(data.randomRowConditions, this.customDeserializer);
		this.randomColumnConditions = JSON.parse(data.randomColumnConditions, this.customDeserializer); 
		this.possibleAnswers = JSON.parse(data.possibleAnswers); 
		this.answerKey = JSON.parse(data.answerKey); 
		console.log(this.possibleAnswers);
		console.log(this.answerKey); 
		const savedGuessesLeft = localStorage.getItem('guessesLeft');
		const gridProgress = localStorage.getItem('grid'); 
		const chosenPlayers = localStorage.getItem('selectedPlayers'); 
		const lastBoard = localStorage.getItem('boardID');
		const alreadyDone = localStorage.getItem('completedState'); 
		// If it exists, set it in the component's data
		if (savedGuessesLeft !== null && parseInt(lastBoard) === this.boardID) {
			this.guessesLeft = parseInt(savedGuessesLeft);
			this.grid = JSON.parse(gridProgress); 
			this.selectedPlayers = JSON.parse(chosenPlayers); 
			this.completedState = alreadyDone; 
		} else { 
			localStorage.setItem('guessesLeft', this.guessesLeft); 
			localStorage.setItem('grid', JSON.stringify(this.grid));
			localStorage.setItem('selectedPlayers', JSON.stringify(this.selectedPlayers)); 
			localStorage.setItem('boardID', this.boardID); 
			localStorage.setItem('completedState', this.completedState); 
		}
		this.conditionsLoaded = true; 
      })
      .catch((error) => {
        console.error('Error fetching board data:', error);
      });
  },
  methods: {
  customSerializer(key, value) {
    if (typeof value === 'function') {
      // Serialize functions by converting them to a string
      return `(${value.toString()})`;
    }
    return value;
  },
  customDeserializer(key, value) { 
 
	if (typeof value === 'string' && value.startsWith('(player)')) {
		return eval(`(${value})`);
	}
	return value;
  },
  handleCloseMessage() { 
	this.showGameOver = false; 
  }, 
  handleGiveUp() { 
	const isGridFull = this.grid.every((row) => row.every((cell) => cell.isMatching)); 
	if(this.guessesLeft > 0 && !isGridFull) { 
		this.guessesLeft = 0; 
		localStorage.setItem('guessesLeft', this.guessesLeft); 
	}
	if(this.guessesLeft == 0 || isGridFull) { 
		this.showGameOver = !this.showGameOver; 
	}
  },
  darkenGridBox (rowIndex, columnIndex) { 
		if (!this.grid[rowIndex][columnIndex].player_tag && this.guessesLeft > 0){
			this.grid[rowIndex][columnIndex].darkened = true; 
		}
	}, 
  undarkenGridBox(rowIndex, columnIndex) { 
		if (!this.grid[rowIndex][columnIndex].player_tag && this.guessesLeft > 0){
			this.grid[rowIndex][columnIndex].darkened = false; 
		}
	},
  openSearchDialog(rowIndex, columnIndex) { 
	if (!this.grid[rowIndex][columnIndex].player_tag && this.guessesLeft > 0) { 
		this.clickedRowIndex = rowIndex; 
		this.clickedColumnIndex = columnIndex; 
		this.showSearchDialog = true; 
		}
	}, 
  closeSearchDialog() { 
		this.showSearchDialog = false; 
	}, 
  handleResultSelected(value) {
    this.selectedCell = { rowIndex: this.clickedRowIndex, columnIndex: this.clickedColumnIndex };
    // Use player object properties for conditions
    const selectedPlayer = this.selectedPlayers.find((player) => player.player_tag === value.player_tag);
    if (selectedPlayer) { 
      return; 
    }
    this.guessesLeft--; 
    const player = {
      player_tag: value.player_tag,
      nationality: value.nationality,
      pgru1: value.pgru1,
      pgru2: value.pgru2,
      ultrank22: value.ultrank22,
      lumirankmid23: value.lumirankmid23,
      ssc23place: value.ssc23place,
      kag10place: value.kag10place,
      genesis9place: value.genesis9place,
      bobc5place: value.bobc5place,
      player_mains: value.player_mains,
      supermajortop8: value.supermajortop8,
      majortop8: value.majortop8,
	  btop4: value.btop4, 
	  winOnLeoAcola: value.winOnLeoAcola, 
	  evo19place: value.evo19place,
	  orionrank22: value.orionrank22, 
	  s4top100: value.s4top100, 
	  majorWinner: value.majorWinner,
    };
  
    // Check if both row and column conditions are met
    const rowConditionMet = this.randomRowConditions[this.selectedCell.rowIndex].condition(player);
    const columnConditionMet = this.randomColumnConditions[this.selectedCell.columnIndex].condition(player);
    if (rowConditionMet && columnConditionMet) {
      // Update the grid cell with the player's tag
      const rarityData = { 
        player, 
        rowCondition: this.randomRowConditions[this.selectedCell.rowIndex], 
        columnCondition: this.randomColumnConditions[this.selectedCell.columnIndex],
      };
      this.grid[this.clickedRowIndex][this.clickedColumnIndex] = player;
      this.grid[this.clickedRowIndex][this.clickedColumnIndex].isMatching = true;
      this.selectedPlayers.push(player); 
  
      const isGridFull = this.grid.every((row) => row.every((cell) => cell.isMatching)); 
      const matchingSquaresCount = this.grid.flat().filter(square => square.isMatching).length;
      const serializedRarityData = JSON.stringify(rarityData, this.customSerializer);
  
      // Make an API call to get the rarity score for the updated square
      fetch('http://localhost:8000/api/send-rarity-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: serializedRarityData,
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        // Return the response as JSON
        return response.json();
      })
      .then((rarityDataResponse) => {
        // Update the rarity score for the specific square in the grid
        this.grid[this.clickedRowIndex][this.clickedColumnIndex].rarityScore = rarityDataResponse.rarityPercentage;
		
		localStorage.setItem('grid', JSON.stringify(this.grid)); 
      })
      .catch((error) => {
        console.error('Error sending or retrieving rarity data:', error);
        // Handle errors, such as displaying an error message
      });
  
      if (isGridFull) {
        fetch('http://localhost:8000/api/save-game-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ matchingSquaresCount}),
        })
        .then(response => {
          if (response.ok) {
            console.log('Game data saved successfully.');
            this.completedState = true; 
            localStorage.setItem('completedState', this.completedState); 
          } else {
            console.error('Error saving game data:', response.status);
          }
        })
        .catch(error => {
          console.error('Network error:', error);
        });                
        this.showGameOver = true; 
      }
    } else { 
      this.wrongGuess= true; 
      this.transitionClass = 'red'; 
      setTimeout(() => {
        this.wrongGuess = false; 
        this.transitionClass = '';
      }, 1500); 
    } 
    localStorage.setItem('guessesLeft', this.guessesLeft); 
    localStorage.setItem('grid', JSON.stringify(this.grid)); 
    localStorage.setItem('selectedPlayers', JSON.stringify(this.selectedPlayers)); 
    localStorage.setItem('boardID', this.boardID); 
    this.showSearchDialog = false;
  },
},
};

 /*
  created() {
    (async () => {
      try {
        // Initialize the grid with conditions from the imported function
        const { grid, randomRowConditions, randomColumnConditions, possibleAnswers, answerKey } = initializeGridWithConditions();
		this.grid = grid; 
		this.randomRowConditions = randomRowConditions; 
		this.randomColumnConditions = randomColumnConditions;
		this.possibleAnswers = possibleAnswers; 
		this.answerKey = answerKey; 
        console.log(possibleAnswers); 
		console.log(answerKey); 

        this.conditionsLoaded = true;
      } catch (error) {
        console.error('Error loading grid:', error);
      }
    })();
  },
 */
</script>


<style scoped>
/* Style the grid container as a square */
/* Add these styles to position the game board and guesses left counter */
.game-container {
  display: grid;
  grid-template-columns: auto 1fr; /* Create two columns, one for guesses and one for the grid */
  gap: 20px; /* Add some gap between the columns */
  align-items: center; /* Vertically center the items */
}

.guesses-left-container {
  font-size: 24px;
}

.grid-container {
  display: flex;
  flex-direction: column; /* Display columns as a column */
  align-items: center; /* Center elements horizontally */
  gap: 10px;
  margin-top: 50px; /* Increase the top margin to make room for the counter */
  width: 100%; /* Occupy the full width */
}
.guesses-number {
  font-weight: bold;
  margin-left: 5px;
  color: black; /* Default color */
  transition: color 1.5s ease; /* Define the transition */
}
.guesses-number.red {
  color: red;
}
.column-labels {
  display: flex;
  margin-left: 200px; /* Adjust the margin to push all labels to the left */
}



/* Style the row conditions with a flexible width */
.row-condition {
  width: 100%; /* Allow text to take the available width */
  max-width: 190px; /* Limit the maximum width */
  white-space: normal; /* Allow text to wrap */
  overflow: hidden;
  text-overflow: ellipsis; /* Add ellipsis for long text */
  padding-right: 3px; /* Add horizontal padding for better readability */
}
.grid-column {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center; /* Center text horizontally */
  white-space: normal; /* Allow text to wrap */
  overflow: hidden; /* Hide overflow content */
  margin-left: 3%;
  max-width: 210px; /* Limit the maximum width to 200px */
}

.column-condition {
  text-overflow: ellipsis; /* Add ellipsis for long text */
  white-space: normal; /* Allow text to wrap */
  text-align: center;
  margin-top: 100px; /* Adjust the margin to align the text above the column */
}

/* Style each grid box with flexible width */
.grid-box {
  position: relative;
  width: 200px;
  height: 200px;
  border: 2px solid black;
  background-color: lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  white-space: normal; /* Allow text to wrap */
  text-align: center;
}
.grid-square {
  width: 200px;
  height: 200px;
  border: 0px;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  white-space: normal; /* Allow text to wrap */
  text-align: center;
}

/* Style each row */
.grid-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  width: 100%;
}

/* Add this to your existing styles or create a new style section */
.search-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Dim the background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Ensure it's above other content */
}

.search-dialog {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  width: 400px; /* Adjust the width as needed */
}

.search-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Dim the background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Ensure it's above other content */
}
.matched {
  color: white;
  background-color: green;
}
.grid-box.darkened {
  background-color: rgba(0, 0, 0, 0.5); /* Use your preferred darkened color */
  transition: background-color 0.3s ease; /* Add a smooth transition effect */
}
.give-up-button {
  background-color: blue; /* Blue background color */
  color: white; /* White text color */
  padding: 10px 20px; /* Add padding for button size */
  border: none; /* Remove button border */
  cursor: pointer; /* Add pointer cursor on hover */
}

.give-up-button:hover {
  background-color: darkblue; /* Darken the button when hovered */
}
.rarity-score {
  position: absolute;
  top: 5px; /* Adjust this value to change the vertical position */
  right: 5px; /* Adjust this value to change the horizontal position */
  background-color: rgba(0, 0, 0, 0.5); /* Optional: Add background color for readability */
  color: white; /* Optional: Text color for readability */
  padding: 5px; /* Optional: Padding for readability */
  border-radius: 5px; /* Optional: Rounded corners for aesthetics */
}
</style>


