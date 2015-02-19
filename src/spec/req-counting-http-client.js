var http = require('http');
var Promise = require('promise');
var events = require('events');

var httpClient = new function() {
    var pendingRequests = 0;
    var eventEmitter = new events.EventEmitter();

    this.get = function(url) {
        pendingRequests++;

        return new Promise(function(fulfill, reject) {
            http.get(url, wrap(fulfill))
                .on('error', wrap(reject));
        });
    };

    this.post = function(url, postData) {

        /*var postData = JSON.stringify({ id: 'aaa' });

         var options = {
         hostname: 'localhost',
         port: 9921,
         path: '/publish',
         method: 'POST',
         headers: {
         'Content-Type': 'application/json',
         'Content-Length': postData.length
         }
         };

         http.request(options);
         http.data(postData);
         http.on('response', function(resp) {
         console.log('RESPONSE');

         expect(true).toBeFalsy();
         cb();
         });*/

    };

    this.on = function(event, callback) {
        eventEmitter.on(event, callback);
    };

    function wrap(f) {
        return function() {
            try {
                f.apply(this, arguments);
            } finally {
                if (--pendingRequests === 0) {
                    eventEmitter.emit('no-more-pending')
                }
            }
        }
    }
};

module.exports = {
    client: httpClient
};
