--Readme document for Ronald Wen, ronaldwen10@gmail.com--

1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

11/10
- 3/3 Summarizing tweets
- 4/4 Identifying the most popular activities
- 3/3 Adding a text search interface
- 1 bonus: sentiment column in the search table

2. How long, in hours, did it take you to complete this assignment?

2 hours

3. What online resources did you consult when completing this assignment? (list sites like StackOverflow or specific URLs for tutorials; describe queries to Generative AI or use of AI-based code completion)

- https://vega.github.io/vega-lite/docs/ (bar, point, and line marks; encodings; sorting axes)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString (date formatting)
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions (parsing tweet text)
- https://www.typescriptlang.org/docs/handbook/2/classes.html (getters)
- AI-assisted in coding development.

4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?

None.

5. Is there anything special we need to know in order to run your code?

Compile ts/tweet.ts to js/tweet.js with "tsc --p tsconfig.json" (TypeScript 5.x; TypeScript 7 rejects the starter tsconfig's "module": "none" option), then open index.html, activities.html, or descriptions.html (or run live-server).

How tweets are classified:
- Live event: starts with "Watch my" and contains "right now with @Runkeeper Live".
- Achievement: starts with "Achieved a new personal record" or "I just set a goal".
- Completed event: starts with "Just completed", "Just posted", or "Completed", followed by "a"/"an". Everything else is miscellaneous.
- User-written text: for completed events, the text after the " - " separator that follows the activity (the default "with @Runkeeper. Check it out!" tweets have none).
- Distances in km are converted to miles using 1 mi = 1.609 km. Activities logged by duration (yoga, strength workouts, etc.) have a distance of 0 and are counted in the activity totals but not graphed.

Results: 96.82% completed events and 22.74% of those include written text, close to the 95% and 25% in the research paper.

Search: matches against the user-written part of each tweet, case-insensitive, and updates on every keystroke. Clearing the box clears the table.

Bonus feature: the search table has a Sentiment column (positive, negative, or neutral) computed from short positive and negative word lists applied to the written text. The only HTML change is the added "Sentiment" table header in descriptions.html.
