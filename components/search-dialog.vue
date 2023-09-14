<template>
  <div class="search-dialog"> 
    <div class="close-button" @click="closeDialog">✕</div>
    <input v-model="searchQuery" @input="search" placeholder="Search...">
    <ul>
      <li
        v-if="searchQuery.length > 0 && isValidSearchQuery()"
        v-for="result in filteredResults"
        :key="result.id"
        @click="storeSelectedValue(result)"
        @mouseover="highlightResult(result)"
        @mouseout="removeHighlight(result)"
        :class="{ highlighted: result === highlightedResult }" 
      >
        {{ result.player_tag }}
	<img
	  v-if="result.player_mains.length > 0"
	  :src="'http://jvgrid.com/static/stockicons/' + result.player_mains[0].toLowerCase() + '.svg'"
	  alt="Main Icon"
	  style="width: 30px; height: 30px;"
	>
      </li>
    </ul>
  </div>
</template>


<script>
import axios from 'axios';

export default {
  name: 'SearchDialog',
  data() {
    return {
      selectedOption: null,
      searchQuery: '',
      searchResults: [],
	  showSearchDialog: true,
	  highlightedResult: null,
    };
  },
  computed: { 
	filteredResults() { 
	return this.searchResults.slice(0,7);
	
	},
   },
	methods: {
	  storeSelectedValue(value) {
		this.$emit('result-selected', value);
		// Emit the clicked indices along with the selected player
		this.$emit('cell-selected', this.clickedRowIndex, this.clickedColumnIndex);
		this.showSearchDialog = false; // Close the search dialog
	  },
	  getFirstMain(playerMains) {
		if (playerMains) {
		  const mainsArray = playerMains.split(','); // Split by comma
		  if (mainsArray.length > 0) {
			return mainsArray[0].trim().toLowerCase(); // Trim to remove spaces
		  }
		}
		return ''; // Return an empty string if no mains are found
	},
    isValidSearchQuery() { 
      return this.searchQuery.trim().length > 0; 
    },
	closeDialog() { 

		this.showSearchDialog = false;
		this.$emit('close-dialog'); 
	},
	highlightResult(result) { 
		this.highlightedResult = result; 
	},
	removeHighlight(result) { 
		this.highlightedResult = null; 
	},
    async search() {
      try {
        const response = await axios.get(`http://jvgrid.com/api/search?query=${this.searchQuery}`);
        this.searchResults = response.data;
      } catch (error) {
        console.error('Error searching:', error);
      }
    },
	},
  };

</script>
<style>
@import url("https://fonts.googleapis.com/css2?family=Montserrat&display=swap");

* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  font-family: "Montserrat", sans-serif;
}

body {
  padding: 20px;
  min-height: 100vh;
  background-color: rgb(231, 237, 238);
}

input {
  display: block;
  width: 350px;
  margin: 20px auto;
  padding: 10px 45px;
  background: white url no-repeat 15px center;
  background-size: 15px 15px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
    rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

li {
  width: 350px;
  margin: 0 auto 10px auto;
  padding: 10px 20px;
  color: white ;
  border-radius: 5px;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  font-size: 25px;
}

li{
  background-color: rgb(97, 62, 252);
  cursor: pointer;
}

.error {
  background-color: tomato;
}
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  font-size: 24px;
  color: red; /* You can choose a color that fits your design */
}

.search-dialog {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative; /* Add this to establish a positioning context */
}
.highlighted {
  background-color: rgba(97, 62, 252, 0.8); /* Adjust the color and opacity as desired */
  color: white; /* Text color when highlighted */
}
</style>