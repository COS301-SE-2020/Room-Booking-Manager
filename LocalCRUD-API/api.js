const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 65000;

const http=require("http");

var sql = require("mssql");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// const config = {
//     user: "threshold",
//     password: "thresh#301",
//     server: "rbmserver.database.windows.net",
//     database: "RBM Database",
// };

var table = "";
var operation = "";
var bodyData = "";

// for all post requests:
app.post("/", function (req, res) {
    table = req.body.table;
    operation = req.body.request;
    bodyData = req.body.data;

    callAPI(table, operation, bodyData, res);
});

// TABLES: EmployeeDetails, Distance, FloorPlan, Meetings

// function used to call the API:
function callAPI(table, option, data, res) {
    // CRUD:

    let recordID;
    let primaryKey;

    if (option == "delete" || option == "read") {
        if (table == "Distance") {
            primaryKey = "Rooms";
            recordID = data.Rooms;
        } else if (table == "FloorPlan") {
            primaryKey = "RoomID";
            recordID = data.RoomID;
        } else if (table == "EmployeeDetails") {
            primaryKey = "EmpEmail";
            recordID = data.EmpEmail;
        } else if (table == "Meetings") {
            primaryKey = "MeetingID";
            recordID = data.MeetingID;
        }

        if (option == "delete") {
            var x = delete_record(table, primaryKey, recordID, res);
            return x;
        } else {
            var x = read_record(table, primaryKey, recordID, res);
            return x;
        }
    }
    if (option == "view") {
        view_records(table, res);
    } else if (option == "create") {
        // POST
        if (table == "EmployeeDetails") UD_create_record(data, res);
        else if (table == "FloorPlan") FP_create_record(data, res);
        else if (table == "Meetings") MEET_create_record(data, res);
        else if (table == "Distance") DIST_create_record(data, res);
    } else if (option == "update") {
        // POST
        if (table == "EmployeeDetails") UD_update_record(data, res);
        else if (table == "FloorPlan") FP_update_record(data, res);
        else if (table == "Meetings") MEET_update_record(data, res);
        else if (table == "Distance") DIST_update_record(data, res);
    }
}

function read_record(table, primaryKey, recordID, res) {
    sql.connect(config, function (err) {
        // if (err) console.log(err);

        var request = new sql.Request();
        var sqlQuery = "SELECT * FROM " + table + " WHERE " + primaryKey + "= '" + recordID + "';";

        request.query(sqlQuery, function (err, recordset) {
            if (err) {
                // console.log(err);
                res.send("Error: Failed To Read Record.");
            } else {
                if (recordset.recordset.length == 0) {
                    // console.log("Error: Failed To Find Record With ID = " + recordID);
                    res.send("Error: Failed To Find Record With ID = " + recordID);
                } else {
                    // console.log("Success: Record Retrieved! ID = " + recordID);
                    res.send(recordset.recordset);
                }
            }
        });
    });
}

function view_records(table, res) {
   
    if(table == "FloorPlan"){
        http.get("http://localhost:10000/FloorPlan",httpRes=>{
            var data="";

            httpRes.on("data",chunk=>{
                data+=chunk;
            });

            httpRes.on("end",()=>{
                console.log(data);
                res.send(data);
            });
        }).on("error",err=>{
            console.log("ERROR view");
        });
    }
    else if(table == "EmployeeDetails"){
        http.get("http://localhost:10000/employeeDetails",httpRes=>{
            var data="";

            httpRes.on("data",chunk=>{
                data+=chunk;
            });

            httpRes.on("end",()=>{
                console.log(data);
                res.send(data);
            });
        }).on("error",err=>{
            console.log("ERROR view");
        });
    }

    else if(table == "Meetings"){
        http.get("http://localhost:10000/Meetings",httpRes=>{
            var data="";

            httpRes.on("data",chunk=>{
                data+=chunk;
            });

            httpRes.on("end",()=>{
                console.log(data);
                res.send(data);
            });
        }).on("error",err=>{
            console.log("ERROR view");
        });
    }

    else if(table == "Distance"){
        http.get("http://localhost:10000/distance",httpRes=>{
            var data="";

            httpRes.on("data",chunk=>{
                data+=chunk;
            });

            httpRes.on("end",()=>{
                console.log(data);
                res.send(data);
            });
        }).on("error",err=>{
            console.log("ERROR view");
        });
    }
}

// TABLE FLOOR PLAN

function FP_create_record(body_data, res) {
   
   var stringbody_data=JSON.stringify(body_data);
       console.log(body_data+"data suppose to be");
    const options = {
      hostname: 'localhost',
      port: '10000',
      path: '/FloorPlan',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': stringbody_data.length
          }
        };

    const httpreq = http.request(options, (httpres) => {
      console.log(`statusCode: ${httpres.statusCode}`);
        res.sendStatus(httpres.statusCode);
      httpres.on('data', (d) => {
        process.stdout.write(d)

      });
     });

    httpreq.on('error', (error) => {
      console.error(error)
    });

    httpreq.write(stringbody_data);
    httpreq.end();
}

function FP_update_record(body_data, res) {
  
    var stringbody_data=JSON.stringify(body_data);
       console.log(body_data+"data suppose to be");
    const options = {
      hostname: 'localhost',
      port: '10000',
      path: '/FloorPlanUpdate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': stringbody_data.length
          }
        };

    const httpreq = http.request(options, (httpres) => {
      console.log(`statusCode: ${httpres.statusCode}`);
        res.sendStatus(httpres.statusCode);
      httpres.on('data', (d) => {
        process.stdout.write(d)

      });
     });

    httpreq.on('error', (error) => {
      console.error(error)
    });

    httpreq.write(stringbody_data);
    httpreq.end();
}

function delete_record(table, primaryKey, recordID, res) {
    if(table == "FloorPlan"){
        console.log("in delete");
        const options = {
          hostname: 'localhost',
          port: '10000',
          path: '/FloorPlan/'+recordID,
          method: 'DELETE'
            };

        const httpreq = http.request(options, (httpres) => {

          console.log(`statusCode: ${httpres.statusCode}`);
            res.sendStatus(httpres.statusCode);

          httpres.on('data', (d) => {
            process.stdout.write(d)

          });
         });

        httpreq.on('error', (error) => {
          console.error(error)
        });

        httpreq.end();
    }
    else if(table == "EmployeeDetails"){
        const options = {
          hostname: 'localhost',
          port: '10000',
          path: '/employeeDetails/'+recordID,
          method: 'DELETE'
            };

        const httpreq = http.request(options, (httpres) => {

          console.log(`statusCode: ${httpres.statusCode}`);
            res.sendStatus(httpres.statusCode);

          httpres.on('data', (d) => {
            process.stdout.write(d)

          });
         });

        httpreq.on('error', (error) => {
          console.error(error)
        });

        httpreq.end();
    }

    else if(table == "Meetings"){
         const options = {
          hostname: 'localhost',
          port: '10000',
          path: '/Meetings/'+recordID,
          method: 'DELETE'
            };

        const httpreq = http.request(options, (httpres) => {

          console.log(`statusCode: ${httpres.statusCode}`);
            res.sendStatus(httpres.statusCode);

          httpres.on('data', (d) => {
            process.stdout.write(d)

          });
         });

        httpreq.on('error', (error) => {
          console.error(error)
        });

        httpreq.end();
    }

    else if(table == "Distance"){
       const options = {
          hostname: 'localhost',
          port: '10000',
          path: '/distance/'+recordID,
          method: 'DELETE'
            };

        const httpreq = http.request(options, (httpres) => {

          console.log(`statusCode: ${httpres.statusCode}`);
            res.sendStatus(httpres.statusCode);

          httpres.on('data', (d) => {
            process.stdout.write(d)

          });
         });

        httpreq.on('error', (error) => {
          console.error(error)
        });

        httpreq.end();
    }
}

// TABLE EMPLOYEE DETAILS:

function UD_create_record(body_data, res) {

    var stringbody_data=JSON.stringify(body_data);
       console.log(body_data+"data suppose to be");
    const options = {
      hostname: 'localhost',
      port: '10000',
      path: '/employeeDetails',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': stringbody_data.length
          }
        };

    const httpreq = http.request(options, (httpres) => {
      console.log(`statusCode: ${httpres.statusCode}`);
        res.sendStatus(httpres.statusCode);
      httpres.on('data', (d) => {
        process.stdout.write(d)

      });
     });

    httpreq.on('error', (error) => {
      console.error(error)
    });

    httpreq.write(stringbody_data);
    httpreq.end();
}

function UD_update_record(body_data, res) {
    
    var stringbody_data=JSON.stringify(body_data);
       console.log(body_data+"data suppose to be");
    const options = {
      hostname: 'localhost',
      port: '10000',
      path: '/employeeDetailsUpdate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': stringbody_data.length
          }
        };

    const httpreq = http.request(options, (httpres) => {
      console.log(`statusCode: ${httpres.statusCode}`);
        res.sendStatus(httpres.statusCode);
      httpres.on('data', (d) => {
        process.stdout.write(d)

      });
     });

    httpreq.on('error', (error) => {
      console.error(error)
    });

    httpreq.write(stringbody_data);
    httpreq.end();
}

// TABLE DISTANCE:

function DIST_create_record(body_data, res) {

    var stringbody_data=JSON.stringify(body_data);
       console.log(body_data+"data suppose to be");
    const options = {
      hostname: 'localhost',
      port: '10000',
      path: '/distance',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': stringbody_data.length
          }
        };

    const httpreq = http.request(options, (httpres) => {
      console.log(`statusCode: ${httpres.statusCode}`);
        res.sendStatus(httpres.statusCode);
      httpres.on('data', (d) => {
        process.stdout.write(d)

      });
     });

    httpreq.on('error', (error) => {
      console.error(error)
    });

    httpreq.write(stringbody_data);
    httpreq.end();
}

function DIST_update_record(body_data, res) {
    
    var stringbody_data=JSON.stringify(body_data);
       console.log(body_data+"data suppose to be");
    const options = {
      hostname: 'localhost',
      port: '10000',
      path: '/distanceUpdate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': stringbody_data.length
          }
        };

    const httpreq = http.request(options, (httpres) => {
      console.log(`statusCode: ${httpres.statusCode}`);
        res.sendStatus(httpres.statusCode);
      httpres.on('data', (d) => {
        process.stdout.write(d)

      });
     });

    httpreq.on('error', (error) => {
      console.error(error)
    });

    httpreq.write(stringbody_data);
    httpreq.end();
}

// TABLE MEETINGS:

function MEET_create_record(body_data, res) {

    var stringbody_data=JSON.stringify(body_data);
       console.log(body_data+"data suppose to be");
    const options = {
      hostname: 'localhost',
      port: '10000',
      path: '/Meetings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': stringbody_data.length
          }
        };

    const httpreq = http.request(options, (httpres) => {
      console.log(`statusCode: ${httpres.statusCode}`);
        res.sendStatus(httpres.statusCode);
      httpres.on('data', (d) => {
        process.stdout.write(d)

      });
     });

    httpreq.on('error', (error) => {
      console.error(error)
    });

    httpreq.write(stringbody_data);
    httpreq.end();
}

function MEET_update_record(body_data, res) {
   
    var stringbody_data=JSON.stringify(body_data);
       console.log(body_data+"data suppose to be");
    const options = {
      hostname: 'localhost',
      port: '10000',
      path: '/MeetingsUpdate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': stringbody_data.length
          }
        };

    const httpreq = http.request(options, (httpres) => {
      console.log(`statusCode: ${httpres.statusCode}`);
        res.sendStatus(httpres.statusCode);
      httpres.on('data', (d) => {
        process.stdout.write(d)

      });
     });

    httpreq.on('error', (error) => {
      console.error(error)
    });

    httpreq.write(stringbody_data);
    httpreq.end();
}

var server = app.listen(port, function () {
    console.log("Server Is Running On Port " + port);
});
module.exports = app;