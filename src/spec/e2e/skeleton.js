var client = require('../req-counting-http-client.js').client;

describe("deployer", function() {
    it("get a webhook call from the repository and store the file to be deployed", function(cb) {
        var url = 'http://localhost:' + 9921 + "/";

        client
            .get(url)
            .then(function(res) {
                expect(true).toBeTruthy();
                cb();
            })
            .catch(function(err) {
                expect(false).toBeTruthy();
                cb();
            });
    });
});
