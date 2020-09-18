var fs = require("fs");
var mysql = require("mysql");
var express = require("express");

//Configure Database
var connection = mysql.createConnection({
    host: "",
    user: "root",
    password: "",
    database: "cos301",
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
