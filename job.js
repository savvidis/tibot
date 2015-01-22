// TIbot : Manager

var Auth = require('./auth.json'),
    Log = require('./log.js'),
    Model = require('./model.js'),
    Mongo = require('./mongo.js'),
    fs = require('fs'),
    randomAgent= require('random-ua'),
    request = require('request');

// Connect to the demo Mongo instance.
var uri =  'mongodb://'+Auth.mongo.user+':'+Auth.mongo.password+'@'+Auth.mongo.host,
    db = new Mongo(uri);

var Job = function(s) {

    /*
     Settings
     -- host: (String) root url or domain of target.
     -- throttle: (Integer) milliseconds for between requests, default = 5000.
     -- threaded: (Boolean) break process into workers on available threads.
     -- privacy: (Boolean) Load random user agent.
     -- distributed: (Boolean) Contains web API address of headless scraper.
     */

    // Check for required settings.
    if (typeof(s.type) == 'undefined'){
        Log.error('A type is required to initialize a job.');
    }
    if (typeof(s.model) == 'undefined'){
        Log.error('A model is required to initialize a job.');
    }

    this.settings = s || {};
    this.settings.type = s.type;
    if (typeof(this.settings.privacy) !== 'undefined'){ this.settings.privacy = s.privacy; }
        else { this.settings.privacy = false; }
    if (typeof(this.settings.host) !== 'undefined'){ this.settings.root = s.host; }
        else { this.settings.root = 'http://0.0.0.0/'; }
    if (typeof(this.settings.throttle) !== 'undefined'){ this.settings.throttle = s.throttle; }
    else { this.settings.throttle = 5000; }

    // Check if model exists, assign model object method.
    var models = Object.keys(Model);
    if(models.indexOf(s.model) >= 0){
        this.settings.model = Model[s.model];
    } else {
        Log.error('Unable to load model for \''+ s.model + '\'');
    }

    Log.report('Job starting! '+JSON.stringify(this.settings));

};

Job.prototype = {

    get: function(url, callback){
        var self = this, settings = this.settings, ops = {}, ua = randomAgent.generate();

        ops.url = url;
        if(settings.privacy){
            ops.headers = {
                'User-Agent': ua
            };
        } else {
            ops.headers = {
                'User-Agent': 'Andelbot: A light-weight web crawler based on Jquery. Respects all robots.txt. For additional policy information or to file a complaint visit: http://www.talentincubator.eu'
            };
        }
        console.log(ops.headers);

        request(ops, function(err, response, body){
            if(err){ callback(err); }
            callback(null, body);
        });
    },

    // Alias of get
    getOne: function(url, callback){
        var self = this;
        self.get(url, function(err, data){
            if(err){callback(err);}
            callback(null, data);
        });
    },

    getMany: function(urls, callback){
        var self = this, settings = this.settings; this.urls = urls;
        var i = setInterval(function(){

                var url = urls.pop();
                self.get(url, function(err, data){
                    if(err){ callback(err); }

                    callback(err, data);

                    if(urls.length == 0){
                        Log.report('Job complete! Exiting...');
                        clearInterval(i);
                        process.exit();
                    }

                });

        }, settings.throttle);

    },

    parse: function(data, callback){
        var self = this, settings = this.settings, model = this.settings.model;
        model(data, function(err, res){
            if(err){ callback(err); }
            callback(null, res);
        });

    },
    // Saves object to Mongo.
    save: function(data, callback){
        var self = this, settings = this.settings;
        // Auto parses data Array or String.
        if(data.length){
            self.saveMany(data, function(err, res){
                if(err){ callback(err); }
                callback(null, res);
            });
        } else {
            db.save(data, function(err, res){
                if(err){ callback(err); }
                callback(null, res);
            });
        }
        callback(true);
    },

    // Alias for save
    saveOne: function(data, callback){
        var self = this, settings = this.settings;
        self.save(data, function(err, res){
           if(err){ callback(err); }
           callback(null, res);
        });
    },

    saveMany: function(objs, callback){
        var self = this, settings = this.settings;
        objs.forEach(function(o){
            self.save(o, function(err, data){
               if(err){ callback(err); }
               callback(null, data);
            });
        });
    }

};

module.exports = Job;





