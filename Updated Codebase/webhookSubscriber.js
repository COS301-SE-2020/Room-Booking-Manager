
var AuthenticationContext = require("adal-node").AuthenticationContext;
const MicrosoftGraph = require("@microsoft/microsoft-graph-client");



module.exports = 
{
    subscribeToWebhook: async function(accessToken){
    const client = MicrosoftGraph.Client.init({
        defaultVersion: "v1.0",
        debugLogging: true,
        authProvider: (done) => {
            done(null, accessToken);
        },
    });

   
    return new Promise((resolve, reject) => {
        const subscription = {
            changeType: "created",
            notificationUrl: "https://e6421184c38b.ngrok.io/webhook",
            resource: "users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/events", // Subscribe to each employees events
            expirationDateTime: "2020-08-20T13:30:45.9356913Z",
            clientState: "secretClientValue",
            latestSupportedTlsVersion: "v1_2",
        };
        client
            .api("/subscriptions")
            .post(subscription)
            .then((res) => {
                console.log("SUBSCRIPTION SUCCESS");
                console.log(res);
                resolve(res);
            })
            .catch((err) => {
                console.log("SUBSCRIPTION ERROR");
                reject(console.log(err));
            });

    });
}
}