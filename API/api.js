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

var rFloorNumber = 0; 
var rAmenities = "None";
var rDistance = 0;

// function used to call the API ()
function callAPI(option){
    // CRUD: 
    if(option=="view")
        view_rooms();
    else if(option=="create")
        create_room();
    else if(option=="read")
        read_room();
    else if(option=="update")
        update_room();
    else if(option=="delete")
        delete_room();
}

function view_rooms(){
    // roomID, FloorNumber, Amenities, numParticipants, Distance
    
    app.get('/', function (req, res) {
    
        sql.connect(config, function(err){
            if(err) console.log(err);

            // create Request object
            var request = new sql.Request();

            var sqlQuery = "SELECT * FROM FloorPlan;";

            // query to the database and get the records
            request.query(sqlQuery, function (err, recordset) {
                if (err) console.log(err);
                res.send(recordset);
            });
        }
        );
        
    });    
}

function create_room(){ // used to insert a record:
    // roomID, FloorNumber, Amenities, numParticipants, Distance

    app.post('/createroom', function (req, res) {

        sql.connect(config, function(err){
            if(err) console.log(err);

        var rID = req.body.roomID; 
        rFloorNumber = req.body.FloorNumber; 
        rAmenities = req.body.Amenities;
        var rNumParticipants = req.body.numParticipants;
        rDistance = req.body.Distance; 
        
        // check if all parameters have values:
        if(rNumParticipants){ 

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
        }
        else{
            console.log("Missing");
        }

        });

    });


}

function update_room(){ 

    // roomID, FloorNumber, Amenities, numParticipants, Distance

    app.post('/updateroom', function (req, res) {

        sql.connect(config, function(err){
            if(err) console.log(err);

            // roomID, FloorNumber, Amenities, numParticipants, Distance
            var rID = req.body.roomID;
            var rFloorNumber = req.body.FloorNumber; 
            var rAmenities = req.body.Amenities;
            var rNumParticipants = req.body.numParticipants;
            var rDistance = req.body.Distance; 
    
            // check if all parameters have values:
            if( rID >= 0 ){

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

            }

        });

    });

}

function read_room(){

    // roomID, FloorNumber, Amenities, numParticipants, Distance
    app.get('/readroom/:rid', function (req, res) {

        sql.connect(config, function(err){
            if(err) console.log(err);
        
            var rID = req.params.rid;
            var request = new sql.Request();

            var sqlQuery = "SELECT * FROM FloorPlan WHERE roomID = '"+rID+"';";
            
            request.query(sqlQuery, function (err, recordset) {
                
                if (err){ 
                    res.send("Failed to read record.");
                    console.log(err);
                }
                else{
                    console.log("Room Successfully Read!");
                    res.send(recordset);
                }
            });
        });
        
    });
}

function delete_room(){

    // roomID, FloorNumber, Amenities, numParticipants, Distance
    app.get('/deleteroom/:rid', function (req, res) {

        sql.connect(config, function(err){
        if(err) console.log(err);
    
            var rID = req.params.rid;
            var request = new sql.Request();

            var sqlQuery = "DELETE FROM FloorPlan WHERE roomID = '"+rID+"';";

            request.query(sqlQuery, function (err, recordset) {
                
                if (err){ 
                    res.send("Failed to delete record.");
                    console.log(err);
                }
                else{
                    console.log("Room Successfully Deleted!");
                    res.send("Room Successfully Deleted. (RoomID = "+rID+")");
                }
            });
        
        });
    });
}

var server = app.listen(port, function () {
    console.log('Server Is Running On Port '+ port);
});