const DAY_ORDER = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKEND_DAYS = ['Sat', 'Sun'];

function mean(values) {
	return values.reduce(function(sum, value) { return sum + value; }, 0) / values.length;
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

	//Count the completed tweets of each activity type
	const completed = tweet_array.filter(function(tweet) { return tweet.source == 'completed_event'; });
	const counts = {};
	completed.forEach(function(tweet) {
		counts[tweet.activityType] = (counts[tweet.activityType] || 0) + 1;
	});
	const activityCounts = Object.keys(counts).map(function(type) {
		return {activityType: type, count: counts[type]};
	}).sort(function(a, b) { return b.count - a.count; });

	document.getElementById('numberActivities').innerText = activityCounts.length;
	const topThree = activityCounts.slice(0, 3).map(function(entry) { return entry.activityType; });
	document.getElementById('firstMost').innerText = topThree[0];
	document.getElementById('secondMost').innerText = topThree[1];
	document.getElementById('thirdMost').innerText = topThree[2];

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityCounts
	  },
	  "mark": "bar",
	  "encoding": {
	    "x": {"field": "activityType", "type": "nominal", "sort": "-y", "title": "Activity type"},
	    "y": {"field": "count", "type": "quantitative", "title": "Number of Tweets"}
	  }
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//Distance by day of the week for the three most-tweeted activities
	const distanceData = completed.filter(function(tweet) {
		return topThree.includes(tweet.activityType);
	}).map(function(tweet) {
		return {
			activityType: tweet.activityType,
			day: tweet.time.toLocaleDateString('en-US', {weekday: 'short'}),
			distance: tweet.distance
		};
	});

	const dayEncoding = {"field": "day", "type": "ordinal", "sort": DAY_ORDER, "title": "Day of the week"};
	const colorEncoding = {"field": "activityType", "type": "nominal", "title": "Activity type"};

	distance_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Distance of each activity by day of the week.",
	  "data": {"values": distanceData},
	  "mark": "point",
	  "encoding": {
	    "x": dayEncoding,
	    "y": {"field": "distance", "type": "quantitative", "title": "Distance (miles)"},
	    "color": colorEncoding
	  }
	};
	vegaEmbed('#distanceVis', distance_vis_spec, {actions:false});

	distance_vis_aggregated_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "Mean distance of each activity by day of the week.",
	  "data": {"values": distanceData},
	  "mark": {"type": "line", "point": true},
	  "encoding": {
	    "x": dayEncoding,
	    "y": {"aggregate": "mean", "field": "distance", "type": "quantitative", "title": "Mean distance (miles)"},
	    "color": colorEncoding
	  }
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, {actions:false});

	//Fill in the longest/shortest activity types and weekday vs weekend, computed from the same data
	const meanByType = topThree.map(function(type) {
		return {type: type, mean: mean(distanceData.filter(function(row) { return row.activityType == type; })
			.map(function(row) { return row.distance; }))};
	}).sort(function(a, b) { return b.mean - a.mean; });
	document.getElementById('longestActivityType').innerText = meanByType[0].type;
	document.getElementById('shortestActivityType').innerText = meanByType[meanByType.length - 1].type;

	const weekendMean = mean(distanceData.filter(function(row) { return WEEKEND_DAYS.includes(row.day); })
		.map(function(row) { return row.distance; }));
	const weekdayMean = mean(distanceData.filter(function(row) { return !WEEKEND_DAYS.includes(row.day); })
		.map(function(row) { return row.distance; }));
	document.getElementById('weekdayOrWeekendLonger').innerText = weekendMean > weekdayMean ? 'weekends' : 'weekdays';

	//Only one distance chart is visible at a time; the button swaps between them
	const aggregateButton = document.getElementById('aggregate');
	const allChart = document.getElementById('distanceVis');
	const meanChart = document.getElementById('distanceVisAggregated');
	meanChart.style.display = 'none';
	aggregateButton.addEventListener('click', function() {
		const showingMeans = meanChart.style.display != 'none';
		meanChart.style.display = showingMeans ? 'none' : 'block';
		allChart.style.display = showingMeans ? 'block' : 'none';
		aggregateButton.innerText = showingMeans ? 'Show means' : 'Show all activities';
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
