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
		<a href="https://www.youtube.com/watch?v=VTo_SjsrKRc">
			<img src="../static/stockicons/mario.svg" alt="Mario icon" />
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
</style>

<script>
export default {
  name: 'top-menu'
}
</script>