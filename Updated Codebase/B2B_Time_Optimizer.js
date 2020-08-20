var mysql = require("mysql");
var express = require("express");
const DatabaseQuerries = require("./DatabaseQuerries");

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
        console.log("\nConnected To Database For B2B Optimization!");
    }
});

// Given JSON object
module.exports = {
    CalculateEndTimes: async function async(B2bEventDetails) {
        console.log("\nEntered Calculate EndTimes Function");

        // For each event, for each attendee calcuate distance from current event room to each employees next
        // location.
        var listSize = B2bEventDetails.Events.length; // Number of events identified as B2B
        for (var i = 0; i < listSize; i++) {
            var meetingID = B2bEventDetails.Events[i].CurrentMeetingID;
            var currentRoom = B2bEventDetails.Events[i].CurrentMeetingRoom;
            var NoOfAttendees = B2bEventDetails.Events[i].Attendees.length;
            var maxDist = 0;
            var maxAttendee;
            for (var j = 0; j < NoOfAttendees; j++) {
                console.log("\nATTENDEE = " + JSON.stringify(B2bEventDetails.Events[i].Attendees[j]));
                var nextEventRoom = B2bEventDetails.Events[i].Attendees[j].NextMeetingRoom;

                // NOTE TO ABU: Check FindDistances and adjust accordingly. Remove SUCCESS/ERROR comments after fixing.

                //var distance = await DatabaseQuerries.FindDistances(nextEventRoom,currentRoom); //TODO Check DBQueries for this specific
                // var distance = await DatabaseQuerries.FindDistances("*", nextEventRoom).then((res) => {
                //     if (res > maxDist) {
                //         maxDist = res;
                //         maxAttendee = B2bEventDetails.Events[i].Attendees[j].Email;
                //     }
                // }); // See if parameters match
            }

            var time = await module.exports.getTimeFromAttSpeed(maxDist, maxAttendee);

            var endTime = await DatabaseQuerries.getMeetingEndTime(meetingID);

            var cTime = new Date(endTime);
            time = time * 1000; // To get seconds
            cTime = cTime.getTime();
            cTime = cTime - time;
            cTime.setTime(cTime);
            cTime = cTime.toISOString;
            var status = await module.exports.adjustEventTimeInDB(meetingID, cTime);

            var cStatus = await module.exports.adjustTimeinCalendar(cTime, meetingID);
        }
        console.log("\nExited Calculate EndTimes Function");
    },
    getTimeFromAttSpeed: function async(maxDist, attendee) {
        // Select FROM Employee table column for attendee get avg speed
        return new Promise((resolve, reject) => {
            var sqlQuery = "SELECT * FROM EmployeeDetails WHERE EmpEmail = '" + attendee + "'";
            connection.query(sqlQuery, function (err, data) {
                if (err) {
                    return reject(new Error(err));
                } else {
                    var attSpeed = data.AverageSpeed;
                    var time = maxDist / attSpeed + 120; // Add extra 60 seconds
                    return resolve(time);
                }
                // maxDistance / attendee.avgSpeed;
                // return time in seconds
            });
        });
    },

    adjustEventTimeInDB: function async(MeetingId, timeAdj) {
        var sqlQuery = "UPDATE meetings SET EndTime = '" + timeAdj + "' + WHERE MeetingId = '" + MeetingId + "'";
        return new Promise((resolve, reject) => {
            connection.query(sqlQuery, function (err, data) {
                if (err) {
                    return reject(new Error(err));
                } else {
                    return resolve("Meeting Time Updated In DB");
                }
                // maxDistance / attendee.avgSpeed;
                // return time in seconds
            });
        });

        // Select eventID from Meetings table
        // Get Organizer
        //Patch with end Time - TimeAdj
        // Update DB with end time
        // Check if still B2B ( 10 mins not going to work well, find other method )
    },

    adjustTimeinCalendar: async function (adjTime, meetingId) {
        var sqlQuery = "SELECT * FROM meetings where MeetingID = '" + meetingId + "'";
        connection.query(sqlQuery, function (err, data) {
            if (err) {
                return reject(new Error(err));
            } else {
                var organizer = data.Organizer;
                // get EventId of specific organizer
                // TODO Export UpdateLocation.GetMeetingId(access,orgId,subject,time)
                return new Promise(async function (resolve, reject) {
                    const client = MicrosoftGraph.Client.init({
                        defaultVersion: "v1.0",
                        debugLogging: true,
                        authProvider: (done) => {
                            done(null, accessToken);
                        },
                    });
                    const _newEndTime = {
                        end: {
                            dateTime: adjTime,
                        },
                    };
                    client
                        .api("/users/" + orgid + "/calendar/events/" + meetingID)
                        .patch(_newEndTime)
                        .then((res) => {
                            console.log("Exit update 1 \n");
                            console.log("Location Update successful");
                            return resolve("Meeting time updated in Calendar " + res);
                        })
                        .catch((err) => {
                            console.log(err);
                            console.log("Exit update 2 \n");
                            reject(err);
                        });
                });
            }
            // maxDistance / attendee.avgSpeed;
            // return time in seconds
        });
    },
};
