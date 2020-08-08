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
    }

    //Other Functions

};