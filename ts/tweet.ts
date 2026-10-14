// Words used for the simple sentiment bonus feature.
const POSITIVE_WORDS = ['good', 'great', 'nice', 'awesome', 'amazing', 'love', 'happy', 'best', 'fun',
    'strong', 'beautiful', 'perfect', 'proud', 'fast', 'fastest', 'pb', 'excited', 'enjoy', 'enjoyed', 'win'];
const NEGATIVE_WORDS = ['bad', 'tired', 'hard', 'tough', 'slow', 'hurt', 'pain', 'sore', 'awful', 'terrible',
    'hate', 'cold', 'hot', 'headache', 'injury', 'injured', 'worst', 'struggle', 'exhausted', 'sad'];

const KM_PER_MILE = 1.609;

// Matches the start of a completed-event tweet: "Just completed a 5 km run", "Just posted a yoga practice in 20:00".
// Groups: 1 = distance number (optional), 2 = unit (optional), 3 = activity type.
const COMPLETED_PATTERN =
    /^(?:Just completed|Just posted|Completed) an? (?:([\d.]+) (km|mi) )?([\s\S]*?)(?= - | with | @ | in \d| https| >>>|\s*$)/;

class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        if (this.text.startsWith('Watch my') && this.text.includes('right now with @Runkeeper Live')) {
            return 'live_event';
        }
        if (this.text.startsWith('Achieved a new personal record') || this.text.startsWith('I just set a goal')) {
            return 'achievement';
        }
        if (COMPLETED_PATTERN.test(this.text)) {
            return 'completed_event';
        }
        return 'miscellaneous';
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        return this.writtenText.length > 0;
    }

    get writtenText():string {
        if (this.source != 'completed_event') {
            return "";
        }
        // Drop the link and hashtag, then keep whatever follows the "<activity> - " separator.
        // The default RunKeeper text ("with @Runkeeper. Check it out!") has no separator, so it yields nothing.
        const cleaned = this.text
            .replace(/https?:\/\/\S+/g, '')
            .replace(/#Runkeeper/gi, '')
            .trim();
        const separatorIndex = cleaned.indexOf(' - ');
        if (separatorIndex === -1) {
            return "";
        }
        return cleaned.substring(separatorIndex + 3).trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        const match = this.text.match(COMPLETED_PATTERN);
        return match ? match[3].trim() : "unknown";
    }

    //distance in miles; 0 for activities logged by duration instead of distance
    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        const match = this.text.match(COMPLETED_PATTERN);
        if (!match || match[1] === undefined) {
            return 0;
        }
        const value = parseFloat(match[1]);
        return match[2] === 'km' ? value / KM_PER_MILE : value;
    }

    //'positive', 'negative', or 'neutral', based on word lists applied to the user-written text
    get sentiment():string {
        const words = this.writtenText.toLowerCase().match(/[a-z']+/g) || [];
        const positive = words.filter(word => POSITIVE_WORDS.includes(word)).length;
        const negative = words.filter(word => NEGATIVE_WORDS.includes(word)).length;
        if (positive > negative) {
            return 'positive';
        }
        return negative > positive ? 'negative' : 'neutral';
    }

    getHTMLTableRow(rowNumber:number):string {
        const linkedText = this.text.replace(/https?:\/\/\S+/g,
            url => `<a href="${url}" target="_blank" rel="noopener">${url}</a>`);
        return `<tr><td>${rowNumber}</td><td>${this.activityType}</td><td>${linkedText}</td><td>${this.sentiment}</td></tr>`;
    }
}
