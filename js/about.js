function formatPercent(count, total) {
	return math.format(count / total * 100, {notation: 'fixed', precision: 2}) + '%';
}

function setText(className, value) {
	document.querySelectorAll('.' + className).forEach(function(element) {
		element.innerText = value;
	});
}

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	document.getElementById('numberTweets').innerText = tweet_array.length;

	//Earliest and latest tweet dates
	const times = tweet_array.map(function(tweet) { return tweet.time.getTime(); });
	const dateFormat = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'};
	document.getElementById('firstDate').innerText = new Date(Math.min(...times)).toLocaleDateString('en-US', dateFormat);
	document.getElementById('lastDate').innerText = new Date(Math.max(...times)).toLocaleDateString('en-US', dateFormat);

	//Tweet categories
	const total = tweet_array.length;
	const categories = {
		completedEvents: 'completed_event',
		liveEvents: 'live_event',
		achievements: 'achievement',
		miscellaneous: 'miscellaneous'
	};
	for (const className in categories) {
		const count = tweet_array.filter(function(tweet) { return tweet.source == categories[className]; }).length;
		setText(className, count);
		setText(className + 'Pct', formatPercent(count, total));
	}

	//Completed events that include user-written text
	const completed = tweet_array.filter(function(tweet) { return tweet.source == 'completed_event'; });
	const written = completed.filter(function(tweet) { return tweet.written; });
	setText('written', written.length);
	setText('writtenPct', formatPercent(written.length, completed.length));
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
