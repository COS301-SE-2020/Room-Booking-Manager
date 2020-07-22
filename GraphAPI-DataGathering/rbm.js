const notifier = require('mail-notifier');
const axios = require('axios').default;
var qs = require('qs');
const { json } = require('body-parser');
const { timeStamp } = require('console');

 // data is a JSON object which is the config sent with every API request 
var data = qs.stringify({
    'grant_type': 'client_credentials',
   'client_id': 'af50279a-b342-40f8-9b9e-040f383fcc0f',
   'scope':'https://graph.microsoft.com/.default',
   'client_secret': 'c-3JXS.vpq.PCYO2xmnvH1QIf-al_~iI30'  
   });








console.log("RBM service started");

console.log("Email trigger service started")


const imap = {
    user: "cos301@teamthreshold.onmicrosoft.com",
    password: "Threshold#301",
    host: "outlook.office365.com",
    port: 993, 
    tls: true,
    tlsOptions: { rejectUnauthorized: false }
};

const n = notifier(imap);
n.on('end', () => n.start()) // session closed
  .on('mail', mail => beginProcess(mail))
  .start();

var i=0; // initial message count
  async function beginProcess(mail)
  {
      console.log("Messages processed = " + i);
      i++;
      console.log(mail.subject, mail.from[0].address, "message ID = "+ mail.messageId);
      // Skip emails that start with Cancelled in subject 
      // at this point Have from and subject, need meeting start and end time 
      var accessToken = await(getAPIToken());
     // console.log("Access token is : " + accessToken);
      var relevantData = await (getData(accessToken, mail.from[0].address, mail.subject));
     // console.log("Data from API is :" + relevantData);
     // Search relevant data to find correct event we need matching subject and 
      var extractEventIDval = await (extractEventID(relevantData,mail.from[0].address,mail.subject)); 
      console.log(extractEventIDval);
      console.log( " PARSING BACK TO JSON ");
      var test = JSON.parse(extractEventIDval);
     // console.log("extract VALUE" + test.event.attendees.temp[0].name);
     // console.log("ATTENDEES extract SPECIFIC VALUE" + extractEventIDval.attendees.temp);
      var ext = extractEventIDval;
       // console.log("EXT VALUE" + JSON.stringify(ext.attendees));
       // console.log("ATTENDEES SPECIFIC VALUE" + ext.attendees);
        var room = await findRoom(mail.from[0].address, ext);
        console.log("ROOM FOUND : " + room);
        var roo = 'Berlin';
        var updateRoom = await updateEvent(test.event,accessToken,roo);
        //var ext = JSON.parse(ext);
     // var deleterEvent = await deleteEvent(test.event.id,accessToken);
      //console.log("Event has been deleted:"+deleterEvent);
  }
  
  // findRoom
async function findRoom(organizer,ext){
//Access the drivers
let sql = require("mssql");

var t= JSON.parse(ext);
var subject = t.event.subject;
//Configure Database
const config = {
    authentication: {
        options: {
          userName: "threshold", 
          password: "thresh#301" 
        },
        type: "default"
    },
    server: 'rbmserver.database.windows.net', 
    database: 'RBM Database',
    encrypt: true
};

let OrganizerEmail = organizer;
let AttendeesEmail = t; // for loop

//Store all Emails in 1 Array
//AttendeesEmail.push(OrganizerEmail);
for(let i = 0; i < AttendeesEmail.event.attendees.temp.length; i++)
{
    AttendeesEmail.event.attendees.temp[i].name = "'" + AttendeesEmail.event.attendees.temp[i].name + "'"; 
}

//Variables
let Whiteboard = "Whiteboard = 1";
let Projector = "Projector = 1";
let Monitor = "Monitor = 1";
let WhiteboardProjector = "Whiteboard = 1 AND Projector = 1";
let WhiteboardMonitor = "Whiteboard =1 AND Monitor = 1";

let Amenity = subject;

//
//Search Body which is a string and find Amenity
//

// let AmenityRequired = ("Amenity Required:  projector, board"); //String to search
// AmenityRequired = AmenityRequired.toLowerCase();


// let searchBoard = AmenityRequired.search("board");
// let searchProjector = AmenityRequired.search("projector");
// let searchMonitor = AmenityRequired.search("monitor");

// if(searchBoard != -1)
//   Amenity = Whiteboard;

// if(searchMonitor != -1)
//   Amenity = Monitor;

// if(searchProjector != -1)
//   Amenity = Projector;

// if( searchBoard != -1 && searchProjector != -1)
//   Amenity = WhiteboardProjector;

// if(searchBoard != -1 && searchMonitor != -1)
//   Amenity = WhiteboardMonitor;

//Amenity = Whiteboard;

//Amenity Variable
let roomName = [];
let roomfound;

//Distance Variable
let LocationID = [];
let sizeEmployee = AttendeesEmail.length;
let distance = [];
let averageDistance = [];
let total = 0;
let shortest = 10000;
let index;


// Function to Query the Database
async function queryDatabase () {

    //Connect to Database
    let pool = await sql.connect(config);

    //
    //---------------------AMENITIES OPTIMIZATION----------------------
    //

    //Query to the database for AMENITIES
    let sqlQuery = "SELECT * FROM FloorPlan WHERE " + Amenity + "AND is_Available = 1";
    if(Amenity == "")
        sqlQuery = "SELECT * FROM FloorPlan WHERE is_Available = 1";

    let sqlRequest = await pool.request()
        .input('', sql.VarChar)
        .query(sqlQuery);

        // console.table(sqlRequest.recordset);
        for(let i=0;i<sqlRequest.rowsAffected;i++)
        {
            roomName[i] = sqlRequest.recordsets[0][i].RoomName;
        }


    //
    //---------------------DISTANCE OPTIMIZATION----------------------
    //
    
    //Query database for users location ID
    

    //Get Location ID of the Employees
    sqlQuery = "SELECT * FROM EmployeeDetails WHERE EmpEmail = " + AttendeesEmail[0];
    for(let i = 1; i < sizeEmployee; i++)
    {
        if(i != sizeEmployee)
        {
            sqlQuery = sqlQuery + " OR EmpEmail = ";
        }
        sqlQuery = sqlQuery + AttendeesEmail[i];
        
    }

    sqlRequest = await pool.request()
        .input('', sql.VarChar)
        .query(sqlQuery);

        // console.table(sqlRequest.recordset);
        for(let i = 0; i < sizeEmployee; i++)
        {
            LocationID[i] = (sqlRequest.recordsets[0][i].LocationID)
        }



    
    //Convert in order to use as sql string
    for(let i = 0; i < LocationID.length; i++)
    {
        LocationID[i] = "'" + LocationID[i] + "'";
    }
    
    //Get Location ID of the Employees
    sqlQuery = "SELECT "
    for(let i = 0; i < roomName.length; i++)
    {
        if(i < roomName.length - 1)
            sqlQuery = sqlQuery + roomName[i] + ", " ;
        else
            sqlQuery = sqlQuery + roomName[i];

    }
    
    sqlQuery = sqlQuery + " FROM Distance WHERE Rooms = " + LocationID[0];
    for(let i = 1; i < sizeEmployee; i++)
    {
        if(i != sizeEmployee)
        {
            sqlQuery = sqlQuery + " OR Rooms = ";
        }
        sqlQuery = sqlQuery + LocationID[i];
        
    }

    sqlRequest = await pool.request()
        .input('', sql.Int)
        .query(sqlQuery);

        // console.table(sqlRequest.recordset);

        //
        //Get Average Distance to each meeting room
        //

        //Texas
        total = 0;
        if(sqlRequest.recordsets[0][0].Texas != undefined)
        {
            for(let i = 0; i < sizeEmployee; i++)
            {
                distance[i] = (sqlRequest.recordsets[0][i].Texas);
            }
    
            for(let i = 0; i < distance.length; i++)
            {
                total += distance[i];
            }      
            averageDistance.push( total/distance.length);      
        }

        //Colorado
        total = 0;
        if(sqlRequest.recordsets[0][0].Colorado != undefined)
        {
            for(let i = 0; i < sizeEmployee; i++)
            {
                distance[i] = (sqlRequest.recordsets[0][i].Colorado);
            }
    
            for(let i = 0; i < distance.length; i++)
            {
                total += distance[i];
            }      
            averageDistance.push( total/distance.length);      
        }

        //Mississippi
        total = 0;
        if(sqlRequest.recordsets[0][0].Mississippi != undefined)
        {
            for(let i = 0; i < sizeEmployee; i++)
            {
                distance[i] = (sqlRequest.recordsets[0][i].Mississippi);
            }
    
            for(let i = 0; i < distance.length; i++)
            {
                total += distance[i];
            }      
            averageDistance.push( total/distance.length);      
        }        

        //New Jersey
        total = 0;
        if(sqlRequest.recordsets[0][0].NewJersey != undefined)
        {
            for(let i = 0; i < sizeEmployee; i++)
            {
                distance[i] = (sqlRequest.recordsets[0][i].NewJersey);
            }
    
            for(let i = 0; i < distance.length; i++)
            {
                total += distance[i];
            }      
            averageDistance.push( total/distance.length);      
        }  

    
        //New York
        total = 0;
        if(sqlRequest.recordsets[0][0].NewYork != undefined)
        {
            for(let i = 0; i < sizeEmployee; i++)
            {
                distance[i] = (sqlRequest.recordsets[0][i].NewYork);
            }
    
            for(let i = 0; i < distance.length; i++)
            {
                total += distance[i];
            }      
            averageDistance.push( total/distance.length);      
        } 
        
        //Pennsylvania
        total = 0;
        if(sqlRequest.recordsets[0][0].Pennsylvania != undefined)
        {
            for(let i = 0; i < sizeEmployee; i++)
            {
                distance[i] = (sqlRequest.recordsets[0][i].Pennsylvania);
            }
    
            for(let i = 0; i < distance.length; i++)
            {
                total += distance[i];
            }      
            averageDistance.push( total/distance.length);      
        }        
        
        //California
        total = 0;
        if(sqlRequest.recordsets[0][0].California != undefined)
        {
            for(let i = 0; i < sizeEmployee; i++)
            {
                distance[i] = (sqlRequest.recordsets[0][i].California);
            }
    
            for(let i = 0; i < distance.length; i++)
            {
                total += distance[i];
            }      
            averageDistance.push( total/distance.length);      
        } 

        //Georgia
        total = 0;
        if(sqlRequest.recordsets[0][0].Georgia != undefined)
        {
            for(let i = 0; i < sizeEmployee; i++)
            {
                distance[i] = (sqlRequest.recordsets[0][i].Georgia);
            }
    
            for(let i = 0; i < distance.length; i++)
            {
                total += distance[i];
            }      
            averageDistance.push( total/distance.length);      
        }

        //Florida
        total = 0;
        if(sqlRequest.recordsets[0][0].Florida != undefined)
        {
            for(let i = 0; i < sizeEmployee; i++)
            {
                distance[i] = (sqlRequest.recordsets[0][i].Florida);
            }
    
            for(let i = 0; i < distance.length; i++)
            {
                total += distance[i];
            }      
            averageDistance.push( total/distance.length);      
        }

        //Tennessee
        total = 0;
        if(sqlRequest.recordsets[0][0].Tennessee != undefined)
        {
            for(let i = 0; i < sizeEmployee; i++)
            {
                distance[i] = (sqlRequest.recordsets[0][i].Tennessee);
            }
    
            for(let i = 0; i < distance.length; i++)
            {
                total += distance[i];
            }      
            averageDistance.push( total/distance.length);      
        }

        //Washington
        total = 0;
        if(sqlRequest.recordsets[0][0].Washington != undefined)
        {
            for(let i = 0; i < sizeEmployee; i++)
            {
                distance[i] = (sqlRequest.recordsets[0][i].Washington);
            }
    
            for(let i = 0; i < distance.length; i++)
            {
                total += distance[i];
            }      
            averageDistance.push( total/distance.length);      
        }

        //Get the actual room name
        for(let i=0; i<averageDistance.length; i++)
        {
            if(averageDistance[i] < shortest)
                shortest = averageDistance[i];   
        }
        index = averageDistance.indexOf(shortest);
        roomfound = roomName[index];
        
        //Update in the Database
        let updateRoom = "'" + roomfound + "'";
        sqlRequest = await pool.request()
        .input('', sql.BIT)
        .query("UPDATE FloorPlan SET is_Available = 0 WHERE RoomName = " + updateRoom);

        
    pool.close();
    sql.close();  

    return nonDB();
}

function nonDB (){
    console.log("The most suitable meeting room is: " + roomfound);
    //
    // The REST OF THE CODE GOES BELOW (SEND USER NOTIFICATION)
    //
    return roomfound;
}

queryDatabase()
    .catch(err=>{
        pool.close();
        sql.close();
        console.log(err)
    })

}


  // This function gets and returns the API token 
  async function getAPIToken(){

       // config is the urls we will be calling and which headers etc and including the above data 
       var tokenCall = {
         method: 'get',
         url: 'https://login.microsoftonline.com/0f5281ec-d7fa-424d-86d7-2e2bca5630dd/oauth2/v2.0/token',
         headers: { 
           'Content-Type': 'application/x-www-form-urlencoded', 
         },
         data : data
       };
       var res = "";
       var accessToken = "";
       
       // Execution of above API call
       await axios(tokenCall)
       .then(function (response) {
         res = JSON.stringify(response.data);
         accessToken=response.data.access_token; // Access token valid for few minutes 
         
       })
       .catch(function (error) {
         console.log(error);
       });
      
       return accessToken;
       
  }


  // This functions returns the events data based on organizer and subject 
  // This might not be unique and therefore needs some more "tuning". 
  async function getData(accessToken, organizer, subject )
  {
      
    var accessBearer = 'Bearer '+ accessToken;
    //console.log("Access bearer val = : " + accessBearer);
    var APIcall = {
      method: 'get',
      //url: 'https://graph.microsoft.com/v1.0/users',
      // NOTE : TIME ZONE ISSUES, in Query always -by 2, method to adjust date from emails given date
      url: 'https://graph.microsoft.com/v1.0/users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/calendar/events',
      //url: 'https://graph.microsoft.com/v1.0/users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/calendar/events?select=subject,organizer,attendees,start,end',
      headers: { 
        'Authorization': accessBearer,
        'Prefer': 'outlook.timezone="South Africa Standard Time"',
        'Prefer': 'outlook.body-content-type=text'
      },
      data : data
    };
    var testString ="";
   await axios(APIcall)
    .then( function (response) {
      testString += JSON.stringify(response.data);
     // console.log(JSON.stringify(response.data));
    
    
    })
    .catch(function (error) {
      console.log(error);
    });
    return testString;
  }


  async function extractEventID(relevantData,organizer,subject)
  {
      console.log("extrace data : "+relevantData);
      console.log("extracted data organizer : "+ organizer);
      console.log("extracted data subject : "+ subject);
      var events = JSON.parse(relevantData);
      var results = [];
    var searchVal = organizer;
    for (var i=0 ; i < events.value.length ; i++)
    {
        if (events.value[i].organizer.emailAddress.address == searchVal) {
        results.push(events.value[i]);
        }
    }
      console.log(results);
      var temp = [] ;
    for (var i=0;i<results[0].attendees.length;i++)
    {
        temp.push(results[0].attendees[i].emailAddress.address);
    }
   temp = temp + '';
    console.log("TEMP ARRAY HAS THIS: "+temp);

   var test = temp.split(",");
   var jsonfied = {
    temp: temp.replace( /,$/, "" ).split(",").map(function(name) {
        return {name: name};
    })
};
    console.log(JSON.stringify(jsonfied));
    

      var object = {
          "event":
          {
              "id":results[0].id,
              "organizer": results[0].organizer.emailAddress.address,
              "attendees":  jsonfied
              ,
              "subject": results[0].subject,
              "body": results[0].body.content,
              "start": results[0].start.dateTime,    // UTC TIME
              "end": results[0].end.dateTime,

          }
      }
      console.log("IN EXTRACT EVENT THIS IS OBJECT : "+object);
      var obj=JSON.stringify(object);
     
      return obj;
  }

  // After room found, delete event from cos301 calendar event 
  //id = Event ID to delete
  // access Token = use for Oauth
  async function deleteEvent(id,accessToken){

    console.log("EVENT TO DELETE IS : "+ id);
    var accessBearer = 'Bearer '+ accessToken;
    //console.log("Access bearer val = : " + accessBearer);
    var APIcall = {
      method: 'delete',
      //url: 'https://graph.microsoft.com/v1.0/users',
      // NOTE : TIME ZONE ISSUES, in Query always -by 2, method to adjust date from emails given date
      url: 'https://graph.microsoft.com/v1.0/users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/calendar/events/'+id,
      //url: 'https://graph.microsoft.com/v1.0/users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/calendar/events?select=subject,organizer,attendees,start,end',
      headers: { 
        'Authorization': accessBearer,
        'Prefer': 'outlook.timezone="South Africa Standard Time"',
        'Prefer': 'outlook.body-content-type=text'
      },
      //data : data
    };
    var responseheader ="";
   await axios(APIcall)
    .then( function (response) {
      responseheader += JSON.stringify(response.data);
      console.log(JSON.stringify(response.data));
    
    
    })
    .catch(function (error) {
      console.log(error);
    });

  }


  async function updateEvent(event,accessToken,room){
    var eData;
    var apiData ='';
    var accessBearer = 'Bearer '+ accessToken;
    axios.patch('https://graph.microsoft.com/v1.0/users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/calendar/events/'+event.id,
    {
      location: 
      {
        displayName: room
      }
    },
    { 
      headers: {
      Authorization: `${accessBearer}`
      }
    }).then(function (response) {

      apiData += JSON.stringify(response.data);
      console.log("success");
      eData = JSON.parse(apiData);  
      checkAcceptance(event,accessBearer);//check attendeess that accepted the meeting
    })
    .catch(function (error) {
      console.log(error);
    });
    async function checkAcceptance(event1,accessBearer)
    {
      console.log("Checking acceptance");
      var _response ="";
      var event;
      var configg = {
        method: 'get',
        //url: 'https://graph.microsoft.com/v1.0/users',
        // NOTE : TIME ZONE ISSUES, in Query always -by 2, method to adjust date from emails given date
        url: 'https://graph.microsoft.com/v1.0/users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/calendar/events/'+event1.id,
        //url: 'https://graph.microsoft.com/v1.0/users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/calendar/events?select=subject,organizer,attendees,start,end',
        headers: { 
          'Authorization': accessBearer,
          'Prefer': 'outlook.timezone="South Africa Standard Time"'
        },
        data : data
      };
      
      await axios(configg)
      .then(function (response) {
        _response += JSON.stringify(response.data);
        console.log(JSON.stringify(response.data));
        event = JSON.parse(_response);  
      })
      .catch(function (error) {
        console.log(error);
      });
      

      // var acceptance = eData.attendees[0].status.response;
      var meetingID = event.id;
      var startTime = event.start.dateTime;
      var endTime = event.end.dateTime;
      var room = event.location.displayName;
      var _attendees = "";
      var org_email = event.organizer.emailAddress.address;
      var att_email = "";
      var att_response = "";
      for(let index in event.attendees) //go through all attendees
      {
        
        att_response = event.attendees[index].status.response; // store attendee response
        att_email = event.attendees[index].emailAddress.address; // store attendee email
        if(att_email != org_email) //check if attendee is not organizer of the meeting
        {
          if(att_response == "accepted")
          {
            console.log(att_email + " " + att_response);
            _attendees += att_email + ",";
            //accept();
          }
          else if(att_response == "declined")
          {
            console.log(att_email + " " + att_response);
            //decline();
          }
          else
          {
            //setTimeout(checkAcceptance,10000);
          }
        }
      }  
    accept(meetingID,startTime,endTime,_attendees,room);
    }
    function accept(mID,sTime,eTime,org,att,room)// insert a the meeting in the meetings table
    {
      console.log("Accepted:Insert");
      const conn = new Connection(config);
     conn.on("connect", err => {
        if (err) {
         
          console.error(err.message);
        } else {
          console.log("Create request");
          const request = new Request(
            `INSERT INTO Meetings (MeetingID,StartTime,EndTime,Organizer,Participants,OriginalAmenity,RoomID) VALUES('${mID}','${sTime}','${eTime}','${org}','${att}','${null}','${room}')`,
            //`SELECT [RoomID] FROM [FloorPlan]`, // SELECT ALL FROM WHERE ROOMSTATUS == EMPTY etc. 
            (err, response) => {
              if (err) {
                console.error(err.message);
              } else {
                console.log(`${response}`);
                conn.close();
              }
            }
          );
          conn.execSql(request);
        }
      });
    }

    function decline()//
    {
      console.log("Declined:Insert");
    }
}
  