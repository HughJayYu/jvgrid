<template>
	<div class="welcome-screen" v-if="showWelcome" :class="{ 'zoomed-in': isZoomedIn }"> 
		<div class="content" ref="content">
			<h1>Welcome to the JVGrid!</h1>
			<p> This website is a version of the <a href = "https://www.immaculategrid.com/">Immaculate Grid</a> designed for competitive <i>Super Smash Bros. Ultimate</i>. If you have any insight or bugs to report, please reach out to me at <a href = "https://twitter.com/tradewarhj">Twitter</a> - thank you!
			</p>
			<h2>HOW TO PLAY</h2>
			<p> Select a player for each cell that matches the criteria for that cell's row and column. <br>
			You have nine guesses to fill out the grid. <br> 
			Each guess, correct or incorrect, counts as a guess. <br>
			There is a new grid every day at 9:00am UTC (4:00am CST). <br>
			A player cannot be used twice. <br>
			<strong>The database is manually scraped, and relatively limited.</strong> If you believe I've forgotten a player of note, please submit <a href = "https://forms.gle/uAgGM34LhGcb2mfv7">an audit.</a><br>
			<strong><a href = "https://docs.google.com/spreadsheets/d/1xFEP9ahm6jSNwKLxX7gqvBKKpetd1BiPze1-YzBei_w/edit#gid=0">Database</a> was last updated 2/15</strong> (LumiRank 2023 + Tier List!)
			More information on the categories, along with the full database, can be found <a href = "https://docs.google.com/document/d/1uX4QSPpJR9JHm8RFcN3TX6TSxNoYs1nGJFYd4M-4LzA/edit">here</a>. <br>
			A player can main multiple characters; the search icon is just meant to serve as an identifier (Leon/LeoN).<br>
			Shuton, for example, qualifies as both a Olimar and an Aegis player. <br>
			</p>
			<button @click="closeWelcome">Got it!</button>
		</div>
	</div>
</template>
<script>
export default{
  data () {
    return {
      showWelcome: false,
	  isZoomedIn: false,
    }
  },
  mounted () {
      this.showWelcome = true;
	  this.detectZoom(); 
	  window.addEventListener('resize', this.detectZoom); 
  },
  methods: {
    closeWelcome () {
      this.showWelcome = false;
    }, 
	 detectZoom() { 
		if (window.innerWidth !== document.documentElement.clientWidth) {
			this.isZoomedIn = true; 
		} else { 
			this.isZoomedIn = false; 
		}
	},
  }
  }
</script>

<style scoped>
.welcome-screen {
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
  overflow: hidden; /* Hide content overflow */
}

.content {
  background: #cdc7c6;
  border-radius: 15px;
  padding: 30px;
  max-width: 90%;
  width: 500px;
  box-sizing: border-box;
  text-align: center;
}

.zoomed-in .content {
  max-height: 70vh; /* Set a maximum height to trigger scrolling */
  overflow-y: auto; /* Enable vertical scrolling when content overflows */
  /* Other styles for scrollable content */
}
.content h1 {
  color: #000;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
  font-weight: 500;
}
.content h2 {
  color: #000;
  margin-bottom: 20px;
  font-family: 'Arial', sans-serif;
  font-weight: 600;
}

.content p {
  color: #000;
  margin-bottom: 30px;
  font-family: 'Arial', sans-serif;
  font-weight: 500;
}

.content button {
  background: #4a90e2;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s;
  font-family: 'Arial', sans-serif;
  font-weight: 500;
}

.content button:hover {
  background: #357ac9;
}
@media screen and (max-width: 768px) {
  .content {
    width: 90%; /* Adjust the width for smaller screens */
    padding: 20px; /* Adjust the padding for smaller screens */
    max-width: 100%; /* Allow it to take the full width */
  }
}

</style>