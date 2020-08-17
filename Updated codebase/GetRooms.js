var fs = require ('fs');
var mysql = require('mysql');
var express = require('express');
var RoomAvailability = require ('./RoomAvailability');

//Configure Database
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cos301"
});


//connecting to db
connection.connect(function(err) {
    if (err){
        throw err;
    }

    else{
        console.log("Connected!");
    }

});

module.exports = {
    //Functions for querying the database

    getRooms : async function(amenity, capacity,sTime,eTime)
    {
        feasibleRooms = [];
        return new Promise(async function(resolve, reject)
        {
            var capRooms = await checkRoom(amenity,capacity).then(res=>res);
            if(capRooms.length > 0)
            {
                for(var i = 0; i < capRooms.length; i++)
                {
                    
                    //check if room can accommodate attendees
                    console.log(capRooms[i].RoomName + " can accommodate " + capacity);
                    
                    console.log("checkAvailability of " + capRooms[i].RoomID + "--" + capRooms[i].RoomName);
                    var available = await RoomAvailability.checkAvailability(capRooms[i].RoomID,sTime,eTime).then(res=>res);
                    if(available)
                    {
                        console.log("Room "+ capRooms[i].RoomID +" available");
                        feasibleRooms.push(capRooms[i].RoomID);
                    }
                    console.log("checkAvailability done");
                    console.log("=======================");
                }
                return resolve(feasibleRooms);
            }
            else
            {
                console.log("No rooms found");
            }
        });
    }

};

async function checkRoom(amenity,capacity)
{
    return new Promise(async function(resolve, reject)
    {
        var availRooms = [];
        var sql ="SELECT * FROM floorplan WHERE Amenity LIKE '%" + amenity + "%' AND maxSeats = " + capacity;
        await connection.query(sql,async function(err,result)
        {
            if(err)
            {
                console.log(err);
                return reject();
            }
            else
            {
                if(result.length > 0)
                {
                    availRooms = result;
                    //return resolve(availRooms);
                }
                else
                {
                    // console.debug("EVERY ROOM BY AMENITY ");
                    availRooms = await getAll(amenity,capacity).then(res=>res);
                }
                return resolve(availRooms);
            }
        });
    });
}

async function getAll(amenity,capacity)
{
    var allRooms = [];
    return new Promise(async function(resolve, reject)
    {
        var sql1 ="SELECT * FROM floorplan WHERE Amenity LIKE '%" + amenity + "%' ORDER BY maxSeats";
        await connection.query(sql1,async function(err1,result1)
        {
            if(err1)
            {
                console.log(err1);
                return reject();
            }
            else
            {
                // console.debug("EVERY ROOM BY AMENITY2 " + amenity + "--" + capacity);
                // console.debug(result1);
                allRooms = await nextFeasible(result1,amenity,capacity).then(res=>res);
                //console.debug(allRooms);
                return resolve(allRooms);
            }
        });
    });
}

async function nextFeasible(rooms,amenity,capacity)
{
    return new Promise(async function(resolve, reject)
    {
        
        var avRooms = [];
        var i = rooms.length;
        // console.debug(i);
        // console.debug(rooms);
        i = --i;
        while (rooms[i] != undefined && rooms[i].maxSeats > capacity){i = --i;}
        // console.debug(rooms[++i]);
        i = ++i;
        // console.debug(capacity + " ==== " +rooms.length +"=="+rooms[i].maxSeats)
        var sql2 ="SELECT * FROM floorplan WHERE Amenity LIKE '%" + amenity + "%' AND maxSeats = '" + rooms[i].maxSeats + "'";
        await connection.query(sql2, async function(err2,result2)
        {
            if(err2)
            {
                console.log(err2);
                return reject();
            }
            else
            {
                // console.debug(result2);
                if(result2.length > 0)
                {
                   
                    avRooms = result2;
                }
                else
                {                   
                    // avRooms = await nextFeasible(rooms,amenity,rooms[i].maxSeats).then(res=>res);
                }
                return resolve(avRooms);
            }
        });
    });
}