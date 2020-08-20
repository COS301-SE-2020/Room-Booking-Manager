const assert = require('assert');
const accessToken = require('../../accessToken');
var graphCalls = require('../../graphCalls');
var amenityAI = require('../../AmenityAI')
var webhookCreate = require('../../webhookSubscriber');
var ExtractedDetails = require('../../ExtractedDetails');
var DatabaseQuerries = require('../../DatabaseQuerries');

describe('Integration test', function(){
    it('Should return be able to access and return correct sample event listed on the users calendar', async function(){
        var url = 'Users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/Events/AAMkAGNmMmE1MzY1LWU5MjAtNDgwZS1hODA1LTAxZmE3MDZjN2Y4MABGAAAAAADtYPw4__duQpoAUtqbk_dvBwATlvcwiTJsQINLpRQn-5KEAAAAAAENAAATlvcwiTJsQINLpRQn-5KEAAApCkcBAAA=';
        var access = await accessToken.getAccess().then(res=>res);
        eventDetails = await graphCalls.getDetailsFromEventUrl(url,access.accessToken);
        assert.equal(eventDetails.organizer.emailAddress.name,'Adele Vance')
    })
    it('Take input description event from the returned event and identify the correct type of amenity required', async function(){
        var desc = eventDetails.bodyPreview;
        var amenity = await amenityAI.identify(desc);
        assert.equal(amenity,'Monitor')
    })
    it('creates a webhook server and listens for event triggers', async function(){
        const express = require("express");
        const bodyParser = require("body-parser");
        const { urlencoded } = require("body-parser");
        const app = express();
        const PORT = 3000;


        app.use(bodyParser.json());
        app.listen(PORT, () => console.log(`RBM Server running on Port ${PORT}`));
        app.use(bodyParser.json());

   
    


        app.post("/webhook", (req, res) => {
        var eventDescription = req.body;
        res.header("content-type", "text/plain");
        res.send(req.query.validationToken);
        res.status(200);
        res.send(); 
    });

    var access = await accessToken.getAccess().then(res=>res);
    var res = await webhookCreate.subscribeToWebhook(access.accessToken).then(res=>res);
    assert.equal(res.changeType,'created');

    })

    //Variables to use to retireve information
    var details;
    var locID = [];
    
     //Extracted Details Integration
     console.log("");
     it('Should return a JSON object with the meeting details', async function(){
        var extractedDetails = await ExtractedDetails.EventDetails(eventDetails).then((res) => res);
        details = extractedDetails;
        console.log(details);
    })

    //Get Location Integration
    console.log("");
    it('Should return an array with Employees current loction IDs', async function(){
        var location = await DatabaseQuerries.getLocation(
            details.Attendees,
            details.Start,
            details.End
        ).then((res) => res);
        locID = location
        console.log(locID);  
    })

    
    
})