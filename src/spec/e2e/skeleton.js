var client = require('../req-counting-http-client.js').client;
var embeddedEnv = require('../embedded-environment.js').readyEnvironment;
var fs = require('fs');

describe("deployer", function() {
    it("get a webhook call from the repository and store the file to be deployed", function(cb) {
        var url = embeddedEnv.serverUrl + 'publish';
        var targetFile = embeddedEnv.deploymentRoot + 'xyz.def/1.0/def-1.0.jar';

        var data = {
            groupId: 'xyz',
            artifactId: 'def',
            version: '1.0',
            url: embeddedEnv.fakeRepoUrl + 'xyz/def/1.0/def-1.0.jar'
        };

        client.post(url, data).then(function(res) {
            expect(res.statusCode).toBe(200);

            console.log('Checking file exists', targetFile);

            fs.exists(targetFile, function(exists) {
                expect(exists).toBeTruthy();
                cb();
            });
        }).catch(function(err) {
            fail(err);
            cb();
        })
    });
});
