var cheerio = require('cheerio'),
request = require('request');


var options = {
    url: "https://www.elance.com/r/jobs/p-2",
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Cache-Control':'max-age=0'
  }
};

request(options, function (err, response, body) {
    if (err) throw err;
    var $ = cheerio.load(body);
    var listNodes = $('#jobSearchResults > div:nth-child(1)');
    var index = 0;
    listNodes.text().split('|').forEach(function(node){
        index +=1;
       console.log(index+ " "+ node.trim());
    });
});
