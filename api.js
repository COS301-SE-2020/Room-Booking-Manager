const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 65000;

var connected = false;

var sql = require("mssql");

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

const config = {
    user: 'threshold',
    password: 'thresh#301',
    server: 'rbm-server.database.windows.net', 
    database: 'Room Booking Manager Database' 
};

var table = "";
var operation = "";
var bodyData = "";

// for all post requests:
app.post('/', function (req, res) {

    table = req.body.table;
    operation = req.body.request;
    bodyData = req.body.data;

    callAPI(table, operation, bodyData, res);
});

/*

{
	"table":"FloorPlan",
	"request" : "read",
	"data":{"roomID":"1", "FloorNumber":"2", "Amenities":"Greenboard", "numParticipants":"10", "Distance":"10"}
}

*/

// TABLES: AIModel, FloorPlan, UserDetails

// function used to call the API:
function callAPI(table, option, data, res){
    // CRUD: 

    if(option=="delete" || option=="read"){

        var recordID = 0;
        var primaryKey = "officeRoomID";

        if(table == "AIModel"){
            recordID = data.officeRoomID;
        }
        else if(table == "FloorPlan"){
            primaryKey = "roomID";
            recordID = data.roomID;
        }
        else if (table == "UserDetails"){
            primaryKey = "userID";
            recordID = data.userID;
        }


        if(option=="delete"){
           var x = delete_record(table, primaryKey, recordID, res);    
           return x;   
        } 
        else{
            var x = read_record(table, primaryKey, recordID, res);
            return x;
        }
        
    }
    if(option=="view"){

        view_records(table, res);
    }
    else if(option=="create"){ // POST

        if(table=="AIModel"){
            AI_create_record(data, res);
        }
        else if(table=="FloorPlan")
            FP_create_record(data, res);
        else if(table=="UserDetails")
            UD_create_record(data, res);

    }
    else if(option=="update"){ // POST

        if(table=="AIModel")
            AI_update_record(data, res);
        else if(table=="FloorPlan")
            FP_update_record(data, res);
        else if(table=="UserDetails")
            UD_update_record(data, res);
    }
        
}

function read_record(table, primaryKey, recordID, res){

    sql.connect(config, function(err){
        if(err) console.log(err);

        var request = new sql.Request();
        var sqlQuery = "SELECT * FROM "+ table +" WHERE "+ primaryKey + "= '"+recordID+"';";            

        request.query(sqlQuery, function (err, recordset) {
            if (err){ 
                console.log(err);
                res.send("Error: Failed To Read Record.");
            }
            else{
                if(recordset.recordset.length == 0){
                    console.log("Error: Failed To Find Record With ID = "+recordID);
                    res.send("Error: Failed To Find Record With ID = "+recordID);
                }
                else{
                    console.log("Record Successfully Retrieved! (ID = "+recordID+")");
                    res.send(recordset.recordset);
                }
            }
        });
    });        
}


function view_records(table, res){
    // roomID, FloorNumber, Amenities, numParticipants, Distance
    
    sql.connect(config, function(err){
        if(err) console.log(err);

        // create Request object
        var request = new sql.Request();

        var sqlQuery = "SELECT * FROM "+table+";";

        // query to the database and get the records
        request.query(sqlQuery, function (err, recordset) {
            if (err){ 
                console.log(err);
                res.send("Error: Failed To View All Records.");
            }
            else{
                if(recordset.recordset.length == 0){
                    console.log("Error: Table is empty.");
                    res.send("Error: Table is empty.");
                }
                else{
                    console.log("All Records Successfully Viewed!");
                    res.send(recordset.recordset);
                }
            }
        });
    }
    );        
}

// TABLE FLOOR PLAN

function FP_create_record(body_data, res){ // used to insert a record:
    // roomID, FloorNumber, Amenities, numParticipants, Distance

        sql.connect(config, function(err){
            if(err) console.log(err);

        var rID = body_data.roomID; 
        rFloorNumber = body_data.FloorNumber; 
        rAmenities = body_data.Amenities;
        var rNumParticipants = body_data.numParticipants;
        rDistance = body_data.Distance; 
        
        var request = new sql.Request();
        var sqlQuery = "INSERT INTO FloorPlan (roomID, FloorNumber, Amenities, numParticipants, Distance) VALUES ('"+rID+"','"+rFloorNumber+"','"+rAmenities+"','"+ rNumParticipants+"','"+ rDistance+"');";        

        request.query(sqlQuery, function (err, recordset) {
            if (err){ 
                console.log(err);
                res.send("Error: Failed to insert.");
            }
            else{
                console.log("Record Successfully Created! (ID = "+rID+")");
                res.send("Record Successfully Created. (ID = "+rID+")");
            }
        });
    });

}

function FP_update_record(body_data, res){ 

    // roomID, FloorNumber, Amenities, numParticipants, Distance

        sql.connect(config, function(err){
            if(err) console.log(err);

            var rID = body_data.roomID;
            var rFloorNumber = body_data.FloorNumber; 
            var rAmenities = body_data.Amenities;
            var rNumParticipants = body_data.numParticipants;
            var rDistance = body_data.Distance; 
    
            var request = new sql.Request();
            var sqlQuery = "UPDATE FloorPlan SET FloorNumber = '"+rFloorNumber+"', Amenities = '"+rAmenities+"', numParticipants = '"+rNumParticipants+"', Distance = '"+rDistance+"' WHERE roomID = '"+rID+"';";
            
            request.query(sqlQuery, function (err, recordset) {
                if (err){ 
                    console.log(err);
                    res.send("Error: Failed to update.");
                }
                else{
                    console.log("Record Successfully Updated! (ID = "+rID+")");
                    res.send("Record Successfully Updated. (ID = "+rID+")");
                }
            });
    });

}

function delete_record(table, primaryKey, recordID, res){

    sql.connect(config, function(err){
    if(err) console.log(err);

        var request = new sql.Request();

        var sqlQuery = "SELECT * FROM "+ table +" WHERE "+ primaryKey + "= '"+recordID+"';";            

        request.query(sqlQuery, function (err, recordset) {
            if (err){ 
                console.log(err);
                res.send("Error: Failed To Read Record.");
            }
            else{
                if(recordset.recordset.length == 0){
                    console.log("Error: Failed To Find Record With ID = "+recordID);
                    res.send("Error: Failed To Find Record With ID = "+recordID);
                }
                else{

                    sqlQuery = "DELETE FROM "+ table +" WHERE "+ primaryKey + "= '"+recordID+"';";

                    request.query(sqlQuery, function (err, recordset) {
                        if (err){ 
                            console.log(err);
                            res.send("Error: Failed To Delete Record.");
                        }
                        else{
                            console.log("Record Successfully Deleted! (ID = "+recordID+")");
                            res.send("Record Successfully Deleted. (ID = "+recordID+")");
                        }
                    });
                }
            }
        });
    
    });
}

// TABLE AI MODEL:

function AI_create_record(body_data, res){ // used to insert a record:

    // officeRoomID, Meeting, userID, TimeMeet

    sql.connect(config, function(err){
        if(err) console.log(err);

        var rID = body_data.officeRoomID; 
        var rMeeting = body_data.Meeting; 
        var rUserID = body_data.userID;
        var rTimeMeet = body_data.TimeMeet;
        
        var request = new sql.Request();
        var sqlQuery = "INSERT INTO AIModel (officeRoomID, Meeting, userID, TimeMeet) VALUES ('"+rID+"','"+rMeeting+"','"+rUserID+"','"+rTimeMeet+"');";        

        request.query(sqlQuery, function (err, recordset) {
            if (err){ 
                console.log(err);
                res.send("Error: Failed To Insert.");
            }
            else{
                console.log("Record Successfully Created! (ID = "+rID+")");
                res.send("Record Successfully Created. (ID = "+rID+")");
            }
        });
    });

}

function AI_update_record(body_data, res){ 

    // officeRoomID, Meeting, userID, TimeMeet

        sql.connect(config, function(err){
            if(err) console.log(err);

            // roomID, FloorNumber, Amenities, numParticipants, Distance
            var rID = body_data.officeRoomID; 
            var rMeeting = body_data.Meeting; 
            var rUserID = body_data.userID;
            var rTimeMeet = body_data.TimeMeet;

            var request = new sql.Request();
            var sqlQuery = "UPDATE AIModel SET Meeting = '"+rMeeting+"', userID = '"+rUserID+"', TimeMeet = '"+rTimeMeet+"' WHERE officeRoomID = '"+rID+"';";
            
            request.query(sqlQuery, function (err, recordset) {
                if (err){ 
                    console.log(err);
                    res.send("Error: Failed to update.");
                }
                else{
                    console.log("Record Successfully Updated! (ID = "+rID+")");
                    res.send("Record Successfully Updated. (ID = "+rID+")");
                }
            });

    });

}

// TABLE USER DETAILS:

function UD_create_record(body_data, res){ // used to insert a record:

    // userID, FirstName, LastName, Email, officeRoomID, AccessLevel

        sql.connect(config, function(err){
            if(err) console.log(err);

        var rID = body_data.userID; 
        var rFirstName = body_data.FirstName; 
        var rLastName = body_data.LastName;
        var rEmail = body_data.Email;
        var rOfficeRoomID = body_data.officeRoomID;
        var rAccessLevel = body_data.AccessLevel;
        
        var request = new sql.Request();
        var sqlQuery = "INSERT INTO UserDetails (userID, FirstName, LastName, Email, officeRoomID, AccessLevel) VALUES ('"+rID+"','"+rFirstName+"','"+rLastName+"','"+rEmail+"','"+rOfficeRoomID+"','"+rAccessLevel+"');";        

        request.query(sqlQuery, function (err, recordset) {
            if (err){ 
                console.log(err);
                res.send("Error: Failed To Insert.");
            }
            else{
                console.log("Record Successfully Created! (ID = "+rID+")");
                res.send("Record Successfully Created. (ID = "+rID+")");
            }
        });
    });

}

function UD_update_record(body_data, res){ 

    // userID, FirstName, LastName, Email, officeRoomID, AccessLevel

        sql.connect(config, function(err){
            if(err) console.log(err);

            var rID = body_data.userID; 
            var rFirstName = body_data.FirstName; 
            var rLastName = body_data.LastName;
            var rEmail = body_data.Email;
            var rOfficeRoomID = body_data.officeRoomID;
            var rAccessLevel = body_data.AccessLevel;

            var request = new sql.Request();
            var sqlQuery = "UPDATE UserDetails SET FirstName = '"+rFirstName+"', LastName = '"+rLastName+"', Email = '"+rEmail+"', officeRoomID = '"+rOfficeRoomID+"', AccessLevel = '"+rAccessLevel+"' WHERE userID = '"+rID+"';";
            
            request.query(sqlQuery, function (err, recordset) {
                if (err){ 
                    console.log(err);
                    res.send("Error: Failed to update.");
                }
                else{
                    console.log("Record Successfully Updated! (ID = "+rID+")");
                    res.send("Record Successfully Updated. (ID = "+rID+")");
                }
            });

    });

}

var server = app.listen(port, function () {
    console.log('Server Is Running On Port '+ port);
});