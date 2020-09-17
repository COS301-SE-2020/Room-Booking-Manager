var fs = require("fs");
var mysql = require("mysql");
var express = require("express");

//Configure Database
var connection = mysql.createConnection({
    host: "rbm-database.cu40lo4as93d.us-east-1.rds.amazonaws.com",
    user: "admin",
    password: "thresh#301",
    database: "RBM",
});

//connecting to db
connection.connect(function (err) {
    if (err) {
        throw err;
    } else {
        console.log("\nConnected To Database For Removing A Meeting!");
    }
});

module.exports = {
    //Functions for querying the database

    remove: async function (meetingID) {
        return new Promise(async function (resolve, reject) {
            var sql = "DELETE FROM meetings WHERE MeetingID = '" + meetingID + "';";
            await connection.query(sql, async function (err, result) {
                if (err) {
                    console.log(err);
                    return reject();
                } else {
                    console.log("Meeting removed");
                    return resolve();
                }
            });
        });
    },
};
