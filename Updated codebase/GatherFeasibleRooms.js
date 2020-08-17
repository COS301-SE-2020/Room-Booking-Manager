var mysql = require("mysql");
var express = require("express");
var bodyParser = require("body-parser");
// var Promise = require('bluebird');
var GetRooms = require("./GetRooms");
var app = express();

module.exports = {
    //Functions for querying the database
    feasibleRooms: [],

    getFeasibleRooms: async function (amenity, capacity, stime, etime) {
        console.log("Started function");
        return new Promise(async function (resolve, reject) {
            //get all the rooms with matching amenities
            try {
                stime = new Date(stime);
                etime = new Date(etime);
                await GetRooms.getRooms(amenity, capacity, stime, etime).then((res) => res);
                console.log("done");

                // console.log(feasibleRooms);
                let unique = new Set(feasibleRooms);
                // console.log(unique);
                feasibleRooms = Array.from(unique);

                return resolve(feasibleRooms);
            } catch (err) {
                console.log(err);
                return reject(err);
            }
        });
    },
};
