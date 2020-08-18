var mysql = require("mysql");
var express = require("express");
const e = require("express");

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

// JSON to return
var B2BEvents = {
    Events: [
        {
            CurrentMeetingID: null,
            CurrentMeetingRoom: null,
            Attendees: new Array(),
        },
    ],
};

function findJSONIndex(JSONFile, EmployeeArray) {
    // FORMAT: CurrentMeetingID, CurrentMeetingRoom, NextMeetingID, NextMeetingRoom, Email

    if (JSONFile.Events.length > 1 && JSONFile.Events[0].CurrentMeetingID != null) {
        for (var x = 0; x < JSONFile.Events.length; x++) {
            if (
                JSONFile.Events[x].CurrentMeetingID == EmployeeArray[0] &&
                JSONFile.Events[x].CurrentMeetingRoom == EmployeeArray[1]
            )
                return x;
        }
    } else return -1;
}

async function getAttendeeList() {
    return new Promise((resolve, reject) => {
        var sqlQuery = "SELECT * FROM meetings;";

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
                            Participants[row][colParticipants++] = PreliminaryParticipants[row][col]
                                .toLowerCase()
                                .trim();
                        }
                    }
                }

                // return a 2D array of Participants:
                return resolve(Participants);
            }
        });
    });
}

// global variable for storing all meetings
// initialised in getAttendeeList() function
var arrMeetings;

module.exports = {
    checkBackToBack: async function (JSONFile) {
        if (JSONFile.Events.length >= 1 && JSONFile.Events[0].CurrentMeetingID != null) return true;
        return false;
    },

    getBackToBackList: async function () {
        // retrieve 2D arrray:
        var list = await getAttendeeList().then((res) => res);
        return new Promise((resolve, reject) => {
            // initialize eventCount:
            var eventCount = 0;

            // Console log the first two meeting start and end times -- to be removed:
            console.log("\nTESTING START & END TIMES FOR FIRST TWO MEETINGS:");
            console.log(
                "MEETING (0) END TIME:\n=>	" +
                    arrMeetings[0].EndTime +
                    "\nMEETING (1) START TIME:\n=>	" +
                    arrMeetings[1].StartTime +
                    "\n"
            );

            // variable to store each employee in Meeting N-1, as we search for that employee in Meeting N:
            var employee;

            // flag for 10 minute grace period between meetings, for a meeting to qualify as back to back:
            var NextMeetingstartsWithinTenMinutes = false;

            console.log("MEETINGS ATTENDEES LIST:");
            for (var z = 0; z < list.length; z++) console.log("MEETING " + (z + 1) + "    =>   " + list[z]);

            var arrStoreEmployees = [];

            for (var originalRow = 0; originalRow < list.length - 1; originalRow++) {
                for (var x = 0; x < list[originalRow].length; x++) {
                    for (var compareRow = originalRow + 1; compareRow < list.length; compareRow++) {
                        var total =
                            arrMeetings[compareRow].StartTime.getTime() - arrMeetings[originalRow].EndTime.getTime();

                        NextMeetingstartsWithinTenMinutes = total >= 0 && total <= 60000;

                        if (NextMeetingstartsWithinTenMinutes) {
                            employee = list[originalRow][x];
                            if (list[compareRow].includes(employee)) {
                                // FORMAT: CurrentMeetingID, CurrentMeeting Room, NextMeetingID, NextMeetingRoom, Email
                                arrStoreEmployees.push(
                                    arrMeetings[originalRow].MeetingID +
                                        "#" +
                                        arrMeetings[originalRow].RoomID +
                                        "#" +
                                        arrMeetings[compareRow].MeetingID +
                                        "#" +
                                        arrMeetings[compareRow].RoomID +
                                        "#" +
                                        employee
                                );
                            }
                        }
                    }
                }
            }

            // store in JSON:
            for (var x = 0; x < arrStoreEmployees.length; x++) {
                var tempEmployee = arrStoreEmployees[x].trim().split("#");

                var countIndex = findJSONIndex(B2BEvents, tempEmployee);

                // FORMAT: CurrentMeetingID, CurrentMeeting Room, NextMeetingID, NextMeetingRoom, Email

                var entry = {
                    Email: tempEmployee[4],
                    NextMeetingID: tempEmployee[2],
                    NextMeetingRoom: tempEmployee[3],
                };

                if (countIndex >= 0) {
                    B2BEvents.Events[countIndex].Attendees.push(entry);
                } else {
                    B2BEvents.Events[eventCount++] = {
                        CurrentMeetingID: tempEmployee[0],
                        CurrentMeetingRoom: tempEmployee[1],
                        Attendees: [entry],
                    };
                }
            }

            console.log("\nLIST OF MEMBERS INVOLVED IN BACK TO BACK MEETINGS:");
            var tempArray = [];
            for (var x = 0; x < arrStoreEmployees.length; x++)
                tempArray.push(arrStoreEmployees[x].trim().split("#")[4]);
            var uniqueAttendees = Array.from(new Set(tempArray));
            for (var x = 0; x < uniqueAttendees.length; x++) console.log("=> " + uniqueAttendees[x]);

            // List the back to back events:
            toStringB2B();

            console.log("\nBack To Back Solved!\n");

            return resolve(B2BEvents);
        });
    },

    toStringB2B: async function () {
        console.log("\nLIST OF BACK TO BACK EVENTS:");
        for (var x = 0; x < B2BEvents.Events.length; x++) {
            console.log("\nCurrentMeetingID : " + B2BEvents.Events[x].CurrentMeetingID);
            console.log("CurrentMeetingRoom : " + B2BEvents.Events[x].CurrentMeetingRoom);
            console.log("Attendees : ");
            console.log(B2BEvents.Events[x].Attendees);
        }
    },
};
