var fs = require("fs");
var mysql = require("mysql");
var express = require("express");
var RoomAvailability = require("./RoomAvailability");

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
        console.log("Connected To Database For GetRooms Function!");
    }
});

module.exports = {
    //Functions for querying the database

    getRooms: async function (amenity, capacity, sTime, eTime) {
        var feasibleRooms = [];
        return new Promise(async function (resolve, reject) {
            var capRooms = await checkRoom(amenity, capacity).then((res) => res);
            if (capRooms.length > 0) {
                for (var i = 0; i < capRooms.length; i++) {
                    //check if room can accommodate attendees
                    console.log("\n" + capRooms[i].RoomName + " Can Accommodate " + capacity);

                    console.log("Check Availability Of " + capRooms[i].RoomID + "--" + capRooms[i].RoomName);
                    var available = await RoomAvailability.checkAvailability(capRooms[i].RoomID, sTime, eTime).then(
                        (res) => res
                    );
                    if (available) {
                        console.log("Room " + capRooms[i].RoomID + " is Available.");
                        feasibleRooms.push(capRooms[i].RoomID);
                    }
                    console.log("Check Availability Done.");
                    console.log("\n=======================\n");
                }
                return resolve(feasibleRooms);
            } else {
                return reject(["NoRoom"]);
                console.log("\nNo Rooms Found.");
            }
        });
    },
};

async function checkRoom(amenity, capacity) {
    return new Promise(async function (resolve, reject) {
        var availRooms = [];
        var sql;
        if (amenity == "") {
            sql = "SELECT * FROM floorplan WHERE maxSeats = " + capacity;
        } else {
            sql = "SELECT * FROM floorplan WHERE " + amenity + " = '1' AND maxSeats = " + capacity;
        }
        await connection.query(sql, async function (err, result) {
            if (err) {
                console.log(err);
                return reject();
            } else {
                if (result.length > 0) {
                    availRooms = result;
                    //return resolve(availRooms);
                } else {
                    // console.debug("EVERY ROOM BY AMENITY ");
                    availRooms = await getAll(amenity, capacity).then((res) => res);
                }
                return resolve(availRooms);
            }
        });
    });
}

async function getAll(amenity, capacity) {
    var allRooms = [];
    var sql1;
    return new Promise(async function (resolve, reject) {
        if (amenity == "") {
            sql1 = "SELECT * FROM floorplan ORDER BY maxSeats";
        } else {
            sql1 = "SELECT * FROM floorplan WHERE " + amenity + " = '1' ORDER BY maxSeats";
        }
        // var sql1 = "SELECT * FROM floorplan WHERE " + amenity + " = '1' ORDER BY maxSeats";
        await connection.query(sql1, async function (err1, result1) {
            if (err1) {
                console.log(err1);
                return reject();
            } else {
                // console.debug("EVERY ROOM BY AMENITY2 " + amenity + "--" + capacity);
                // console.debug(result1);
                allRooms = await nextFeasible(result1, amenity, capacity).then((res) => res);
                //console.debug(allRooms);
                return resolve(allRooms);
            }
        });
    });
}

async function nextFeasible(rooms, amenity, capacity) {
    return new Promise(async function (resolve, reject) {
        var avRooms = [];
        var i = rooms.length;
        var sql2;
        // console.debug(i);
        // console.debug(rooms);
        i = --i;
        while (rooms[i] != undefined && rooms[i].maxSeats > capacity) {
            i = --i;
        }
        // console.debug(rooms[++i]);
        i = ++i;
        // console.debug(capacity + " ==== " +rooms.length +"=="+rooms[i].maxSeats)
        if (amenity == "") {
            sql2 = "SELECT * FROM floorplan WHERE maxSeats = '" + rooms[i].maxSeats + "'";
        } else {
            sql2 = "SELECT * FROM floorplan WHERE " + amenity + " = '1' AND maxSeats = '" + rooms[i].maxSeats + "'";
        }
        // var sql2 = "SELECT * FROM floorplan WHERE " + amenity + " = '1' AND maxSeats = '" + rooms[i].maxSeats + "'";
        await connection.query(sql2, async function (err2, result2) {
            if (err2) {
                console.log(err2);
                return reject();
            } else {
                // console.debug(result2);
                if (result2.length > 0) {
                    avRooms = result2;
                } else {
                    // avRooms = await nextFeasible(rooms,amenity,rooms[i].maxSeats).then(res=>res);
                }
                return resolve(avRooms);
            }
        });
    });
}
