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


// TABLES: AIModel, FloorPlan, UserDetails

// call:
callAPI("AIModel", "create");


// function used to call the API:
function callAPI(table, option){
    // CRUD: 
    if(option=="view"){
        view_records(table);
    }
    else if(option=="create"){

        if(table=="AIModel")
            AI_create_record();
        else if(table=="FloorPlan")
            FP_create_record();
        else if(table=="UserDetails")
            UD_create_record();

    }
    else if(option=="read"){

        var primaryKey = "officeRoomID";
        if(table == "FloorPlan")
            primaryKey = "roomID";
        else if (table == "UserDetails")
            primaryKey = "userID";

        read_record(table, primaryKey);
    }
    else if(option=="update"){

        if(table=="AIModel")
            AI_update_record();
        else if(table=="FloorPlan")
            FP_update_record();
        else if(table=="UserDetails")
            UD_update_record();

    }
    else if(option=="delete"){

        var primaryKey = "officeRoomID";
        if(table == "FloorPlan")
            primaryKey = "roomID";
        else if (table == "UserDetails")
            primaryKey = "userID";

        delete_record(table, primaryKey);
    }
        
}

function view_records(table){
    // roomID, FloorNumber, Amenities, numParticipants, Distance
    
    app.get('/', function (req, res) {
    
        sql.connect(config, function(err){
            if(err) console.log(err);

            // create Request object
            var request = new sql.Request();

            var sqlQuery = "SELECT * FROM "+table+";";

            // query to the database and get the records
            request.query(sqlQuery, function (err, recordset) {
                if (err) console.log(err);
                res.send(recordset);
            });
        }
        );
        
    });    
}

// TABLE FLOOR PLAN

function FP_create_record(){ // used to insert a record:
    // roomID, FloorNumber, Amenities, numParticipants, Distance

    app.post('/create', function (req, res) {

        sql.connect(config, function(err){
            if(err) console.log(err);

        var rID = req.body.roomID; 
        rFloorNumber = req.body.FloorNumber; 
        rAmenities = req.body.Amenities;
        var rNumParticipants = req.body.numParticipants;
        rDistance = req.body.Distance; 
        
        // check if all parameters have values:
        // if(rNumParticipants){ 

            var request = new sql.Request();
            var sqlQuery = "INSERT INTO FloorPlan (roomID, FloorNumber, Amenities, numParticipants, Distance) VALUES ('"+rID+"','"+rFloorNumber+"','"+rAmenities+"','"+ rNumParticipants+"','"+ rDistance+"');";        

            request.query(sqlQuery, function (err, recordset) {
                if (err){ 
                    res.send("Failed to insert.");
                    console.log(err);
                }
                else{
                    console.log("Room Successfully Added!");
                    res.send("Successfully Added A Record with RoomID("+rID+").");
                }
            });
        // }
        // else{
        //     console.log("Missing");
        // }

        });

    });

}

function FP_update_record(){ 

    // roomID, FloorNumber, Amenities, numParticipants, Distance

    app.post('/update', function (req, res) {

        sql.connect(config, function(err){
            if(err) console.log(err);

            // roomID, FloorNumber, Amenities, numParticipants, Distance
            var rID = req.body.roomID;
            var rFloorNumber = req.body.FloorNumber; 
            var rAmenities = req.body.Amenities;
            var rNumParticipants = req.body.numParticipants;
            var rDistance = req.body.Distance; 
    
            // check if all parameters have values:
            // if( rID >= 0 ){

                var request = new sql.Request();
                var sqlQuery = "UPDATE FloorPlan SET FloorNumber = '"+rFloorNumber+"', Amenities = '"+rAmenities+"', numParticipants = '"+rNumParticipants+"', Distance = '"+rDistance+"' WHERE roomID = '"+rID+"';";
                
                request.query(sqlQuery, function (err, recordset) {
                    if (err){ 
                        res.send("Failed to update.");
                        console.log(err);
                    }
                    else{
                        console.log("Room Successfully Updated!");
                        res.send("Successfully Updated A Record with RoomID("+rID+").");
                    }
                });

            // }

        });

    });

}

function read_record(table, primaryKey){

    // roomID, FloorNumber, Amenities, numParticipants, Distance
    app.get('/read/:rid', function (req, res) {

        sql.connect(config, function(err){
            if(err) console.log(err);
        
            var rID = req.params.rid;
            var request = new sql.Request();

            var sqlQuery = "SELECT * FROM "+ table +" WHERE "+ primaryKey + "= '"+rID+"';";            
            
            request.query(sqlQuery, function (err, recordset) {
                
                if (err){ 
                    res.send("Failed To Read Record.");
                    console.log(err);
                }
                else{
                    console.log("Record Successfully Read!");
                    res.send(recordset);
                }
            });
        });
        
    });
}

function delete_record(table, primaryKey){

    app.get('/delete/:rid', function (req, res) {

        sql.connect(config, function(err){
        if(err) console.log(err);
    
            var rID = req.params.rid;
            var request = new sql.Request();

            var sqlQuery = "DELETE FROM "+ table +" WHERE "+ primaryKey + "= '"+rID+"';";

            request.query(sqlQuery, function (err, recordset) {
                
                if (err){ 
                    res.send("Failed To Delete Record.");
                    console.log(err);
                }
                else{
                    console.log("Record Successfully Deleted!");
                    res.send("Successfully Deleted. (Primary Key = "+rID+")");
                }
            });
        
        });
    });
}

// TABLE AI MODEL:

function AI_create_record(){ // used to insert a record:

    // officeRoomID, Meeting, userID, TimeMeet

    app.post('/create', function (req, res) {

        sql.connect(config, function(err){
            if(err) console.log(err);

        var rID = req.body.officeRoomID; 
        var rMeeting = req.body.Meeting; 
        var rUserID = req.body.userID;
        var rTimeMeet = req.body.TimeMeet;
        
        // check if all parameters have values:
        // if(rMeeting && rTimeMeet){ 

            var request = new sql.Request();
            var sqlQuery = "INSERT INTO AIModel (officeRoomID, Meeting, userID, TimeMeet) VALUES ('"+rID+"','"+rMeeting+"','"+rUserID+"','"+rTimeMeet+"');";        

            request.query(sqlQuery, function (err, recordset) {
                if (err){ 
                    res.send("Failed To Insert.");
                    console.log(err);
                }
                else{
                    console.log("Record Successfully Added!");
                    res.send("Successfully Added A Record with officeRoomID("+rID+").");
                }
            });
        // }
        // else{
        //     console.log("Missing parameters.");
        // }

        });

    });

}

function AI_update_record(){ 

    // officeRoomID, Meeting, userID, TimeMeet

    app.post('/update', function (req, res) {

        sql.connect(config, function(err){
            if(err) console.log(err);

            // roomID, FloorNumber, Amenities, numParticipants, Distance
            var rID = req.body.officeRoomID; 
            var rMeeting = req.body.Meeting; 
            var rUserID = req.body.userID;
            var rTimeMeet = req.body.TimeMeet;

            // check if all parameters have values:
            // if( rMeeting && rTimeMeet ){

                var request = new sql.Request();
                var sqlQuery = "UPDATE AIModel SET Meeting = '"+rMeeting+"', userID = '"+rUserID+"', TimeMeet = '"+rTimeMeet+"' WHERE officeRoomID = '"+rID+"';";
                
                request.query(sqlQuery, function (err, recordset) {
                    if (err){ 
                        res.send("Failed to update.");
                        console.log(err);
                    }
                    else{
                        console.log("Record Successfully Updated!");
                        res.send("Successfully Updated A Record with officeRoomID("+rID+").");
                    }
                });

            // }

        });

    });

}

// TABLE USER DETAILS:

function UD_create_record(){ // used to insert a record:

    // userID, FirstName, LastName, Email, officeRoomID, AccessLevel

    app.post('/create', function (req, res) {

        sql.connect(config, function(err){
            if(err) console.log(err);

        var rID = req.body.userID; 
        var rFirstName = req.body.FirstName; 
        var rLastName = req.body.LastName;
        var rEmail = req.body.Email;
        var rOfficeRoomID = req.body.officeRoomID;
        var rAccessLevel = req.body.AccessLevel;
        
        // check if all parameters have values:
        // if( rFirstName && rLastName && rEmail && rUserID>=0 && rOfficeRoomID>=0 && rAccessLevel>=0 ){

            var request = new sql.Request();
            var sqlQuery = "INSERT INTO UserDetails (userID, FirstName, LastName, Email, officeRoomID, AccessLevel) VALUES ('"+rID+"','"+rFirstName+"','"+rLastName+"','"+rEmail+"','"+rOfficeRoomID+"','"+rAccessLevel+"');";        

            request.query(sqlQuery, function (err, recordset) {
                if (err){ 
                    res.send("Failed To Insert.");
                    console.log(err);
                }
                else{
                    console.log("Record Successfully Added!");
                    res.send("Successfully Added A Record with userID("+rID+").");
                }
            });
        // }
        // else{
        //     console.log("Missing parameters.");
        // }

        });

    });

}

function UD_update_record(){ 

    // userID, FirstName, LastName, Email, officeRoomID, AccessLevel

    app.post('/update', function (req, res) {

        sql.connect(config, function(err){
            if(err) console.log(err);

            var rID = req.body.userID; 
            var rFirstName = req.body.FirstName; 
            var rLastName = req.body.LastName;
            var rEmail = req.body.Email;
            var rOfficeRoomID = req.body.officeRoomID;
            var rAccessLevel = req.body.AccessLevel;

            
            // check if all parameters have values:
            // if( rFirstName && rLastName && rEmail && rUserID>=0 && rOfficeRoomID>=0 && rAccessLevel>=0 ){

                var request = new sql.Request();
                var sqlQuery = "UPDATE UserDetails SET FirstName = '"+rFirstName+"', LastName = '"+rLastName+"', Email = '"+rEmail+"', officeRoomID = '"+rOfficeRoomID+"', AccessLevel = '"+rAccessLevel+"' WHERE userID = '"+rID+"';";
                
                request.query(sqlQuery, function (err, recordset) {
                    if (err){ 
                        res.send("Failed to update.");
                        console.log(err);
                    }
                    else{
                        console.log("Record Successfully Updated!");
                        res.send("Successfully Updated A Record with userID("+rID+").");
                    }
                });

            // }

        });

    });

}

var server = app.listen(port, function () {
    console.log('Server Is Running On Port '+ port);
});