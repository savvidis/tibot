Andela Bot
==========
Light-weight crawler designed for distributed deployment (jobs).

## About
"Andela Bot" is a fast Node.js web crawler built to be run in parallel in a bot net and optionally  as a single script. Apart from traditional crawlers it is entirely around flexible data extraction models so you can easily add different pages and structures to what the bot can read. It currently runs an example model which returns structured JSON of job postings on Elance.
A demo Mongo instance has been set up at the address within auth.json All dependencies are called from within "job.js".

## Getting Started
- Open auth.json and change the password field to the one mentioned in the email. The external database will not work without this.
```
npm install
```
- Define settings
```
node examples/many.js
```
*Note, access the demo database from the command line: mongo ds033469.mongolab.com:33469/andela -u admin -p YOUR_PASSWORD*

##Configuration
```
        var settings = {
            model: "elance",
            type: 'many',
            privacy: true,
            host: 'https://elance.com',
            save: false,
            throttle: 5
        }
```
- *model*: The model name which is also the exact method for the model class in model.js.
- *type*: Each web address scrape will either have one item you are pulling from or many. You can set some logic up around this.
- *privacy*: Determine if user agent should be anonymized or declared.
- *host*: Host
- *save*: Resulting records saved to database on file.
- *throttle*: Milliseconds between subsquent requests (to decrease load on server). For additional security made this a random number between 1000-10000.


Included is a *model* and *schema* for the Elance jobs page. As you crawl different page structures each page will need a schema and a model to operate.

##### Model
The model does the primary extraction and transfer of the data. Externally the Mongo model is set up to require uniqueness on link to the job record. In this way the crawl could encounter the same posting many times but will only index it as a new job correctly.

##### Schema
The schema contains pointers to primary sets of data and as JSON contains meta data for the model. Generally this would be hosted on a git repo or a separate server to allow you to make changes to the repository without causing the active jobs to fail.

## Examples
There are two examples, *one.js* and *many.js*. One takes a single url, parses it, and the saves it upon request.

## Performance
- Each page yields 25 job listings, the throttle at 300 (3 seconds) per request it was not blocked from Elance. Should you be blocked see features below. At this pace you would index the entirety of Elance active job listings (24,629 at the time of this commit) every 49.25 hours, so roughly every two days.
- Each page is scraped, parse, and saved to the database from a micro instance in the EAST region in 0.4 seconds.

## Development
1. I would suggest setting up a logging server. The code is basically there just need to add the push to the server.
2. There should be more validation on types regarding money and proposals. Money especially.
3. This architecture can be completely deployed on a heroku instance, with a small express server you can have them report to master. In this way you could deploy 100s which don't have to work at once, they can simply rotate amongst each-other as one or the other gets blocked.
4. I think Duration, Posted and Ends are critical. I would parse these to unix with Moment but not sure how you guys were doing it.
5. The next model and schema should be for the job page specifically. This should use the link url as the reference to extract more information for each job (status, bids, type etc.)
6. As for being blocked, I left the "privacy" option. This should also report back to a master and track DNS times. If DNS times go down, it should auto rotate to another headless server (all of this can be setup for free don't pay for an army of instances).
