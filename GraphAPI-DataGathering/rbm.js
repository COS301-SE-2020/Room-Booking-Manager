const notifier = require('mail-notifier');
const axios = require('axios').default;
var qs = require('qs');
const { json } = require('body-parser');
const { timeStamp } = require('console');
const { Connection, Request } = require("tedious");
//Access the drivers
let sql = require("mssql");


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

var i=0; // initial message count of how many messages serviced yet
  async function beginProcess(mail)
  {
      //console.log("Messages processed = " + i);
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
     // console.debug(extractEventIDval);
      //console.debug( " PARSING BACK TO JSON ");
      var test = JSON.parse(extractEventIDval);
     // console.log("extract VALUE" + test.event.attendees.temp[0].name);
     // console.log("ATTENDEES extract SPECIFIC VALUE" + extractEventIDval.attendees.temp);
      var ext = extractEventIDval;
       // console.log("EXT VALUE" + JSON.stringify(ext.attendees));
       // console.log("ATTENDEES SPECIFIC VALUE" + ext.attendees);
        // var room = await findRoom(mail.from[0].address, ext);
        var AttendeesEmail = [];
        for(var i = 0; i < mail.to.length; i++)
        {
          AttendeesEmail.push(mail.to[i].address)
        }
        var room = "";
        FindRoom(mail.from[0].address, AttendeesEmail, mail.subject)
          .then(result=>{
              room = result;
              UpdateDelete()
                .catch(err=>{
                  console.log(err)
              });
          })
          .catch(err=>{
              console.log(err)
          });

        // setTimeout(afterTimeout, 15000); //Timeout event
        async function UpdateDelete()
        {
          console.log("Room found: " + room);
          var roo = 'Berlin';
          var updateRoom = await getOrgID(accessToken,test.event,room);
          
          // var deleterEvent = await deleteEvent(test.event.id,accessToken);
          //console.log("Event has been deleted:"+deleterEvent);
        }
        
 
  }
  



//----------------------------------------------------------------------------------------------
//-----------------------------------START OF FIND ROOM FUNCTION--------------------------------
//----------------------------------------------------------------------------------------------
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

async function FindRoom(Organizer, Attendees, AmenityRequired)
{

    //Configure Database
    // const config = {
    //     authentication: {
    //         options: {
    //         userName: "threshold", 
    //         password: "thresh#301" 
    //         },
    //         type: "default"
    //     },
    //     server: 'rbmserver.database.windows.net', 
    //     database: 'RBM Database',
    //     encrypt: true
    // };
    

    //Store all Emails in 1 Array
    Attendees.push(Organizer);
    for(let i = 0; i < Attendees.length; i++)
    {
      Attendees[i] = "'" + Attendees[i] + "'"; 
    }

    //Variables
    let Whiteboard = "Whiteboard = 1";
    let Projector = "Projector = 1";
    let Monitor = "Monitor = 1";
    let WhiteboardProjector = "Whiteboard = 1 AND Projector = 1";
    let WhiteboardMonitor = "Whiteboard =1 AND Monitor = 1";
    let Amenity="";
    //
    //Search Body which is a string and find Amenity
    //

    // let AmenityRequired = ("Amenity Required:  projector, board"); //String to search
    AmenityRequired = AmenityRequired.toLowerCase();


    let searchBoard = AmenityRequired.search("board");
    let searchProjector = AmenityRequired.search("projector");
    let searchMonitor = AmenityRequired.search("monitor");

    if(searchBoard != -1)
      Amenity = Whiteboard;

    if(searchMonitor != -1)
      Amenity = Monitor;

    if(searchProjector != -1)
      Amenity = Projector;

    if( searchBoard != -1 && searchProjector != -1)
      Amenity = WhiteboardProjector;

    if(searchBoard != -1 && searchMonitor != -1)
      Amenity = WhiteboardMonitor;

    if(searchBoard == -1 && searchMonitor != -1 && searchProjector != -1)
      Amenity = "";

    //Amenity Variable
    let roomName = [];
    let roomfound;

    //Distance Variable
    let LocationID = [];
    let sizeEmployee = Attendees.length;
    let distance = [];
    let averageDistance = [];
    let total = 0;
    let shortest = 10000;
    let index;


    // Function to Query the Database regarding finding a suitable room
    async function QueryDatabase () {


        //
        //---------------------AMENITIES OPTIMIZATION----------------------
        //        

        //Connect to Database
        let pool = await sql.connect(config);
       

        //Query to the database for AMENITIES
        let sqlQuery = "SELECT * FROM FloorPlan WHERE " + Amenity + "AND isAvailable = 1";
        if(Amenity == "")
            sqlQuery = "SELECT * FROM FloorPlan WHERE isAvailable = 1";

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
        sqlQuery = "SELECT * FROM EmployeeDetails WHERE EmpEmail = " + Attendees[0];
        for(let i = 1; i < sizeEmployee; i++)
        {
            if(i != sizeEmployee)
            {
                sqlQuery = sqlQuery + " OR EmpEmail = ";
            }
            sqlQuery = sqlQuery + Attendees[i];
            
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
            // let updateRoom = "'" + roomfound + "'";
            // sqlRequest = await pool.request()
            //     .input('', sql.BIT)
            //     .query("UPDATE FloorPlan SET is_Available = 0 WHERE RoomName = " + updateRoom);

            
        pool.close();
        sql.close();  

        return roomfound;
    }

    return QueryDatabase()
        .then(result=>{;
                return result;
        })
        .catch(err=>{
            sql.close();
            console.log(err)
        }); 
}

//--------------------------------------------------------------------------------------------
//-----------------------------------END OF FIND ROOM FUNCTION--------------------------------
//--------------------------------------------------------------------------------------------





  // This function gets and returns the API token used for authentication with MS Graph API
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

var org;
var sub;
var time;
  async function extractEventID(relevantData,organizer,subject)
  {
     // console.debug("extracted data : "+relevantData);
//console.debug("extracted data organizer : "+ organizer);
      //console.debug("extracted data subject : "+ subject);
      var events = JSON.parse(relevantData);
      var results = [];
    var searchVal = organizer;
    for (var i=0 ; i < events.value.length ; i++)
    {
        if (events.value[i].organizer.emailAddress.address == searchVal) {
        results.push(events.value[i]);
        }
    }
     // console.log(results);
      var temp = [] ;
    for (var i=0;i<results[0].attendees.length;i++)
    {
        temp.push(results[0].attendees[i].emailAddress.address);
    }
   temp = temp + '';
   // console.debug("TEMP ARRAY HAS THIS: "+temp);

   var test = temp.split(",");
   var jsonfied = {
    temp: temp.replace( /,$/, "" ).split(",").map(function(name) {
        return {name: name};
    })
};
    //console.log(JSON.stringify(jsonfied));
      org = results[0].organizer.emailAddress.address;
      sub = results[0].subject;
      time = results[0].start.dateTime;
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
     // console.debug("IN EXTRACT EVENT THIS IS OBJECT : "+object);
      var obj=JSON.stringify(object);
     
      return obj;
  }

  // After room found, delete event from cos301 calendar event 
  //id = Event ID to delete
  // access Token = use for Oauth
  async function deleteEvent(id,accessToken){

  //  console.debug("EVENT TO DELETE IS : "+ id);
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
      //console.log(JSON.stringify(response.data));
    
    
    })
    .catch(function (error) {
      console.log(error);
    });

  }

//************************************** */
  async function getOrgID(access,event,room)
{
 // console.debug("Getting organizer id...");
accessBearer = 'Bearer '+access;
var userDetails = "";

var users = {
  method: 'get',
  //url: 'https://graph.microsoft.com/v1.0/users',
  // NOTE : TIME ZONE ISSUES, in Query always -by 2, 
  url: 'https://graph.microsoft.com/v1.0/users',
  //url: 'https://graph.microsoft.com/v1.0/users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/calendar/events?select=subject,organizer,attendees,start,end',
  headers: { 
    'Authorization': accessBearer,
    'Prefer': 'outlook.timezone="South Africa Standard Time"'
  },
  data : data
};

await axios(users)
.then(function (response) {
  userDetails += JSON.stringify(response.data);
  var uData = JSON.parse(userDetails);
  //console.log("USERS---"+uData.value[0].displayName);
  for(let i in uData.value) //go through all users
  {
    // console.log(uData.value[i].mail+ "---USERS---"+org);
    if(uData.value[i].mail == event.organizer)
    {
     // console.debug("found match");
      orgID = uData.value[i].id;
     // console.debug(event.organizer + " has id of " + orgID);
      getMeetingID(access,orgID,room);
      //return orgID;
    }
  }
})
.catch(function (error) {
  console.log(error);
});
  
}

//get meeting id
async function getMeetingID(access,orgID,room)
{
 // console.debug("Getting meeting id...");
accessBearer = 'Bearer '+access;
var meetingID;
var eventsList = "";
var eventData;
//console.debug(orgID);
var userEvents = {
  method: 'get',
  //url: 'https://graph.microsoft.com/v1.0/users',
  // NOTE : TIME ZONE ISSUES, in Query always -by 2, method to adjust date from emails given date
  url: 'https://graph.microsoft.com/v1.0/users/'+orgID+'/calendar/events?$select=id,subject,start',
  //url: 'https://graph.microsoft.com/v1.0/users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/calendar/events?select=subject,organizer,attendees,start,end',
  headers: { 
    'Authorization': accessBearer,
    'Prefer': 'outlook.timezone="South Africa Standard Time"'
  },
  data : data
};

await axios(userEvents)
.then(function (response) {
  eventsList += JSON.stringify(response.data);
  eventData = JSON.parse(eventsList);
  //console.debug(eventData);
 // console.debug(sub + "-----" + time);
  for(let i in eventData.value) //go through all users
  {

  //console.log("Event "+ i + " " + eventData.value[i].subject + " " + eventData.value[i].start.dateTime);
    if(eventData.value[i].subject == sub)// && eventData.value[i].start.dateTime === time)
    {
     // console.debug("meeting found");
      meetingID = eventData.value[i].id;
      // updateEvent(access,orgID,meetingID,room);
      //return meetingID;
    }
  }
 // console.debug("meeting id " + meetingID);
  updateEvent(access,orgID,meetingID,room);
})
.catch(function (error) {
  console.log(error);
});
 
}

  async function updateEvent(accessToken,organiserID,eventID,room){
    console.log("Updating event location");
    //var organiserID = await getOrgID(accessToken,event.organizer);
    //console.log(organiserID + " was id returned");
    //var eventID = getMeetingID(organiserID,accessToken);
    //console.debug("Org ID " + organiserID + " event id " + eventID);
    var eData;
    var apiData ='';
    var accessBearer = 'Bearer '+ accessToken;
    var url = "https://graph.microsoft.com/v1.0/users/" + organiserID + "/calendar/events/" + eventID;
    axios.patch(url,
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
     // console.debug("success");
      eData = JSON.parse(apiData);  
      checkAcceptance(accessBearer,organiserID,eventID);//check attendeess that accepted the meeting
    })
    .catch(function (error) {
      console.log(error);
    });
    async function checkAcceptance(accessBearer,orgID,MeetingID)
    {
     // console.debug("Checking acceptance");
      var _response ="";
      var event;
      //var _url = "https://graph.microsoft.com/v1.0/users/" + orgID + "/calendar/events/" + MeetingID;
      var configg = {
        method: 'get',
        //url: 'https://graph.microsoft.com/v1.0/users',
        // NOTE : TIME ZONE ISSUES, in Query always -by 2, method to adjust date from emails given date
        url: "https://graph.microsoft.com/v1.0/users/"+ orgID +"/calendar/events/"+ MeetingID,
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
        //console.log(JSON.stringify(response.data));
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
            //console.debug(att_email + " " + att_response);
            _attendees += att_email + ",";
            //accept();
          }
          else if(att_response == "declined")
          {
           // console.debug(att_email + " " + att_response);
            //decline();
          }
          else
          {
            //console.debug(att_email + " hasn't repsonded");
            setTimeout(checkAcceptance,60000);
          }
        }
      }  
      accept(meetingID, startTime, endTime, org_email, _attendees, room);
    }
    function accept(mID,sTime,eTime,org,att,room)// insert a the meeting in the meetings table
    {
     // console.debug("Accepted:Insert");
      const conn = new Connection(config);
     conn.on("connect", err => {
        if (err) {
         
          console.error(err.message);
        } else {
         // console.log("Create request");
          var x = new Date(sTime).toISOString();
          var y = new Date(eTime).toISOString();

          var amenity = "Blackboard";

          console.log(
              "StartTime = " +
                  x +
                  "\n EndTime =  " +
                  y +
                  "\n Organizer =  " +
                  org +
                  " \n Participants =  " +
                  att +
                  "\n Amenity =  " +
                  amenity +
                  " \n Room =  " +
                  room
          );

          const request = new Request(
              `INSERT INTO Meetings VALUES('${mID}','${x}', '${y}', '${org}', '${att}', '${amenity}', '${room}')`,
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

}
  