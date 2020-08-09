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
        console.log("Connected!");
    }

});


module.exports = {
    //Functions for querying the database

    getLocation : async function(emailAddress)
    {
        return new Promise((resolve, reject) => {
        
            var LocationID = [];

            //Get query string according to emails
            var sqlQuery = "SELECT * FROM EmployeeDetails WHERE EmpEmail = '" + emailAddress[0] + "'";
            for(var i = 1; i < emailAddress.length; i++)
            {
                if(i != emailAddress.length)
                {
                    sqlQuery = sqlQuery + " OR EmpEmail = ";
                }
                sqlQuery = sqlQuery +"'"+ emailAddress[i] + "'";
            }

            connection.query(sqlQuery, function (err, data) {
                if (err){
                    return reject(new Error(err));
                } 

                else{
                    
                    //Retrieve location ID for each Employee
                    for(var i = 0; i < emailAddress.length; i++)
                    {
                        LocationID[i] = data[i].LocationID
                    }

                    // connection.end();
                    return resolve(LocationID);
                }
            });
        });
    },

    //query retrieves distance of an employee from a their current location to a specific meeting room 
     FindDistances: async function (MeetingRoom,attendLoc)
    {
        return new Promise((resolve, reject) => {
            sql="SELECT "+MeetingRoom +" FROM distance WHERE Rooms ='"+attendLoc+"';";
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
    }

    //Other Functions

};