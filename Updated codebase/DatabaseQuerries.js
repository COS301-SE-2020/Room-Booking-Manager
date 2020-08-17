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
connection.connect(function(err) {
    if (err){
        throw err;
    }

    else{
        console.log("Connected to DB!");
    }

});


module.exports = {
    //Functions for querying the database

    getLocation : async function(Attendees, startTime, endTime)
    {
        return new Promise((resolve, reject) => {
        
            var BackToBackEmp = [];
            var locationID = [];
            var noBackToBack = [];

            //Store a list of participants in other meetings in 2D array
            var participants = [];
            var found = false;

            //Initialize the times
            var sTime = new Date(startTime);
            var before = new Date(startTime);
            before.setMinutes(before.getMinutes() - 15);

            //Convert to string format for querying the database
            sTime = sTime.toISOString();
            before = before.toISOString();

            //Start database queries using times
            var sqlQuery = "SELECT * FROM Meetings WHERE EndTime >= '" + before +"' AND EndTime <= '" + startTime + "'";
            connection.query(sqlQuery, function (err, data) {
                if (err){

                    return reject(new Error(err));
                }
                else{

                    //Get Participants from table
                    for(var i = 0; i < data.length; i++)
                    {
                        participants.push(data[i].Participants.split(','))
                    }

                    //Cross reference to find Employees with Back To Back Meetings
                    for(var i =0; i < Attendees.length; i++)
                    {
                        for(var j = 0; j < participants.length; j++)
                        {
                            
                            for(var k = 0; k < participants[j].length; k++)
                            {
                                if(Attendees[i] == participants[j][k])
                                {
                                    //Store Employees with Back To Back Meetings
                                    BackToBackEmp.push(participants[j][k]);

                                    //Store Meeting Room ID 
                                    locationID.push(data[j].RoomID);
                                }
                            }
                        }
                    }

                    for(var i = 0; i < Attendees.length; i++)
                    {
                        for(var j = 0; j < BackToBackEmp.length; j++)
                        {
                            if(Attendees[i] == BackToBackEmp[j])
                            {
                                found = true;
                                
                            }
                        }

                        if(found == false)
                        {
                            noBackToBack.push(Attendees[i]);
                        }

                        found = false;
                    }
                }
                // for(var i = 0; i < emailAddress.length; i++)
                // {
                //     if(emailAddress[i] != "COS301@teamthreshold.onmicrosoft.com")
                //     {
                //         Email.push(emailAddress[i]);
                //     }
                // }

                //Get Location IDs for rest of Employees that dont have back to back
                sqlQuery = "SELECT * FROM EmployeeDetails WHERE EmpEmail = '" + noBackToBack[0] + "'";
                for(var i = 1; i < noBackToBack.length; i++)
                {
                    if(i != noBackToBack.length)
                    {
                        sqlQuery = sqlQuery + " OR EmpEmail = ";
                    }
                    sqlQuery = sqlQuery +"'"+ noBackToBack[i] + "'";
                }

                connection.query(sqlQuery, function (err, data) {
                    if (err){
                        return reject(new Error(err));
                    } 
        
                    else{
                        
                        //Retrieve location ID for each Employee
                        for(var i = 0; i < noBackToBack.length; i++)
                        {
                            locationID.push(data[i].LocationID);
                        }
        
                        return resolve(locationID);
                    }
                });
            });
        });
    },

    //query retrieves distance of an employee from a their current location to a specific meeting room 
     FindDistances: async function (MeetingRoom,attendLoc)
    {
        console.log("Find distances function");
        console.log(MeetingRoom +" "+ attendLoc);
        
        return new Promise((resolve, reject) => {
            sql="SELECT "+MeetingRoom +" FROM distance WHERE Rooms='"+attendLoc+"';";
            console.log(sql);
                connection.query(sql, function (err, result) {
                    if (err){
                    reject(err);
                        } 
                    else{
                        console.log("returning ");
                        console.log(result);
                        resolve(result);
                        }
                    });
            });
    },

    //query retrieves the room name based on room id
    roomNameQuery: async function (id)
    {
        return new Promise((resolve, reject) => {
            sql="SELECT RoomName" +" FROM floorplan WHERE RoomID ='"+id+"';";
                connection.query(sql, function (err, result) {
                    if (err){
                    throw err;
                        } 
                    else{
                        resolve(result);
                        }
                    });
            });
    },
    //returns RoomID of a meeting room
    roomIDQuery: async function(RoomName)
    {
        return new Promise((resolve, reject) => {
            sql="SELECT RoomID FROM floorplan WHERE RoomName ='"+RoomName+"';";
                connection.query(sql, function (err, result) {
                    if (err){
                    throw err;
                        } 
                    else{
                        resolve(result);
                        }
                    });
            });
    },
    //stores the best meeting room in db
    storeRooms: async function(extractedDetails,amenity,ListOfRooms)
    {

  
        return new Promise((resolve, reject) => {
          var nextbest=[];
          for(var i=1;i<ListOfRooms.length;i++)
          {
            nextbest.push(ListOfRooms[i]);
          }
          var sql = "INSERT INTO meetings (StartTime,EndTime,Organizer,Participants,OriginalAmenity,RoomID,BestRooms)"+
        "VALUES('" +
                  extractedDetails.Start +
                  "','" +
                 extractedDetails.End+
                  "','" +
                  extractedDetails.Organizer +
                  "','" +
                  extractedDetails.Attendees +
                  "','" +
                  amenity +
                  "','" +
                  ListOfRooms[0] +
                  "','" +
                  nextbest +
                  "');";;
            connection.query(sql, function (err, result) {
                if (err){
                   throw err;
                    } 
                else{
                    resolve(result);
                    }
                });
          });
      
      },

      getMeetingEndTime: async function (meetingId)
      {
        var sqlQuery = "SELECT * FROM meetings WHERE MeetingID='"+meetingId+"'";
        return new Promise((resolve, reject) => {
        connection.query(sql, function (err, result) {
            if (err){
               throw err;
                } 
            else{
                resolve(result[0].EndTime);
                }
            });
        });
      }

    //Other Functions

};