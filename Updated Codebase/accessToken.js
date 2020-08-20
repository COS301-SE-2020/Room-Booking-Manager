var AuthenticationContext = require("adal-node").AuthenticationContext;
const MicrosoftGraph = require("@microsoft/microsoft-graph-client");
require("isomorphic-fetch");
var dotenv = require("dotenv");
var dotenvExpand = require("dotenv-expand");
var Promise = require("bluebird");


// Environment config setup
var myEnv = dotenv.config();
dotenvExpand(myEnv);


// Load config parameters from Environment file into global variables
var authorityHostUrl = process.env.authorityHostUrl; //'https://login.microsoftonline.com';
var tenant = process.env.tenant; // Azure Active Directory Tenant name/ID.
var authorityUrl = authorityHostUrl + tenant;
var applicationId = process.env.applicationId; // Application ID of app registered under AAD.
var clientSecret = process.env.clientSecret; // Secret generated from app registration.
var resource = process.env.resource; // URI that identifies the resource for which the token is valid. e.g Graph API


module.exports = {
    getAccess : async function () {
    return new Promise((resolve, reject) => {
        var context = new AuthenticationContext(authorityUrl);
        context.acquireTokenWithClientCredentials(resource, applicationId, clientSecret, function (err, tokenResponse) {
            if (err) {
                console.log("Error getting the access Token:  " + err.stack);
                return reject(new Error("accessToken Error"));
            } else {
                return resolve(tokenResponse);
            }
        });
    });
}

}