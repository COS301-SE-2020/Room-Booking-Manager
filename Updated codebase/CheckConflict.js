var mysql = require('mysql');
var express = require('express');
var bodyParser= require('body-parser');
var app = express();

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
  
//start(organiser,stime,etime);
module.exports = {
    start: async function(organiser,stime,etime){
        return new Promise(async function(resolve, reject)
        {
            var valid = await conflict(organiser,stime,etime).then(res=>res);
            if(valid)
            {
                console.debug("New Meeting is valid");
            }
            else
            {
                console.debug("New Meeting is not valid");
            }
            return resolve(valid);
        });
    }
};
async function conflict(organizer, sTime,eTime)
{ 
    var result = [];
    var book = false;
    sTime = new Date(sTime);
    eTime = new Date(eTime);
    console.log("Started function");
    console.debug(organizer+" --- "+sTime+" --- "+eTime)
	 return new Promise(async function(resolve, reject)
     {
		var sql1 ="SELECT * FROM meetings WHERE Organizer = '" + organizer + "'";
        await connection.query(sql1,function(err1,result1)
        {
            if(err1)
            {
                console.log(err1);
                return reject();
            }
            else
            {
                // console.debug(result1);
                // console.debug(result1[0].RoomID);
                if(result1.length == 0)
                {
                    console.log("CASE 00: No meeting by organizer found; You can book");//CASE 00(Organizer never booked)
                    book = true;
                    return resolve(book);

                }
                else
                {
                    for(var index = 0; index < result1.length;index++)
                    {
                        var start_diff = result1[index].StartTime - sTime;
                        start_diff = Math.floor(start_diff / 60e3);
                        console.log(start_diff);

                        if(start_diff == 0)//same start time 
                        {
                            console.log("CASE 1: Sorry, You already booked for this time");//CASE 1 (new meeting starts at the same time as booked meeting)
                            book = false;
                            return resolve(book);
                        }
                        else
                        {
            
                            if((sTime - result1[index].EndTime) == 0)
                            {
                                console.log("CASE 2:(Meeting starts after) You can book");//CASE 2 (new meeting starts immediately after booked meeting ends)
                                book = true;
                                // id = result1[index].RoomID;
                                
                            }
                            //==============CHECK IF MEETINGS OVERLAP=================//
                            
                            var mid_diff = eTime - result1[index].StartTime;
                            mid_diff =  Math.floor(mid_diff / 60e3);
                            if(start_diff > 0 && mid_diff > 0)//CASE 3 (new meeting starts earlier than booked but ends after booked meeting has started)
                            {
                                console.log("CASE 3: Sorry, This meeting ends after an existing meeting you've booked for has started");
                                book = false;
                                return resolve(book);
                            }
                            else if(start_diff > 0 && mid_diff < 0)//CASE 4(new meeting starts earlier than booked and ends before booked meeting has started)
                            {
                                console.log("CASE 4:(Meeting starts & ends earlier) You can book");
                                book = true;
                                
                            }
                            
                            var mid_diff = result1[index].EndTime - sTime;
                            mid_diff =  Math.floor(mid_diff / 60e3);
                            if(start_diff < 0 && mid_diff > 0)//CASE 5 (booked meeting starts earlier than new but ends after booked meeting has started)
                            {
                                console.log("CASE 5: Sorry, an existing meeting ends after this new one has started");
                                book = false;
                                return resolve(book);
                            }
                            else if(start_diff < 0 && mid_diff < 0)//CASE 6 AVAILABE(booked meeting starts earlier than new and ends before new meeting has started)
                            {
                                console.log("CASE 6:(Meeting starts after) You can book");
                                book = true;
                            }
                            
                        }
                    }
                    return resolve(book);
                }
            }
        });
	});
};
