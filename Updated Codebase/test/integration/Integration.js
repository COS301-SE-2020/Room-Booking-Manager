const assert = require('assert');
const accessToken = require('../../accessToken');
var graphCalls = require('../../graphCalls');
var amenityAI = require('../../AmenityAI')
var webhookCreate = require('../../webhookSubscriber');
var ExtractedDetails = require('../../ExtractedDetails');
var DatabaseQuerries = require('../../DatabaseQuerries');
var GatherFeasibleRooms = require("../../GatherFeasibleRooms");
var bestRoomsInAsc = require("../../bestRoomsInAsc");
var GlobalOptimization = require("../../GlobalOptimization");
var UpdateLocation = require("../../UpdateLocation");
var CheckConflict = require("../../CheckConflict");
var B2BTimeOptimisation = require("../../B2B_Time_Optimizer");
var NotifyOrganiser = require("../../NotifyOrganiser");

describe('Integration test', function(){
    it('Should return be able to access and return correct sample event listed on the users calendar', async function(){
        var url = 'Users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/Events/AAMkAGNmMmE1MzY1LWU5MjAtNDgwZS1hODA1LTAxZmE3MDZjN2Y4MABGAAAAAADtYPw4__duQpoAUtqbk_dvBwATlvcwiTJsQINLpRQn-5KEAAAAAAENAAATlvcwiTJsQINLpRQn-5KEAAApCkcBAAA=';
        var access = await accessToken.getAccess().then(res=>res);
        eventDetails = await graphCalls.getDetailsFromEventUrl(url,access.accessToken);
        assert.equal(eventDetails.organizer.emailAddress.name,'Adele Vance')
    })
    var Amenity;
    it('Take input description event from the returned event and identify the correct type of amenity required', async function(){
        var desc = eventDetails.bodyPreview;
        var amenity = await amenityAI.identify(desc);
        assert.equal(amenity,'Monitor');
        Amenity = amenity;
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
    var availRooms = [];
    var ListOfRooms = [];
    var roomName;
    var B2BEventList;
    var checkB2B;
    
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

    console.log("");
    it('Should return an array of available rooms', async function(){
        var aRooms = await GatherFeasibleRooms.getFeasibleRooms(
            Amenity,
            details.Capacity,
            details.Start,
            details.End
        ).then((res) => res);
        availRooms = aRooms;
        console.log("\nRooms Available To Select From: " + availRooms);  
    })

    console.log("");
    it('Should return an array of available rooms sorted by distance', async function(){
        var lRooms = await bestRoomsInAsc.getRoomsInOrderOfDistances(availRooms, locID); //returns rooms in ascending order based on average distance of  employees to each meeting room
        ListOfRooms = lRooms;
        console.log("\nList Of Rooms Sorted By Distance: " + lRooms);
    })

    console.log("");
    it('Should return roomName', async function(){
        var rName = await DatabaseQuerries.roomNameQuery(ListOfRooms[0]).then((res) => res);
            console.log("\nROOM NAME = " + JSON.stringify(rName));
            roomName = rName;
    })

    // console.log("");
    // it('Store the rooms', async function(){
    // await bestRoomsInAsc.bookMeetingRoom(details, Amenity, ListOfRooms);
    // })

    console.log("");
    it('Get events to identify Back to Back', async function(){
        var B2B = await GlobalOptimization.getBackToBackList();
        B2BEventList = B2B;
    })

    console.log("");
    it('Check Back to Back', async function(){
        var check = await GlobalOptimization.checkBackToBack(B2BEventList);
        checkB2B = check;
    })

    console.log("");
    it('Local and Global Optimization', async function(){
        if (!checkB2B) {
            console.log("\nLOCAL OPTIMIZATION: No Events To Optimise For Back To Back.");

            var confirmed = await NotifyOrganiser.sendOrganiserBookingNotification(
                details,
                roomName[0].RoomName,
                Amenity
            );

            if (confirmed) {
                console.log("\nMeeting Room Confirmed! Check Mailbox.");
            } else {
                console.log("\nCould NOT Confirm Meeting Room.");
            }

            console.log("\nLOCAL OPTIMIZATION COMPLETED.");
        } else {
            console.log("\nGLOBAL OPTIMIZATION: Events Have Been Found To Optimise For Back To Back Scenario.");

            // display the back to back events:
            GlobalOptimization.toStringB2B(B2BEventList);

            // NOTE TO ABU: PLEASE FIX THE FUNCTION.

            // await B2BTimeOptimisation.CalculateEndTimes(B2BEventList);

            // confirmed = await NotifyOrganiser.sendOrganiserBookingNotification(
            //     details,
            //     roomName[0].RoomName,
            //     Amenity
            // );

            // if (confirmed) {
            //     console.log("\nMeeting Room Confirmed! Check Mailbox.");
            // } else {
            //     console.log("\nCould NOT Confirm Meeting Room.");
            // }

            console.log("\nGLOBAL OPTIMIZATION COMPLETED.");
        }
    })


})