// Imports and modules required
var AuthenticationContext = require("adal-node").AuthenticationContext;
const MicrosoftGraph = require("@microsoft/microsoft-graph-client");
require("isomorphic-fetch");
var dotenv = require("dotenv");
var dotenvExpand = require("dotenv-expand");
var Promise = require("bluebird");

// Environment config setup
var myEnv = dotenv.config();
dotenvExpand(myEnv);

// Functional module imports
var AmenityAI = require("./AmenityAI");
var ExtractedDetails = require("./ExtractedDetails");
var DatabaseQuerries = require("./DatabaseQuerries");
var GatherFeasibleRooms = require("./GatherFeasibleRooms");
var bestRoomsInAsc = require("./bestRoomsInAsc");
var GlobalOptimization = require("./GlobalOptimization");
var UpdateLocation = require("./UpdateLocation");
var CheckConflict = require("./CheckConflict");
var B2BTimeOptimisation = require("./B2B_Time_Optimizer");


// Load config parameters from Environment file into global variables
var authorityHostUrl = process.env.authorityHostUrl; //'https://login.microsoftonline.com';
var tenant = process.env.tenant; // Azure Active Directory Tenant name/ID.
var authorityUrl = authorityHostUrl + tenant;
var applicationId = process.env.applicationId; // Application ID of app registered under AAD.
var clientSecret = process.env.clientSecret; // Secret generated from app registration.
var resource = process.env.resource; // URI that identifies the resource for which the token is valid. e.g Graph API
var redirect = "https://localhost:3000/callback";



//Local Webhook endpoint
const express = require("express");
const bodyParser = require("body-parser");
const { urlencoded } = require("body-parser");
const app = express();
const PORT = 3000;

// Tell express to use body-parser's JSON parsing
app.use(bodyParser.json());

// Start express on the defined port
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
app.use(bodyParser.json());

app.post("/webhook", (req, res) => {
    console.log(req.body);
    var eventDescription = req.body;

    res.header("content-type", "text/plain");
    res.send(req.query.validationToken);
    res.status(200);
    res.send(); // Responding is important
    beginProcess(eventDescription);
});

// This function begins the process
// It will take in the parameter of the eventID
startProcess();

// Starts the process
async function startProcess() {
    // Use the token and in combination with the eventID find the meeting details
    var someObj = await getAccess().then((result) => result.accessToken);
    var Users = await getEventdetails(someObj).then((res) => res);
    //console.log( Users.value[0]);
}

// hardCoded begin Process execution
async function getEventdetails(accessToken) {
    const client = MicrosoftGraph.Client.init({
        defaultVersion: "v1.0",
        debugLogging: true,
        authProvider: (done) => {
            done(null, accessToken);
        },
    });

    // im in

    // Get the name of the authenticated user with promises
    return new Promise((resolve, reject) => {
        const subscription = {
            changeType: "created",
            notificationUrl: "https://7d39f1756eaa.ngrok.io/webhook",
            resource: "users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/events", // Subscribe to each employees events 
            expirationDateTime: "2020-08-17T11:20:45.9356913Z",
            clientState: "secretClientValue",
            latestSupportedTlsVersion: "v1_2",
        };
        client
            .api("/subscriptions")
            .post(subscription)
            .then((res) => {
                console.log("SUBSCRIPTION");
                console.log(res);
                resolve(res);
            })
            .catch((err) => {
                console.log("SUBSCRIPTION ERROR");
                reject(console.log(err));
            });
        /*
client
	.api('/subscriptions')	
//.api("/users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/calendar/events")
	//.select("organizer")
	//.select("subject")
	
	.get()
	.then((res) => {
		console.log(res);
		resolve(res);
	})
	.catch((err) => {
		reject(console.log(err));
	});
	*/
    });
}

async function beginProcess(eventDescription) {
    console.log("New Event triggered: ");
    //console.log(JSON.stringify(eventDescription));
    if (eventDescription != undefined) {
        var eventUrl = eventDescription.value[0].resource;
       // console.log("This is event APi call: " + eventUrl);

        var access = await getAccess().then((result) => result.accessToken);
        var eventRes = await getDetails(eventUrl, access).then((res) => res);
       // console.log("This is event RES: ");
        //console.log(eventRes);

        //JSON Object with necessary event information
        console.log("Extracted Details");
        var extractedDetails = await ExtractedDetails.EventDetails(eventRes).then((res) => res);
        console.log(extractedDetails);

        var canBook = await CheckConflict.start(extractedDetails.Organizer,extractedDetails.Start,extractedDetails.End).then((res) => res);

        if(canBook)
        {
            //Location ID of employees
            var location = await DatabaseQuerries.getLocation(
                extractedDetails.Attendees, 
                extractedDetails.Start,
                extractedDetails.End
                ).then((res) => res);
            console.log("Attendee Locations: " + location);

            console.log("Event description input: "+eventRes.bodyPreview);
            var Amenity = await AmenityAI.identify(eventRes.bodyPreview).then((res) => res);

            console.log("Amenity: " + Amenity);
            var availRooms = await GatherFeasibleRooms.getFeasibleRooms(
                Amenity,
                extractedDetails.Capacity,
                extractedDetails.Start,
                extractedDetails.End
            ).then((res) => res);
            console.log("Rooms available to select from: " + availRooms);

            var ListOfRooms = await bestRoomsInAsc.getRoomsInOrderOfDistances(availRooms, location); //returns rooms in ascending order based on average distance of  employees to each meeting room
            console.log("List Of Rooms sorted by distance: " + ListOfRooms);
            var roomName = await DatabaseQuerries.roomNameQuery(ListOfRooms[0]).then(res=>res);
            console.log(roomName);
            await UpdateLocation.update(access,extractedDetails.Organizer,extractedDetails.Subject,extractedDetails.Start,roomName[0].RoomName );

            await bestRoomsInAsc.bookMeetingRoom(extractedDetails, Amenity, ListOfRooms);
            var B2BEventList = await GlobalOptimization.getBackToBackList();
            console.log("B2B list if identified is :");
            console.log(B2BEventList);
            if(B2BEventList.Events[0].currentMeetingID == null)
            {
                // Do nothing
                console.log("No events to optimise for B2b.")
            }
            else{
                console.log("Events have been found to optimise for B2b.")
                B2BTimeOptimisation.CalculateEndTimes(B2BEventList)
            }
        }
        else
        {
            console.debug("Booking conflict identified");
        }
    }
}

async function getDetails(event, accessToken) {
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
}
// This function returns a Promise object containing the tokenResponse.
function getAccess() {
    return new Promise((resolve, reject) => {
        var context = new AuthenticationContext(authorityUrl);
        context.acquireTokenWithClientCredentials(resource, applicationId, clientSecret, function (
            err,
            tokenResponse
        ) {
            if (err) {
                console.log("well that didn't work: " + err.stack);
                return reject(new Error("Something wrong"));
            } else {
                token = tokenResponse;
                //console.log("In getAccessToken we have got: "+ tokenResponse.accessToken);
                return resolve(tokenResponse);
            }
        });
    });
}
