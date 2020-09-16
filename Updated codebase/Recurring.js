var fs = require("fs");
var mysql = require("mysql");
var express = require("express");

// Configure Database
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cos301",
});

connection.connect(function (err) {
    if (err) {
        throw err;
    } else {
        console.log("Connected to DB!");
    }
});

// console.log("Here");
 addRecurring().then((res) => res);

async function addRecurring(){
    return new Promise((resolve, reject) => {

        var currDate = new Date();
        currDate = currDate.toISOString();

        var lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        lastWeek = lastWeek.toISOString();
        // console.log(currDate);
        var sql = 
            "SELECT * FROM meetings WHERE isRecurring = 1 AND StartTime >= '" + lastWeek + "' AND StartTime <= '" + currDate + "'";
            connection.query(sql, function (err, data) {
                if (err) {
                    reject(new Error(err));
                } else {

                    for(var i = 0; i < data.length; i++)
                    {
                        var sTime = new Date(data[i].StartTime);
                        sTime.setDate(sTime.getDate() + 7);
                        sTime.setHours(sTime.getHours() + 2);
                        sTime = sTime.toISOString();
                        // console.log(sTime);
                        
                        var eTime = new Date(data[i].EndTime);
                        eTime.setDate(eTime.getDate() + 7);
                        eTime.setHours(eTime.getHours() + 2);
                        eTime = eTime.toISOString();
                        // console.log(eTime);
                        

                        sql =
                            "INSERT INTO meetings (StartTime,EndTime,Organizer,Participants,OriginalAmenity,RoomID,BestRooms,isRecurring)" +
                            "VALUES('" +
                            sTime +
                            "','" +
                            eTime +
                            "','" +
                            data[i].Organizer +
                            "','" +
                            data[i].Participants +
                            "','" +
                            data[i].OriginalAmenity +
                            "','" +
                            data[i].RoomID +
                            "','" +
                            data[i].BestRooms +
                            "','" +
                            data[i].isRecurring +
                            "');";

                        connection.query(sql, function (err, result) {
                            if (err) {
                                reject(new Error(err));
                            } else {
                                console.log("done");
                                resolve(result);
                            }
                        });
                    }
                }
            });
    });
}

