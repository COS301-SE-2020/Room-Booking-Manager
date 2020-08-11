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

// run the back to back function
getBackToBackList();

// global variable for storing all meetings
// initialised in getAttendeeList() function
var arrMeetings;

// global array for storing back to back meeting IDs
var arrB2bMeetingIDs = [];

async function getBackToBackList() {
    // retrieve 2D arrray:
    var list = await getAttendeeList().then((res) => res);
    var backToBackList = [];

    // Console log the first two meeting start and end times -- to be removed:
    console.log("\nSTART & END TIMES FOR FIRST TWO MEETINGS:");
    console.log("=>	" + arrMeetings[0].EndTime + "\n=>	" + arrMeetings[1].StartTime + "\n");

    // variable to store each employee in Meeting N-1, as we search for that employee in Meeting N:
    var employee;

    // flag for back to back:
    var b2b = false;

    for (var x = 0; x < list.length - 1; x++) {
        b2b = JSON.stringify(arrMeetings[x].EndTime) == JSON.stringify(arrMeetings[x + 1].StartTime);
        for (var y = 0; y < list[x].length; y++) {
            employee = list[x][y];
            if (list[x + 1].includes(employee) && !backToBackList.includes(employee) && b2b) {
                backToBackList.push(employee);

                // Add only if the ID has not been added:
                if (!arrB2bMeetingIDs.includes(arrMeetings[x].MeetingID))
                    arrB2bMeetingIDs.push(arrMeetings[x].MeetingID);
                if (!arrB2bMeetingIDs.includes(arrMeetings[x + 1].MeetingID))
                    arrB2bMeetingIDs.push(arrMeetings[x + 1].MeetingID);
            }
        }
    }

    console.log("\nLIST OF MEMBERS INVOLVED IN BACK TO BACK MEETINGS:\n=>	" + backToBackList + "\n");
    console.log("B2B MEETING IDs:\n=>	" + arrB2bMeetingIDs + "\n");
    console.log("Back To Back Solved.\n");

    return backToBackList;
}

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
                        if (
                            PreliminaryParticipants[row][col].toLowerCase() !=
                            "cos301@teamthreshold.onmicrosoft.com"
                        ) {
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
