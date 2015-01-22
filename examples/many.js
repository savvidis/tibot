// TIbot: example for many pages

var Job = require('../job.js'),
    Log = require('../log.js');

var settings = {
    model: "elance", // Looks up this method in model.js
    type: 'query',
    privacy: true, // Randomly selects different User Agent with EVERY request.
    host: 'https://elance.com',
    save: true, // Switch to true to save to Database.
    throttle: 5000 // The time in milliseconds between
};

var bot = new Job(settings);
var urls = [];
var pages = 10; // This will make Andelbot index 500 pages of elance.

while(pages > 1){
    pages--;
    urls.push('https://elance.com/r/jobs/p-'+pages);
}

bot.getMany(urls, function(err, body){
    if(err){ console.log(err); }

    bot.parse(body, function(err, data){

        if(err){ console.log(err); }
        Log.report(' Jobs Indexed: '+ data.length);

        // If save is true, save to default database.
        if(settings.save){
            bot.save(data, function(err, data){
                console.log(data);
            });
        }

    });

});


