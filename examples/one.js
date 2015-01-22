// TIbot: Example, one page.

var Job = require('../job.js');

var settings = {
    model: "elance",
    type: 'query',
    privacy: true,
    host: 'https://elance.com',
    save: true,
    throttle: 5
};

var bot = new Job(settings);

var url = 'https://elance.com/r/jobs/p-5';

bot.getOne(url, function(err, body){
    if(err){ console.log(err); }

    bot.parse(body, function(err, data){
        console.log(data.length);
        if(err){ console.log(err); }

        if(settings.save){
            bot.save(data, function(err, job){
                console.log(job);
                process.exit();
            });
        } else {
            process.exit();
        }

    });

});


