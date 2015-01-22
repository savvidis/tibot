// TIbot: Custom Logger

var Log = {
    about: "Custom logging utility.",
    info: {
        pid: process.pid,
        platform: process.platform,
        timestamp: new Date().getTime()
    }
};

Log.error = function(error) {

    this.report = {};
    this.error = error || {};

    if(typeof(this.error.msg) !== 'undefined'){ this.msg = this.error.msg;
        } else {
            this.msg = error;
        }

    if(typeof(this.error.remote) !== 'undefined') { // Send to logging server or catch and process.
        } else {
            console.log('[!] TIbot ERROR: '+ JSON.stringify(this.msg));
            console.log(JSON.stringify(Log.info));
        }

    process.exit();
};

Log.report = function(msg){
    console.log('[LOG] TIbot: '+ msg);
    console.log(JSON.stringify(Log.info));
};
module.exports = Log;

