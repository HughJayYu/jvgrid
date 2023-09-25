<template>
	<div class="container">
	<h2 class = "title">THE JVGRID</h2> 
	<div class="social-icons">
		<a href="https://twitter.com/tradewarhj"> 
			<img src="../static/twitter.svg" alt="Twitter logo" />
		</a> 
		<a href="https://patreon.com/tuesdaymorningmythra">
			<img src="../static/patreon.svg" alt="Patreon logo" />
		</a>
		<a href="https://youtube.com/@nutradewar">
			<img src="../static/youtube.svg" alt="YouTube logo" />
		</a> 
        <a :href="easterEggLink">
           <img :src="easterEggIcon" alt="Mario icon" />
		</a>
		<a href = "https://docs.google.com/document/d/1uX4QSPpJR9JHm8RFcN3TX6TSxNoYs1nGJFYd4M-4LzA/edit?usp=sharing">
			<img src="../static/help.svg" alt="Help icon" />
		</a>
	</div>
	</div>
</template>

<style scoped>

    @media screen and (max-width: 768px) {
        .title {
            font-size: 1rem !important;
            width: 50% !important;
            text-align: center !important;
        }

        .social-icons {
            flex-direction: column !important;
        }

        .social-icons a {
            margin-right: 0% !important;
            margin-bottom: 20% !important;
        }
    }
    .container {
        display: flex;
        width: 100%;
    }

    .title {
        font-family: 'Roboto', sans-serif;
        font-weight: 700;
        color: black;
        margin: 0px;
        margin-top: 0.7%;
    }

    .social-icons {
        display: flex;
        align-items: top;
        justify-content: flex-end;
        margin-left: auto;
        margin-top: 0.7%;
    }

    .social-icons a {
        margin-right: 40%; /* Add space between icons */
    }

    .social-icons img {
        width: 30px; /* Adjust to your preference */
        height: 30px; /* Adjust to your preference */
    }
	
@media screen and (max-width: 768px) {
  .content {
    width: 90%; /* Adjust the width for smaller screens */
    padding: 20px; /* Adjust the padding for smaller screens */
    max-width: 100%; /* Allow it to take the full width */
  }
}
</style>

<script>
export default {
  name: 'top-menu',
  data() { 
	return { 
		easterEggs: ['easterEgg1', 'easterEgg2', 'easterEgg3', 'easterEgg4', 'easterEgg5', 
		'easterEgg6', 'easterEgg7'],
		easterEggTriggered: false,
		easterEggIcon: '/stockicons/mario.svg', 
		easterEggLink: 'https://www.youtube.com/watch?v=VTo_SjsrKRc', 
    };
  },
  mounted() {
    window.addEventListener('localStorageChange', this.handleLocalStorageChange);

    // Initial check when the component is mounted
    this.checkEasterEggConditions();
  },
  beforeDestroy() {
    window.removeEventListener('localStorageChange', this.handleLocalStorageChange);
  },
  methods: {
    handleLocalStorageChange() {
      // Respond to the localStorage change event
      this.checkEasterEggConditions();
    },
	checkEasterEggConditions() { 
		if (this.easterEggTriggered || !localStorage.getItem('selectedPlayers')) { 
			return false;
		}
		const selectedPlayers = JSON.parse(localStorage.getItem('selectedPlayers')); 
	for (const egg of this.easterEggs) {
      if (
        (egg === 'easterEgg1' && 
          selectedPlayers.some(player => player.player_tag === 'Samuel') &&
          selectedPlayers.some(player => player.player_tag === 'Big D') &&
          selectedPlayers.some(player => player.player_tag === 'Felix')
        ) ||
        (egg === 'easterEgg2' && 
          selectedPlayers.some(player => player.player_tag === 'Sejun') &&
          selectedPlayers.some(player => player.player_tag === 'SoulSur')
        ) ||
        (egg === 'easterEgg3' && 
          selectedPlayers.some(player => player.player_tag === 'jaredisking1') &&
          selectedPlayers.some(player => player.player_tag === 'Sisqui')
        ) ||
        (egg === 'easterEgg4' && 
          selectedPlayers.some(player => player.player_tag === 'Niko4') &&
          selectedPlayers.some(player => player.player_tag === 'rm8')
        ) || 
		(egg === 'easterEgg5' && 
		  selectedPlayers.some(player => player.player_tag === 'Hungrybox') && 
		  selectedPlayers.some(player => player.player_tag === 'Mang0') && 
		  selectedPlayers.some(player => player.player_tag === 'Leffen')
		) ||
		(egg === 'easterEgg6' && 
		  selectedPlayers.some(player => player.player_tag === 'kept') && 
		  selectedPlayers.some(player => player.player_tag === 'Jakal')
		) ||
		(egg === 'easterEgg7' && 
		  selectedPlayers.some(player => player.player_tag === 'Cody Schwab') &&
		  selectedPlayers.some(player => player.player_tag === 'aMSa') && 
		  selectedPlayers.some(player => player.player_tag === 'Zain') && 
		  selectedPlayers.some(player => player.player_tag === 'Salt') && 
		  selectedPlayers.some(player => player.player_tag === 'Skyjay')
		)
      ) {
        // Trigger the easter egg
        this.easterEggTriggered = egg;
        if (egg === 'easterEgg1') {
          this.easterEggIcon = '/stockicons/captain%20falcon.svg';
          this.easterEggLink = 'https://www.youtube.com/watch?v=7_gYO0Kl_AI';
        } else if (egg === 'easterEgg2') {
          this.easterEggIcon = '/pachirisu.png';
          this.easterEggLink = 'https://www.youtube.com/watch?v=lVTTexWAh9k';
        } else if (egg === 'easterEgg3') { 
		  this.easterEggIcon = '/stockicons/dark%20samus.svg'; 
		  this.easterEggLink = 'https://www.youtube.com/watch?v=bZXhQ6HqXHM'; 
		} else if (egg === 'easterEgg5') { 
		  this.easterEggIcon = '/stockicons/jigglypuff.svg'; 
		  this.easterEggLink = 'https://www.youtube.com/watch?v=0Or-x1ol9CY'; 
		} else if (egg === 'easterEgg4') { 
		  this.easterEggIcon = '/stockicons/kazuya.svg'; 
		  this.easterEggLink = 'https://www.youtube.com/watch?v=xddLRuO1mqQ'; 
		} else if (egg === 'easterEgg6') { 
		  this.easterEggIcon = '/stockicons/villager.svg'; 
		  this.easterEggLink = 'https://medium.com/@anonymous-badger/world-war-kept-finding-solace-in-the-unrelenting-entropy-of-competitive-smash-8f8abe04c04f'; 
		} else if (egg === 'easterEgg7') { 
		  this.easterEggIcon = '/stockicons/incineroar.svg'; 
		  this.easterEggLink = 'https://www.youtube.com/watch?v=wVYkMIi3M4g'; 
		}
		this.easterEggTriggered = true;
        return true;
      }
	}
	},
   },
 }
</script>


