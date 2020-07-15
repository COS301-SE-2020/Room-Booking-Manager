
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json())
const { Connection, Request } = require("tedious");
var port = 9000;

app.post('/sample/put/data', function(req, res) {
    console.log('receiving data ...');
    console.log('body is ',req.body);
    res.send(req.body);
});

// start the server
app.listen(port);
console.log('Server started! At http://localhost:' + port);

var axios = require('axios');
var qs = require('qs');
const { json } = require('body-parser');
var data = qs.stringify({
 'grant_type': 'client_credentials',
'client_id': 'af50279a-b342-40f8-9b9e-040f383fcc0f',
'scope':'https://graph.microsoft.com/.default',
'client_secret': 'c-3JXS.vpq.PCYO2xmnvH1QIf-al_~iI30'  
});
var testString = "";
var config = {
  method: 'get',
  url: 'https://login.microsoftonline.com/0f5281ec-d7fa-424d-86d7-2e2bca5630dd/oauth2/v2.0/token',
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded', 
    //'Cookie': 'buid=AQABAAEAAAAm-06blBE1TpVMil8KPQ41aUOe9MR6yUiP_2awsLH1KU62kaF4W2ZFrJnDabSQHug1TMtPV8fTEg9sZoRxhT81ae7Zs0fb8RuY2O3RDzF68Nz2lVQBXTHH60D3bexSX3AgAA; fpc=AuUvxl7p9CBNrL7wYPiYTBg; x-ms-gateway-slice=prod; stsservicecookie=ests'
  },
  data : data
};
var token="";
var access="";

axios(config)
.then(function (response) {
  //console.log(JSON.stringify(response.data));
  token = JSON.stringify(response.data);
 // console.log(token);
  access=response.data.access_token;
  
})
.catch(function (error) {
  console.log(error);
});

//setTimeout(printToken,5000); // Use a promise or similiar instead 
function printToken(){
    //console.log("After time out :"+token);
     
}

setTimeout(getData,5000);
// TODO 
// Implement refresh token 
// Query using UTC+2 
// Store releveant info into an Array from meeting details 
var d = new Date(); // Use this to get date from email
console.log(" Current time : "+d);
var z=d.toISOString(); // use this to get ISO8061 date converted auto from email ( Already in UTC-2 )
console.log(" ISO String time : "+z);
function getData(){
    //console.log("Access token after is: "+access);
var accessBearer = 'Bearer '+access;
var config1 = {
  method: 'get',
  //url: 'https://graph.microsoft.com/v1.0/users',
  // NOTE : TIME ZONE ISSUES, in Query always -by 2, method to adjust date from emails given date
  url: 'https://graph.microsoft.com/v1.0/users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/calendarView?startDateTime=2020-07-15T07:00:00&endDateTime=2020-07-15T10:00:00',
  //url: 'https://graph.microsoft.com/v1.0/users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/calendar/events?select=subject,organizer,attendees,start,end',
  headers: { 
    'Authorization': accessBearer,
    'Prefer': 'outlook.timezone="South Africa Standard Time"'
  },
  data : data
};

axios(config1)
.then(function (response) {
  testString += JSON.stringify(response.data);
  console.log(JSON.stringify(response.data));


})
.catch(function (error) {
  console.log(error);
});

}


setTimeout(sendData,10000);

function sendData()
{
  console.log(" Data is being sent for processing");
  console.log(testString);
  var obj = JSON.parse(testString);

  var subject = obj.value[0].subject;
  var organiser = obj.value[0].organizer.emailAddress.address;
  var attendees = obj.value[0].attendees[0].emailAddress.address; // For loop
  var startTime = obj.value[0].start.dateTime;
  var endTime = obj.value[0].end.dateTime;
  var description = obj.value[0].bodyPreview;


  console.log( "--- DATA PROCESSING COMPLETE ---");
  console.log( "Subject :" + subject);
  console.log( "Organiser :" + organiser);
  console.log( "attendees :" + attendees);
  console.log( "startTime :" + startTime);
  console.log( "endTime :" + endTime);
  console.log( "Description : " + description);
 
}
// Database connection 




    // config for your database
 
    const config1 = {
        authentication: {
          options: {
            userName: "threshold", // 
            password: "thresh#301" // 
          },
          type: "default"
        },
        server: "rbmserver.database.windows.net", // 
        options: {
          database: "RBM Database", //
          encrypt: true
        }
      };
      
      const connection = new Connection(config1);
    
// Attempt to connect and execute queries if connection goes through
connection.on("connect", err => {
    if (err) {
      console.error(err.message);
    } else {
      queryDatabase();
    }
  });

var roomsFound = [];
var rooms = 0;
  function queryDatabase() {
    console.log("Reading rows from the Table...");
    const request = new Request(
        `SELECT [RoomID] FROM [FloorPlan]`, // SELECT ALL FROM WHERE ROOMSTATUS == EMPTY etc. 
        (err, rowCount) => {
          if (err) {
            console.error(err.message);
          } else {
            console.log(`${rowCount} row(s) returned`);
          }
        }
      );
    
      request.on("row", columns => {
        columns.forEach(column => {
          console.log("%s\t%s", column.metadata.colName, column.value);
          roomsFound.push(column.value);
          rooms++;
        });
      });
    
      connection.execSql(request);
      
     setTimeout(findRoom,12000);
    }


   function findRoom(){
    connection.close();
    console.log("The following 2 rooms were found from the Database : "); 
    for(var i=0;i<rooms;i++)
    {
      console.log( roomsFound[i]);
    }

    // Do some calculations get best room 



    // pick Room

    console.log(" The following room was determined to be the best : " + roomsFound[0]);
//  
    console.log( " Updating user with room found ");

    console.log("Checking acceptance");

    var apiData = "";
    accessBearer = 'Bearer '+access;
    var events = {
      method: 'get',
      //url: 'https://graph.microsoft.com/v1.0/users',
      // NOTE : TIME ZONE ISSUES, in Query always -by 2, method to adjust date from emails given date
      url: 'https://graph.microsoft.com/v1.0/users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/calendarView?startDateTime=2020-07-15T07:00:00&endDateTime=2020-07-15T10:00:00',
      //url: 'https://graph.microsoft.com/v1.0/users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/calendar/events?select=subject,organizer,attendees,start,end',
      headers: { 
        'Authorization': accessBearer,
        'Prefer': 'outlook.timezone="South Africa Standard Time"'
      },
      data : data
    };
    
    axios(events)
    .then(function (response) {
      apiData += JSON.stringify(response.data);
      //console.log(JSON.stringify(response.data));
      var eData = JSON.parse(apiData);  
      var acceptance = eData.value[0].attendees[0].response.status;
      if(acceptance == "accepted")
      {
        accept();
      }
      else if(acceptance == "declined")
      {
        decline();
      }
      else
      {
        //setTimeout(checkAcceptance,12000);//repeat function after interval to check acceptance
      }

    
    })
    .catch(function (error) {
      console.log(error);
    });

    function accept()// insert a the meeting in the meetings table
    {
      const connection = new Connection(config1);
      const request = new Request(
        `INSERT INTO [] () VALUES()`,
        //`SELECT [RoomID] FROM [FloorPlan]`, // SELECT ALL FROM WHERE ROOMSTATUS == EMPTY etc. 
        (err, response) => {
          if (err) {
            console.error(err.message);
          } else {
            console.log(`${response}`);
          }
        }
      );
    
      connection.execSql(request);
      connection.close();
    }

    function decline()//
    {

    }
   }