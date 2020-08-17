var mysql = require("mysql");
var express = require("express");
var bodyParser = require("body-parser");
var nodemailer = require("nodemailer");
var app = express();

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
    getRoomName: async function (RoomID) {
        return new Promise((resolve, reject) => {
            var sqlQuery = "SELECT * FROM floorplan WHERE RoomID = '" + RoomID + "';";
            connection.query(sqlQuery, function (err, Room) {
                if (err) {
                    console.log("\nGET ROOM NAME NOT FOUND!");
                    return reject(new Error(err));
                } else {
                    console.log("\nGET ROOM NAME FOUND!");
                    console.log(Room[0].RoomName);
                    return resolve(Room[0].RoomName);
                }
            });
        });
    },
    sendOrganiserBookingNotification: async function (message, organiser, RoomID) {
        return new Promise(async (resolve, reject) => {
            console.log("\n\nCHECKING ROOM NAME!");

            var room = await getRoomName(RoomID);
            var roomStatement = "Room (" + room + ")";

            console.log("\nROOM NAME CHECKED!");

            var mailOptions = {
                from: "cos301.teamthreshold@gmail.com",
                to: organiser,
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
