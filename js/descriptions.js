let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//Keep only the completed tweets that contain user-written text
	writtenTweets = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	}).filter(function(tweet) {
		return tweet.written;
	});
}

function updateSearchResults(query) {
	const matches = query === '' ? [] : writtenTweets.filter(function(tweet) {
		return tweet.writtenText.toLowerCase().includes(query.toLowerCase());
	});
	document.getElementById('searchCount').innerText = matches.length;
	document.getElementById('searchText').innerText = query;
	document.getElementById('tweetTable').innerHTML = matches.map(function(tweet, index) {
		return tweet.getHTMLTableRow(index + 1);
	}).join('');
}

function addEventHandlerForSearch() {
	const searchBox = document.getElementById('textFilter');
	searchBox.addEventListener('input', function() {
		updateSearchResults(searchBox.value);
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});
