var mysql = require("mysql");
var express = require("express");

// Configure Database
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cos301",
});

// Connecting to Database
connection.connect(function (err) {
    if (err) {
        throw err;
    } else {
        console.log("\nConnected To Database For Global Optimization!");
    }
});

async function printResults() {
    // run the back to back function
    var backToback = await getBackToBackList();
   // console.log("FUNCTION RUNNING AS INTENDED:");
    for (var x = 0; x < backToback.Events.length; x++) {
        console.log("=> " + JSON.stringify(backToback.Events[x]));
    }
    console.log("\n");
}

printResults();

// global variable for storing all meetings
// initialised in getAttendeeList() function
var arrMeetings;

var B2BEvents = {
    Events: [],
};

module.exports = {

    getBackToBackList: async function () {
    // retrieve 2D arrray:
    var list = await getAttendeeList().then((res) => res);
    return new Promise((resolve, reject) => {
        // initialize eventCount:
        var eventCount = 0;

        // Array to store meeting room IDs:
        var arrRooms = [];

        var backToBackList = [];

        // Console log the first two meeting start and end times -- to be removed:
       // console.log("\nTESTING START & END TIMES FOR FIRST TWO MEETINGS:");
       // console.log("MEETING (0) END TIME:\n=>	" + arrMeetings[0].EndTime + "\nMEETING (1) START TIME:\n=>	" + arrMeetings[1].StartTime + "\n");

        // variable to store each employee in Meeting N-1, as we search for that employee in Meeting N:
        var employee;

        // flag for 10 minute grace period between meetings, for a meeting to qualify as back to back:
        var NextMeetingstartsWithinTenMinutes = false;

        for (var x = 0; x < list.length - 1; x++) {
            B2BEvents.Events[eventCount] = {
                CurrentMeetingRoom: "",
                Attendees: [],
                NextMeetingRoom: "",
            };

            for (var b = x + 1; b < list.length; b++) {
                NextMeetingstartsWithinTenMinutes = arrMeetings[b].StartTime.getTime() - arrMeetings[x].EndTime.getTime() <= 600000;

                if (NextMeetingstartsWithinTenMinutes)
                    for (var y = 0; y < list[x].length; y++) {
                        employee = list[x][y];
                        if (list[b].includes(employee)) {
                            if (!backToBackList.includes(employee)) backToBackList.push(employee);

                            // add employee to JSON object of events:
                            B2BEvents.Events[eventCount].Attendees.push(employee);

                            // Push RoomIDs into array for later use:
                            arrRooms.push(arrMeetings[x].RoomID);
                            arrRooms.push(arrMeetings[b].RoomID);
                        }
                    }
            }

            // if events were valid and back to back:
            if (B2BEvents.Events[eventCount].Attendees.length > 0) {
                // Add rooms to JSON object of event:
                B2BEvents.Events[eventCount].NextMeetingRoom = arrRooms.pop();
                B2BEvents.Events[eventCount].CurrentMeetingRoom = arrRooms.pop();
                eventCount++;
            } else delete B2BEvents.Events[eventCount];
        }

        console.log("\nLIST OF MEMBERS INVOLVED IN BACK TO BACK MEETINGS:\n=>	" + backToBackList + "\n");
        console.log("\nLIST OF EVENTS:");
        for (var x = 0; x < eventCount; x++) {
            console.log("=>   Event " + x + ": " + JSON.stringify(B2BEvents.Events[x]));
        }
        if(eventCount==0){
        console.log("\nBack To Back case not present\n");
        // if there are no events:
      // return reject(" Err: No B2B events present");
        }
        else {
        console.log("\nBack To Back Identified\n");
        //eliminate all the null values from the data
        B2BEvents.Events = B2BEvents.Events.filter(function (x) {
            return x !== null;
        });
        // nelse return the events:
        return resolve(B2BEvents);
    }

       

        
    });
    }
};
async function getAttendeeList() {
    return new Promise((resolve, reject) => {
        var sqlQuery = "SELECT * FROM meetings";

        connection.query(sqlQuery, function (err, attendeeList) {
            if (err) {
                return reject(new Error(err));
            } else {
                // Get the participants including COS301 monitoring account, and store in 2D array:
                arrMeetings = new Array(attendeeList.length);
                for (var x = 0; x < attendeeList.length; x++) arrMeetings[x] = attendeeList[x];

                var PreliminaryParticipants = [];
                var Participants = new Array(attendeeList.length);

                for (var row = 0; row < attendeeList.length; row++) {
                    // Put the attendees in an array:
                    PreliminaryParticipants[row] = attendeeList[row].Participants.trim().split(",");
                    Participants[row] = new Array(PreliminaryParticipants[row].length - 1);

                    // columns for participants, after removing COS301 monitoring account:
                    var colParticipants = 0;

                    // remove TeamThreshold and store participants in lowercase:
                    for (var col = 0; col < PreliminaryParticipants[row].length; col++) {
                        if (PreliminaryParticipants[row][col].toLowerCase() != "cos301@teamthreshold.onmicrosoft.com") {
                            Participants[row][colParticipants++] = PreliminaryParticipants[row][col].toLowerCase();
                        }
                    }
                }
                console.log("\nALL PARTICIPANTS:\n=>	" + Participants);

                // return a 2D array of Participants:
                return resolve(Participants);
            }
        });
    });
}
