// TIbot : Model for Elance website

var Schema = require('./schemas.json'),
    Log = require('./log.js'),
    cheerio = require('cheerio');

var Model = {

    // Model: 'elance', Description: Gathers pricing, bids, meta, title, hyperlink, and time from Elance.
    // Ref: https://www.elance.com/r/jobs/p-2

    elance: function(data, callback){
        var l = Schema.elance.location;

        $ = cheerio.load(data);

        var res = [];

        $(l.stats).each(function(){
            try {

                var field = $(this),
                    stats = field.text().split('|');

                    // Parse for the optional presence of "duration"
                    if(stats.length == 5){
                        var price = stats[0].trim(),
                            duration = stats[1].trim().replace('Duration: ',''),
                            posted = stats[2].trim().replace('Posted: ',''),
                            ends = stats[3].trim().replace('Ends: ',''),
                            proposals = stats[4].trim().replace(/[^.0-9]/g, '');
                    } else if (stats.length == 4) {
                        var price = stats[0].trim(),
                            duration = "na",
                            posted = stats[1].trim().replace('Posted: ',''),
                            ends = stats[2].trim().replace('Ends: ',''),
                            proposals = stats[3].trim().replace(/[^.0-9]/g, '');
                    } else {
                        callback(err);
                    }

                var job = {
                    title: field.prev().children('a').first().text().trim(),
                    price: {},
                    posted: posted,
                    duration: duration,
                    ends: ends,
                    proposals: proposals,
                    description: field.next().text().trim(),
                    link: field.prev().children('a').attr('href')
                };

                if(price.indexOf('Hourly Rate') >= 0){
                    job.price.type = "hr"; // Type = Hourly Rate.
                    job.price.amount = price.replace('Hourly Rate:','').trim();
                }

                if(price.indexOf('Fixed Price') >= 0){
                    job.price.type = "fp"; // Type = Fixed Price.
                    job.price.amount = price.replace(/[^.0-9]/g, '');

                }

                if(price.indexOf('Not Sure') >= 0){
                    job.price.type = job.price.type + '-ns'; // Adds a flag for pricing that is "Not Sure"
                    job.price.amount = 'ns'; // Consider switching -1 to not int type parse errors.
                }

                res.push(job);

            } catch(err){
                callback(err);
            }
        });

        callback(null, res);
    },
    exampleModel: function(data, callback){
        /*
            As much as possible try to load selectors from schemas.json, schemas.json should also be a remote location
            or Github repo so that it can be edited without interupting scheduled jobs.
         */
    }

};

module.exports = Model;

