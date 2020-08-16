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

// run the back to back function
getBackToBackList();

// global variable for storing all meetings
// initialised in getAttendeeList() function
var arrMeetings;

async function getBackToBackList() {
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

        // JSON to return
        var B2BEvents = {
            Events: [
                {
                    CurrentMeetingID: null,
                    CurrentMeetingRoom: null,
                    Attendees: new Array(),
                    NextMeetingID: null,
                    NextMeetingRoom: null,
                },
            ],
        };

        // flag for 10 minute grace period between meetings, for a meeting to qualify as back to back:
        var NextMeetingstartsWithinTenMinutes = false;

        console.log("MEETINGS ATTENDEES LIST:");
        for (var z = 0; z < list.length; z++) console.log("=>   " + list[z]);

        var arrStoreEmployees = [];

        for (var originalRow = 0; originalRow < list.length - 1; originalRow++) {
            for (var x = 0; x < list[originalRow].length; x++) {
                for (var compareRow = originalRow + 1; compareRow < list.length; compareRow++) {
                    NextMeetingstartsWithinTenMinutes =
                        arrMeetings[compareRow].StartTime.getTime() - arrMeetings[originalRow].EndTime.getTime() <=
                        600000;

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

            if (countIndex >= 0) {
                B2BEvents.Events[countIndex].Attendees.push(tempEmployee[4]);
            } else {
                B2BEvents.Events[eventCount++] = {
                    CurrentMeetingID: tempEmployee[0],
                    CurrentMeetingRoom: tempEmployee[1],
                    Attendees: [tempEmployee[4]],
                    NextMeetingID: tempEmployee[2],
                    NextMeetingRoom: tempEmployee[3],
                };
            }
        }

        console.log("\nLIST OF MEMBERS INVOLVED IN BACK TO BACK MEETINGS:");
        for (var x = 0; x < arrStoreEmployees.length; x++) {
            console.log("=> " + arrStoreEmployees[x].trim().split("#")[4]);
        }

        console.log("\nLIST OF EVENTS:");
        console.log(B2BEvents.Events);

        console.log("\nBack To Back Solved!\n");

        return resolve(B2BEvents);
    });
}

function findJSONIndex(JSONFile, EmployeeArray) {
    // FORMAT: CurrentMeetingID, CurrentMeetingRoom, NextMeetingID, NextMeetingRoom, Email

    if (JSONFile.Events.length > 0) {
        for (var x = 0; x < JSONFile.Events.length; x++) {
            if (JSONFile.Events[x].CurrentMeetingID != null) {
                if (
                    JSONFile.Events[x].CurrentMeetingID == EmployeeArray[0] &&
                    JSONFile.Events[x].CurrentMeetingRoom == EmployeeArray[1] &&
                    JSONFile.Events[x].NextMeetingID == EmployeeArray[2] &&
                    JSONFile.Events[x].NextMeetingRoom == EmployeeArray[3]
                )
                    return x;
                else return -1;
            } else {
                return -1;
            }
        }
    } else return -1;
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
