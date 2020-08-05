var mysql = require('mysql');
var express = require('express');
var bodyParser= require('body-parser');
var app = express();

app.use(bodyParser.json());

var PORT = process.env.PORT || 10000;

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "cos301"
});

//connecting to db
connection.connect(function(err) {
  if (err){
  	throw err;
  	console.log("error");
  }

  else{
  	 console.log("Connected!");
  }
 
});

//floor plan (retrieves all available rooms) 
app.get('/FloorPlan', function(req, res){
		
	var sql ="SELECT * FROM floorplan;";

	connection.query(sql, function (err, result) {
    if (err){
	    res.writeHead(404);//not found or other error
		res.end();
	    } 
    else{
	    res.send(result);
		}
	});
});

//retrieve a specific room
app.get('/FloorPlan:id', function(req, res){
       
        var id=req.params["id"];
    var sql ="SELECT * FROM floorplan WHERE RoomID ="+id;

    connection.query(sql, function (err, result) {
    if (err){
        res.writeHead(404);//not found or other error
        res.end();
        } 
    else{
        console.log(result);
        res.send(result);
        }
    });
});
//get available rooms
app.get('/FloorPlan/available', function(req, res){
       
        
    var sql ="SELECT * FROM floorplan WHERE isAvailable = 1";

    connection.query(sql, function (err, result) {
    if (err){
        res.writeHead(404);//not found or other error
        res.end();
        } 
    else{
        console.log(result);
        res.send(result);
        }
    });
});
//inserts new room in floorplan table
app.post('/FloorPlan',function(req, res){
		console.log(req.body);
	var sql = "INSERT INTO floorplan (RoomID, RoomName,FloorNumber,maxSeats,Amenity,Building,Whiteboard,Projector,Monitor,isExternal,isAvailable)"+
	"VALUES('" +
			req.body.RoomID +
            "','" +
            req.body.RoomName +
            "','" +
            req.body.FloorNumber +
            "','" +
            req.body.maxSeats +
            "','" +
            req.body.Amenity +
            "','" +
            req.body.Building +
            "','" +
            req.body.Whiteboard +
            "','" +
            req.body.Projector +
            "','" +
            req.body.Monitor +
            "','" +
            req.body.isExternal +
            "','" +
            req.body.isAvailable +
            "');";

   connection.query(sql, function (err, result) {
    if (err){
    res.writeHead(403);//already exists or other error
	res.end();
    } 
    else{
    console.log("1 record inserted");
    res.writeHead(204);
	res.end();
	}
  });

	});

//delete meeting room from floorplan table
app.delete('/FloorPlan/:id', function(req, res){

		var id=req.params["id"];
		console.log(id);
		var sql ="DELETE FROM FloorPlan WHERE RoomID = '" + id + "';";
		connection.query(sql, function (err, result) {
	    if (err){
	    	console.log(err);
	    res.writeHead(404);//already exists or other error
		res.end();
	    } 
	    else{
	    res.writeHead(204);
		res.end();
		}
	  });
	});

//update meeting room in floorplan table
app.post('/FloorPlanUpdate',function(req, res){

 var sql =
            "UPDATE FloorPlan SET RoomID = '" +
            req.body.RoomID +
            "', RoomName = '" +
            req.body.RoomName +
            "', FloorNumber = '" +
            req.body.FloorNumber +
            "', maxSeats = '" +
            req.body.maxSeats +
            "', Amenity = '" +
            req.body.Amenity +
            "', Building = '" +
            req.body.Building +
            "', Whiteboard = '" +
            req.body.Whiteboard +
            "', Projector = '" +
            req.body.Projector +
            "', Monitor = '" +
            req.body.Monitor +
            "', isExternal = '" +
            req.body.isExternal +
            "', isAvailable = '" +
            req.body.isAvailable +
            "' WHERE RoomID = '" +
            req.body.RoomID +
            "';";

	connection.query(sql, function (err, result) {
	    if (err){
	    res.writeHead(403);//already exists or other error
		res.end();
	    } 
	    else{
	    console.log("1 record updated");
	    res.writeHead(204);
		res.end();
		}
	  });
     });

//distance
//retrieves distances  rooms
app.get('/distance', function(req, res){
		
	var sql ="SELECT * FROM distance;";

	connection.query(sql, function (err, result) {
    if (err){
	    res.writeHead(404);//not found or other error
		res.end();
	    } 
    else{
	    res.send(result);
		}
	});
});

//retrieve a specific rooms distances to other rooms
app.get('/distance:id', function(req, res){
       
        var id=req.params["id"];
    var sql ="SELECT * FROM distance WHERE Rooms ="+id;

    connection.query(sql, function (err, result) {
    if (err){
        res.writeHead(404);//not found or other error
        res.end();
        } 
    else{
        console.log(result);
        res.send(result);
        }
    });
});

//inserts a distance of room from entrance
app.post('/distance',function(req, res){
		
	var sql = "INSERT INTO distance (Rooms, Texas,Colorado,Mississippi,NewJersey,NewYork,California,Florida,Pennsylvania,Georgia,Tennessee,Washington)"+
	"VALUES('" +
           req.body.Rooms +
            "','" +
            req.body.Texas +
            "','" +
            req.body.Colorado +
            "','" +
            req.body.Mississippi +
            "','" +
            req.body.NewJersey +
            "','" +
            req.body.NewYork +
            "','" +
            req.body.California +
            "','" +
            req.body.Florida +
            "','" +
            req.body.Pennsylvania +
            "','" +
            req.body.Georgia +
            "','" +
            req.body.Tennessee +
            "','" +
            req.body.Washington +
            "');";

   connection.query(sql, function (err, result) {
    if (err){
    res.writeHead(403);//already exists or other error
	res.end();
    } 
    else{
    console.log("1 record inserted");
    res.writeHead(204);
	res.end();
	}
  });

	});

//delete calculated distance
app.delete('/distance/:id', function(req, res){

		var id=req.params["id"];
		console.log(id);
		var sql ="DELETE FROM distance WHERE Rooms = '" + id + "';";
		connection.query(sql, function (err, result) {
	    if (err){
	    res.writeHead(404);//already exists or other error
		res.end();
	    } 
	    else{
	    res.writeHead(204);
		res.end();
		}
	  });
	});

//update distance of room
app.post('/distanceUpdate',function(req, res){

 var sql =
            "UPDATE Distance SET Texas = '" +
            req.body.Texas +
            "', Colorado = '" +
            req.body.Colorado +
            "', Mississippi = '" +
            req.body.Mississippi +
            "', NewJersey = '" +
            req.body.NewJersey +
            "', NewYork = '" +
            req.body.NewYork +
            "', California = '" +
            req.body.California +
            "', Florida = '" +
            req.body.Florida +
            "', Pennsylvania = '" +
            req.body.Pennsylvania +
            "', Georgia = '" +
            req.body.Georgia +
            "', Tennessee = '" +
            req.body.Tennessee +
            "', Washington = '" +
            req.body.Washington +
            "' WHERE Rooms = '" +
            req.body.Rooms +
            "';";

	connection.query(sql, function (err, result) {
	    if (err){
	    res.writeHead(403);//already exists or other error
		res.end();
	    } 
	    else{
	    console.log("1 record updated");
	    res.writeHead(204);
		res.end();
		}
	  });
     });

//employeeDetails
//retrieves employee details
app.get('/employeeDetails', function(req, res){
		
	var sql ="SELECT * FROM employeedetails;";

	connection.query(sql, function (err, result) {
    if (err){
	    res.writeHead(404);//not found or other error
		res.end();
	    } 
    else{
	    res.send(result);
		}
	});
});

//get specific employee
app.get('/employeeDetails:id', function(req, res){
       
        var id=req.params["id"];
    var sql ="SELECT * FROM floorplan WHERE EmpEmail = " + id;

    connection.query(sql, function (err, result) {
    if (err){
        res.writeHead(404);//not found or other error
        res.end();
        } 
    else{
        console.log(result);
        res.send(result);
        }
    });
});

//add employee details
app.post('/employeeDetails',function(req, res){
		
	var sql = "INSERT INTO employeedetails (FirstName, LastName,EmpEmail,EmpPassword,isAdmin,LocationID)"+
	"VALUES('" +
			req.body.FirstName +
            "','" +
            req.body.LastName +
            "','" +
            req.body.EmpEmail +
            "','" +
            req.body.EmpPassword +
            "','" +
            req.body.isAdmin +
            "','" +
            req.body.LocationID +
            "');";

   connection.query(sql, function (err, result) {
    if (err){
    res.writeHead(403);//already exists or other error
	res.end();
    } 
    else{
    console.log("1 record inserted");
    res.writeHead(204);
	res.end();
	}
  });

	});

//remove employee details
app.delete('/employeeDetails/:id', function(req, res){

		var id=req.params["id"];
		console.log(id);
		var sql ="DELETE FROM employeedetails WHERE EmpEmail = '" + id + "';";
		connection.query(sql, function (err, result) {
	    if (err){
	    res.writeHead(404);//already exists or other error
		res.end();
	    } 
	    else{
	    res.writeHead(204);
		res.end();
		}
	  });
	});

//update employee details
app.post('/employeeDetailsUpdate',function(req, res){

 var sql =
            "UPDATE EmployeeDetails SET FirstName = '" +
            req.body.FirstName +
            "', LastName = '" +
            req.body.LastName +
            "', EmpEmail = '" +
            req.body.EmpEmail +
            "', EmpPassword = '" +
            req.body.EmpPassword +
            "', LocationID = '" +
            req.body.LocationID +
            "', isAdmin = '" +
            req.body.isAdmin +
            "' WHERE EmpEmail = '" +
            req.body.EmpEmail +
            "';";

	connection.query(sql, function (err, result) {
	    if (err){
	    res.writeHead(403);//already exists or other error
		res.end();
	    } 
	    else{
	    console.log("1 record updated");
	    res.writeHead(204);
		res.end();
		}
	  });
     });

//Meetings
//retrieve all booked meetings
app.get('/Meetings', function(req, res){
		
	var sql ="SELECT * FROM meetings;";

	connection.query(sql, function (err, result) {
    if (err){
	    res.writeHead(404);//not found or other error
		res.end();
	    } 
    else{
	    res.send(result);
		}
	});
});

//retrieve a specific meeting's details
app.get('/Meetings:id', function(req, res){
       
        var id=req.params["id"];
    var sql ="SELECT * FROM distance WHERE MeetingID ="+id;

    connection.query(sql, function (err, result) {
    if (err){
        res.writeHead(404);//not found or other error
        res.end();
        } 
    else{
        console.log(result);
        res.send(result);
        }
    });
});

//add a meetings details
app.post('/Meetings',function(req, res){
		
	var sql = "INSERT INTO meetings (MeetingID, StartTime,EndTime,Organizer,Participants,OriginalAmenity,RoomID)"+
	"VALUES('" +
             req.body.MeetingID +
            "','" +
            req.body.StartTime +
            "','" +
            req.body.EndTime +
            "','" +
            req.body.Organizer +
            "','" +
            req.body.Participants +
            "','" +
            req.body.OriginalAmenity +
            "','" +
            req.body.RoomID +
            "');";

   connection.query(sql, function (err, result) {
    if (err){
    res.writeHead(403);//already exists or other error
	res.end();
    } 
    else{
    console.log("1 record inserted");
    res.writeHead(204);
	res.end();
	}
  });

	});

//remove a meetings details
app.delete('/Meetings/:id', function(req, res){

		var id=req.params["id"];
		console.log(id);
		var sql ="DELETE FROM meetings WHERE MeetingID = '" + id + "';";
		connection.query(sql, function (err, result) {
	    if (err){
	    res.writeHead(404);//already exists or other error
		res.end();
	    } 
	    else{
	    res.writeHead(204);
		res.end();
		}
	  });
	});

//update an existing meetings details
app.post('/MeetingsUpdate',function(req, res){

 var sql =
            "UPDATE meetings SET StartTime = '" +
            req.body.StartTime +
            "', EndTime = '" +
            req.body.EndTime +
            "', Organizer = '" +
            req.body.Organizer +
            "', Participants = '" +
            req.body.Participants +
            "', OriginalAmenity = '" +
            req.body.OriginalAmenity +
            "', RoomID = '" +
            req.body.RoomID +
            "' WHERE MeetingID = '" +
            req.body.MeetingID +
            "';";

	connection.query(sql, function (err, result) {
	    if (err){
	    res.writeHead(403);//already exists or other error
		res.end();
	    } 
	    else{
	    console.log("1 record updated");
	    res.writeHead(204);
		res.end();
		}
	  });
     });

app.listen(PORT);
