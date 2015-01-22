// TIbot: Database Connection

var mongoose = require('mongoose');

var schema = mongoose.Schema({
    title: String,
    link: { type: String, required: true, unique: true },
    price: {
        type: String,
        amount: String // This should be switch to int once you decide how you want to incorporate "Not Sure"
    },
    posted: String,
    duration: String,
    ends: String,
    proposals: String,
    description: String,
    indexed: { default: Date.now, type: String }
});

var Job = mongoose.model('jobs', schema);

var Mongo = function(connection) {

    this.connection = connection;

    mongoose.connect(connection);

};

Mongo.prototype = {

    disconnect: function () {
        mongoose.connection.close();
    },

    find: function (key, callback) {

        Job.find(key, function (err, doc) {
            if (err) {
                callback(err);
            }
            callback(null, doc);
        });


    },

    findAll: function(callback) {

            Job.find({}, function (err, doc) {
                if (err) {
                    callback(err);
                }
                callback(null, doc);
            });

    },

    save: function(object, callback){

        var db = new Job(object);

            db.save(function (status) {
                if(status == false){
                    callback(false);
                }
                callback(null, db);
            });

    }
};

module.exports = Mongo;