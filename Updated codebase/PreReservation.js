var fs = require("fs");
var mysql = require("mysql");
var express = require("express");

// Configure Database
var connection = mysql.createConnection({
    host: "",
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

PreReservation().then((res) => res);

async function PreReservation(){
    return new Promise((resolve, reject) => {

        var currDate = new Date();
        currDate = currDate.toISOString();

        var lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 14);
        lastWeek = lastWeek.toISOString();

        var nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() - 7);
        nextWeek = nextWeek.toISOString();

        var sql =
        "SELECT * FROM meetings WHERE isRecurring = 0 AND StartTime >= '" + lastWeek + "' AND StartTime <= '" + nextWeek + "'";

        connection.query(sql, function (err, data) {
            if (err) {
                reject(new Error(err));
            } 
            else {
                console.log(data.length);

                for(var i = 0; i < data.length; i++)
                {
                    var weekAfter = new Date(data[i].StartTime);
                    weekAfter.setDate(weekAfter.getDate() + 7);
                    weekAfter.setHours(weekAfter.getHours() + 2);
                    weekAfter = weekAfter.toISOString();
                    console.log(weekAfter);

                    sql = 
                    "SELECT * FROM meetings WHERE StartTime = '"+ weekAfter + "' AND Organizer = '" + data[i].Organizer + "'";
                    connection.query(sql, function (err, res) {
                        if (err) {
                            reject(new Error(err));
                        } 
                        else {
                            if(res.length > 0)
                            {
                                console.table(res[0].MeetingID);
                                var sTime = new Date(res[0].StartTime);
                                sTime.setDate(sTime.getDate() + 14);
                                sTime.setHours(sTime.getHours() + 2);
                                sTime = sTime.toISOString();

                                var eTime = new Date(res[0].EndTime);
                                eTime.setDate(eTime.getDate() + 14);
                                eTime.setHours(eTime.getHours() + 2);
                                eTime = eTime.toISOString();

                                sql =
                                "INSERT INTO meetings (StartTime,EndTime,Organizer,Participants,OriginalAmenity,RoomID,BestRooms,isRecurring,Status)" +
                                "VALUES('" +
                                sTime +
                                "','" +
                                eTime +
                                "','" +
                                res[0].Organizer +
                                "','" +
                                res[0].Participants +
                                "','" +
                                res[0].OriginalAmenity +
                                "','" +
                                res[0].RoomID +
                                "','" +
                                res[0].BestRooms +
                                "','" +
                                res[0].isRecurring +
                                "','" +
                                "Reserved" +
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

                }
            }
        });

    });
}

