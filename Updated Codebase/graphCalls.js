const MicrosoftGraph = require("@microsoft/microsoft-graph-client");
require("isomorphic-fetch");
var dotenv = require("dotenv");
var dotenvExpand = require("dotenv-expand");
var Promise = require("bluebird");

module.exports = {
    getDetailsFromEventUrl: async function (event, accessToken) {
        return new Promise((resolve, reject) => {
            const client = MicrosoftGraph.Client.init({
                defaultVersion: "v1.0",
                debugLogging: true,
                authProvider: (done) => {
                    done(null, accessToken);
                },
            });
            client
                .api("/" + event)
                //.select("organizer")
                //.select("subject")
                .header("Prefer", 'outlook.body-content-type="text"')
                .get()
                .then((res) => {
                    console.log(res);
                    resolve(res);
                })
                .catch((err) => {
                    console.log(err);
                    reject(err);
                });
        });
    },
};
