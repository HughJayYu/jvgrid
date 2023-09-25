<template>
  <div class="game-over-message" v-if="showGameOver" :class="{ 'zoomed-in': isZoomedIn }">
    <div class="content">
      <!-- Move the button inside the content div -->
      <button class="close-button" @click="handleCloseMessage">×</button>
      <h2>Summary - JVGrid #{{ boardID }}</h2>
      <!-- Add your summary content here -->
      <div class="progress-grid">
        <div
          class="progress-box"
          v-for="(row, rowIndex) in 3"
          :key="'row' + rowIndex"
        >
          <div
            class="progress-square"
            v-for="(column, columnIndex) in 3"
            :key="'col' + columnIndex"
            :class="{'filled': progressGrid[rowIndex][columnIndex].player_tag}"
          ></div>
        </div>
      </div>
      <!-- Use flexbox to arrange the button below the grid -->
      <div class="buttons-container">
        <button class="copy-button" @click="copyToClipboard" :class="{ 'copied': isCopied }">{{ copyButtonText }}</button>
        <button class="tweet-button" @click="createTweetDraft"><img src="../static/twitter.svg" alt="Twitter Logo" class="twitter-logo" />Tweet</button>
      </div>
	 <div class = "cumulative-rarity-score">
      <h2> Cumulative Rarity Score: </h2>{{ calculateRarityScore }}
    </div>
	<div class="possible-answers-grid">
	<h2 class="answers-heading">Possible Answers</h2>
      <div class="grid-row" v-for="(row, rowIndex) in possibleAnswers" :key="rowIndex">
        <div class="grid-box" v-for="(count, columnIndex) in row" :key="columnIndex" @click="showPlayerTags(rowIndex, columnIndex)"
		>
          {{ count }}
        </div>
      </div>
    </div>
	<h3> (Click corresponding boxes to see possible answers) </h3>
  <br>
  <h2 class="average-heading">Average Score</h2> 
  <p class="average-score">{{ averageScore }}</p>
  <h2 class="graph-heading">Player Scores</h2>
   <div class="bar-graph">
      <div
        v-for="(count, index) in globalData"
        :key="index"
        class="bar"
        :style="{ height: `${count * 10}px` }"
      >
        {{ index }}
      </div>
    </div>
  </div>
  
  </div>
</template>


<script>
export default {
  name: "GameOver",
  props: {
	conditionsGrid: Array,
	progressGrid: Array, 
	possibleAnswers: Array,
	answerKey: Array, 
	boardID: Number,
  }, 
  data() {
    return {
      showGameOver: true, // Initialize to true if needed
	  isZoomedIn: false,
	  isCopied: false, 
	  totalGuesses: '', 
	  averageGuesses: '',
	  globalData: [], 
	  rarityScore: '',
	  statsFetched: false,
    };
  },
  mounted() { 
	if(!this.statsFetched) { 
		this.fetchGlobalStats(); 
	}
	this.detectZoom(); 
	window.addEventListener('resize', this.detectZoom); 
  },
  computed: { 
	copyButtonText() { 
		return this.isCopied ? "Copied to clipboard!" : "Copy"; 
	},
	averageScore() { 
		if (this.globalData.length == 0) {
			return 0; 
		}
		const totalScore = this.globalData.reduce((acc, value, index) => acc + value * index, 0);
        const totalGamesPlayed = this.globalData.reduce((acc, value) => acc + value, 0);

        return (totalScore/totalGamesPlayed);
    },
	calculateRarityScore() { 
		let cumulativeScore = 0; 
		this.progressGrid.forEach((row) => {
			row.forEach((square) => { 
            if (square && square.isMatching && square.rarityScore) {
              cumulativeScore += parseInt(square.rarityScore);
            } else if (!square.isMatching) { 
			  cumulativeScore += 100; 
			}
		});
	}); 
	this.rarityScore = 900 - cumulativeScore;
	return (900 - cumulativeScore); 
	},
  },
  methods: {
	 detectZoom() { 
		if (window.innerWidth !== document.documentElement.clientWidth) {
			this.isZoomedIn = true; 
		} else { 
			this.isZoomedIn = false; 
		}
	},
    showPlayerTags(rowIndex, columnIndex) {
      // Check if there's a player tag at the clicked square
      if (this.possibleAnswers[rowIndex][columnIndex] > 0) {
        // Retrieve the player tags from the answerKey or another source
        const playerTags = this.answerKey[rowIndex][columnIndex];
		const playerTagValues = playerTags.map(player => player.player_tag);
		const conditions = this.conditionsGrid[rowIndex][columnIndex]; 
		const rowConditions = conditions[0].description; 
		const columnConditions = conditions[1].description;
		console.log(rowConditions); 
		console.log(columnConditions); 
        if (playerTagValues) {
          // Display the player tags or perform any other desired action
          alert(`Row Condition: ${rowConditions}\nColumn Condition: ${columnConditions}\nPlayer Tags:  ${playerTagValues.join(', ')}`);
        }
      }
    },
     async fetchGlobalStats() {
      try {                            //REMOVE LOCALHOST BEFORE SENDING LIVE
        const response = await fetch('/api/global-stats'); // Replace with your actual API endpoint
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        // Process the data as needed, e.g., store it in a component data property
		this.globalData = data.frequencies;
		this.statsFetched = true; 
      } catch (error) {
        console.error('Error fetching global stats:', error);
      }
    }, 
	 answerCounts() { 
      if (!this.statsFetched) {
        this.fetchGlobalStats();
      }
      return this.globalData;
	},
    handleCloseMessage() {
      this.showGameOver = false;
	  this.$emit('close-message'); 
    },  
	redirectToAnswerKeyPage() { 
		const answerKeyURL = this.generateAnswerKeyURL(); 
		if (answerKeyURL) { 
			window.location.href = answerKeyURL; 
		}
	},

	createTweetDraft() {
		const filledSquaresCount = this.getFilledSquaresCount();
		const emojiGrid = this.generateEmojiGrid(filledSquaresCount);
	    const clipboardText = `The JVGrid #${this.boardID} \nScore: ${this.rarityScore}\n${filledSquaresCount}/9\n${emojiGrid}\nPlay at: https://jvgrid.com\n@TMMythra`;
		console.log("Tweet button works"); 
		// Encode the clipboardText for use in a URL
		const encodedClipboardText = encodeURIComponent(clipboardText);

		// Create the Tweet URL
		const tweetUrl = `https://twitter.com/intent/tweet?text=${encodedClipboardText}`;

		// Open a new tab with the Tweet draft
		window.open(tweetUrl, '_blank');
    },
	copyToClipboard() { 
	  // Construct clipboard text
	  console.log("Button working!");
	  const filledSquaresCount = this.getFilledSquaresCount(); 
	  const emojiGrid = this.generateEmojiGrid(filledSquaresCount);
	  const clipboardText = `The JVGrid #${this.boardID} \nScore: ${this.rarityScore}\n${filledSquaresCount}/9\n${emojiGrid}\nPlay at: https://jvgrid.com\n@TMMythra`;
      console.log(clipboardText); 
	  navigator.clipboard.writeText(clipboardText).then(() => {
        this.isCopied = true;
      });
  },
    getFilledSquaresCount() { 
		return this.progressGrid.flat().filter((square) => square.player_tag).length;
	},
	generateEmojiGrid(filledSquaresCount) {
	  // Generate the emoji grid with filled and empty squares
	  const filledSquareEmoji = "🟩";
	  const emptySquareEmoji = "⬜";
	  const emojis = new Array(9).fill(emptySquareEmoji);

	  const filledSquareIndices = this.progressGrid
		.map((row, rowIndex) =>
		  row.map((square, columnIndex) =>
			square.player_tag ? 3 * rowIndex + columnIndex : -1
		  )
		)
		.flat()
		.filter((index) => index !== -1);

	  filledSquareIndices.forEach((index) => {
		emojis[index] = filledSquareEmoji;
	  });

	  // Format the emojis into a 3x3 grid
	  const formattedEmojis = [];
	  for (let i = 0; i < 9; i += 3) {
		formattedEmojis.push(emojis.slice(i, i + 3).join(" "));
	  }

	  return formattedEmojis.join("\n");
	},


},
};
</script>
<style scoped>

.game-over-message {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
}
.zoomed-in .content {
  max-height: 70vh; /* Set a maximum height to trigger scrolling */
  overflow-y: auto; /* Enable vertical scrolling when content overflows */
  /* Other styles for scrollable content */
}
.content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: #cdc7c6;
  border-radius: 15px;
  padding: 30px;
  max-width: 90%;
  width: 500px;
  box-sizing: border-box;
}


/* Style the close button */
.close-button {
  position: absolute;
  top: 5px;
  right: 20px;
  background: none;
  border: none;
  font-size: 48px;
  cursor: pointer;
}

.close-button:hover {
  color: red; /* Change color on hover */
}

.progress-grid {
  display: inline-flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-top: 20px;
}

.progress-box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px; /* Reduce the margin between rows */
}

.progress-square {
  width: 100px;
  height: 100px;
  border: 1px solid #000;
  background-color: white;
  margin-right: 2px; /* Adjust the margin between squares */
  margin-left: 2px;
}
.progress-square.filled {
  background-color: lightgreen;
}


.buttons-container {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px; /* Add a gap between the buttons */
}

.copy-button {
  background-color: blue;
  color: white;
  padding: 10px 20px; /* Adjust padding for button size */
  border: 2px solid black; /* Add a black border */
  cursor: pointer;
  transition: background-color 0.3s ease;
  flex: 1; /* Make the copy button expand to fill available space */
}

.copy-button:hover {
  background-color: darkblue;
}

.copy-button.copied {
  background-color: green;
  cursor: default;
}

.tweet-button {
  background-color: white; 
  color: #1da1f2; /* Twitter blue color for text */
  border: none;
  border-radius: 50px; /* Rounded oval shape */
  padding: 10px 20px; /* Adjust padding for button size */
  cursor: pointer;
  display: flex;
  align-items: center;
}

.twitter-logo {
  width: 24px; /* Adjust logo size as needed */
  margin-right: 10px; /* Space between logo and text */
}


.possible-answers-grid {
  display: inline-flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin-top: 20px;
}

.grid-row {
  display: flex;
  justify-content: space-around; /* Center the boxes horizontally */
  margin-bottom: 5px; /* Add margin to create a line break */
}

.grid-box {
  width: 50px; /* Adjust the width as needed */
  height: 50px; /* Adjust the height as needed */
  border: 2px solid black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  background-color: lightgray;
}

.answers-heading { 
	margin-bottom: 20px; 
}

.bar-graph {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  max-width: 400px; /* Adjust the width as needed */
}

.bar {
  width: 25px;
  background-color: green; /* Adjust the bar color */
  text-align: center;
  font-size: 16px;
  color: black;
  margin-right: 5px;
  transition: height 0.5s; /* Add a smooth transition effect */
}

.cumulative-rarity-score {
  font-size: 24px; /* Adjust the font size to make it larger */
  font-weight: bold; /* Make the text bold */
  margin-top: 20px; /* Add some top margin to separate it from other content */
  color: #333; /* Text color */
}
@media screen and (max-width: 768px) {
  .content {
    width: 90%; /* Adjust the width for smaller screens */
    padding: 20px; /* Adjust the padding for smaller screens */
    max-width: 100%; /* Allow it to take the full width */
  }
}
.average-heading {
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
  color: #333;
}

.average-score {
  font-size: 18px;
  color: #333;
}
</style>