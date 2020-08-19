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
    console.log("in api");
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

async function view_records(table, res) {

    if(table == "FloorPlan"){
      var data=await viewFloorPlan();
        res.send(data);
    }
    else if(table == "EmployeeDetails"){
        var data=await ViewEmployeeDetails();
        res.send(data);
    }

    else if(table == "Meetings"){
      var t,t2;
      var array=[];
     var data=await viewMeeting();
     data=JSON.parse(data);

     for(var i=0;i<data.length;i++)
     {
        t=data[i]["Participants"];
        data[i]["StartTime"]=new Date(data[i]["StartTime"]).toISOString().replace(/T/, ' ').replace(/\..+/, '');
        data[i]["EndTime"]=new Date(data[i]["EndTime"]).toISOString().replace(/T/, ' ').replace(/\..+/, '');
        array = t.split(',');
       
        for(var u=0;u<array.length;u++)
          {
             t2=await querySingleEmplDetails(array[u]); //query for specific employee
             if(t2=="ERROR")
             {
              console.log("error has occured");
             }
             else{
              console.log("t2: "+t2);
              t2=JSON.parse(t2);
              array[u]=t2[0]["FirstName"]+" ";
              array[u]+=t2[0]["LastName"];
             }
          }
           data[i]["Participants"]=array;
           data[i]["Organizer"]=array[0];
     } 

      console.log(data);
       res.send(data);
        
    }

    else if(table == "Distance"){
        var data=await viewDistance();
        res.send(data);
    }
}
function viewFloorPlan(){
  return new Promise((resolve, reject) =>
    {
      http.get("http://localhost:10000/FloorPlan",httpRes=>
      {
        var data="";

        httpRes.on("data",chunk=>{
            data+=chunk;
        });

        httpRes.on("end",()=>
        {
            resolve(data);
        });
      }).on("error",err=>
      {
        reject("ERROR");
                      });
    });
}

function ViewEmployeeDetails()
{
  return new Promise((resolve, reject) =>
    {
      http.get("http://localhost:10000/employeeDetails",httpRes=>
      {
        var data="";
        httpRes.on("data",chunk=>{
                data+=chunk;
            });

            httpRes.on("end",()=>
        {
            resolve(data);
        });

      }).on("error",err=>
      {
        reject("ERROR");
                      });
    });
}

function viewDistance()
{
  return new Promise((resolve, reject) => {

    http.get("http://localhost:10000/distance",httpRes=>{
            var data="";

            httpRes.on("data",chunk=>{
                data+=chunk;
            });

            httpRes.on("end",()=>
        {
            resolve(data);
        });

      }).on("error",err=>
      {
        reject("ERROR");
                      });
      });
}

function querySingleEmplDetails(id)
{
  return new Promise((resolve, reject) => {
   
    var req="http://localhost:10000/employeeDetails/"+id;
  http.get(req,httpRes=>{
            var data="";

            httpRes.on("data",chunk=>{
                data+=chunk;
            });

            httpRes.on("end",()=>{
                resolve(data);
            });
        }).on("error",err=>{
            reject("ERROR");
        });
        });
}

function viewMeeting(){
  return new Promise((resolve, reject) => {
  http.get("http://localhost:10000/Meetings",httpRes=>{
            var data="";

            httpRes.on("data",chunk=>{
                data+=chunk;
            });

            httpRes.on("end",()=>{
              
               resolve (data);
            });
        }).on("error",err=>{
            console.log("ERROR view");
            reject("error");
        });
        });
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