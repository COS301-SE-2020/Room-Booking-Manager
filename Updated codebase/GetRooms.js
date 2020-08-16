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
        //feasibleRooms = [];
        return new Promise(async function(resolve, reject)
        {
            var sql ="SELECT * FROM floorplan WHERE " + amenity + " = 1";
            await connection.query(sql, async function (err, result) 
            {
                if (err)
                {
                    console.log(err);
                    return reject();
                } 
                else
                {
                    
                    for(var i = 0; i < result.length; i++)
                    {
                        
                        //check if room can accommodate attendees
                        if(capacity <= result[i].maxSeats)
                        {
                            console.log(result[i].RoomName + " can accommodate " + capacity);
                            
                            console.log("checkAvailability of " + result[i].RoomID + "--" + result[i].RoomName);
                            var available = await RoomAvailability.checkAvailability(result[i].RoomID,sTime,eTime).then(res=>res);
                            if(available)
                            {
                                console.log("Room "+ result[i].RoomID +" available");
                                feasibleRooms.push(result[i].RoomID);
                            }
                            console.log("checkAvailability done");
                            console.log("=======================")
                            
                        }
                    }
                    return resolve();
                }
            });
         
        });
    }

};