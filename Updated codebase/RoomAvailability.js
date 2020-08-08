var fs = require ('fs');
var mysql = require('mysql');
var express = require('express');

//Configure Database
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cos301"
});


//connecting to db
// connection.connect(function(err) {
//     if (err){
//         throw err;
//     }

//     else{
//         console.log("Connected!");
//     }

// });

module.exports = {
    //Functions for querying the database

    checkAvailability : async function(room_ID,sTime,eTime)
    {
        var avail = false;
        var id = "";

        return new Promise(function(resolve, reject)
        {
            var sql1 ="SELECT * FROM meetings WHERE RoomID = '" + room_ID + "'";
            connection.query(sql1,function(err1,result1)
            {
                if(err1)
                {
                    console.log(err1);
                    return reject();
                }
                else
                {
                    console.log("Processing");
                    if(result1.length == 0)
                    {
                        console.log("CASE 00: room available");//CASE 00 AVAILABE(Room was never booked)
                        avail = true;
                        return resolve(avail);

                    }
                    else
                    {
                                    
                        for(var index = 0; index < result1.length;index++)
                        {
                            //==============CHECK IF START TIMES ARE DIFFERENT=================//
                            console.log(result1[index].StartTime +" == "+ sTime);
                            var start_diff = result1[index].StartTime - sTime;
                            start_diff = Math.floor(start_diff / 60e3);
                            console.log(start_diff);
                            //=================================================================//

                            if(start_diff == 0)//same start time 
                            {
                                console.log("CASE 1: Sorry, room not available");//CASE 1 AVAILABE(new meeting starts at the same time as booked meeting)
                                avail = false;
                                id = "";
                                return resolve(avail);
                            }
                            else
                            {
                
                                if((sTime - result1[index].EndTime) == 0)
                                {
                                    console.log("CASE 2: Room is available");//CASE 2 AVAILABE(new meeting starts immediately after booked meeting ends)
                                    avail = true;
                                    id = result1[index].RoomID;
                                    
                                }
                                //==============CHECK IF MEETINGS OVERLAP=================//
                                var mid_diff = eTime - result1[index].StartTime;
                                mid_diff =  Math.floor(mid_diff / 60e3);
                                if(start_diff > 0 && mid_diff > 0)//CASE 2 NOT AVAILABE(new meeting starts earlier than booked but ends after booked meeting has started)
                                {
                                    console.log("CASE 2: Sorry, room not available");
                                    avail = false;
                                    id = "";
                                   return resolve(avail);
                                }
                                else if(start_diff > 0 && mid_diff < 0)//CASE 3 AVAILABE(new meeting starts earlier than booked and ends before booked meeting has started)
                                {
                                    console.log("CASE 3: Room is available");
                                    avail = true;
                                    id = result1[index].RoomID;
                                    
                                }
                                
                                var mid_diff = result1[index].EndTime - sTime;
                                mid_diff =  Math.floor(mid_diff / 60e3);
                                if(start_diff < 0 && mid_diff > 0)//CASE 4 NOT AVAILABE(booked meeting starts earlier than new but ends after booked meeting has started)
                                {
                                    console.log("CASE 4: Sorry, room not available");
                                    avail = false;
                                    id = "";
                                    return resolve(avail);
                                }
                                else if(start_diff < 0 && mid_diff < 0)//CASE 5 AVAILABE(booked meeting starts earlier than new and ends before new meeting has started)
                                {
                                    console.log("CASE 5: Room is available");
                                    avail = true;
                                    id = result1[index].RoomID;
                                   
                                }
                                
                            }

                        }
                        return resolve(avail);
                    }
                }
            });
            
        });
    }

};