var mysql = require("mysql");
var express = require("express");
var bodyParser = require("body-parser");
var nodemailer = require("nodemailer");
var app = express();

// Configure Database
var connection = mysql.createConnection({
    host: "rbm-database.cu40lo4as93d.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "thresh#301",
    database: "RBM",
});

// Connecting to Database
connection.connect(function (err) {
    if (err) {
        throw err;
    } else {
        console.log("\nConnected To Database For Meeting Room Confirmation!\n");
    }
});

var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "cos301.teamthreshold@gmail.com",
        pass: "Threshold#301",
    },
});

module.exports = {
    // getRoomName: async function (RoomID) {
    //     return new Promise((resolve, reject) => {
    //         var sqlQuery = "SELECT * FROM floorplan WHERE RoomID = '" + RoomID + "';";
    //         connection.query(sqlQuery, function (err, Room) {
    //             if (err) {
    //                 console.log("\nGET ROOM NAME NOT FOUND!");
    //                 return reject(new Error(err));
    //             } else {
    //                 console.log("\nGET ROOM NAME FOUND!");
    //                 console.log(Room[0].RoomName);
    //                 return resolve(Room[0].RoomName);
    //             }
    //         });
    //     });
    // },

    sendOrganiserBookingNotification: async function (extractedDetails, RoomName, Amenity) {
        return new Promise(async (resolve, reject) => {
            console.log("Sending the email notification!");

            // Send confirmation notification:
            var message =
                " Has Been Reserved For Your Meeting On " +
                new Date(extractedDetails.Start) +
                " Until " +
                new Date(extractedDetails.End) +
                " With Subject Line (" +
                extractedDetails.Subject +
                ") and Amenities (" +
                Amenity +
                ")";

            var roomStatement = "Room (" + RoomName + ")";

            var mailOptions = {
                from: "cos301.teamthreshold@gmail.com",
                to: extractedDetails.Organizer,
                subject: "[Automated] Meeting Room Confirmation",
                text: roomStatement + message,
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                    return reject(false);
                } else {
                    console.log("\nConfirmation Email Sent: " + info.response);
                    return resolve(true);
                }
            });
        });
    },
};
