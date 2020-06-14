First, use the command: npm init

The following API uses port number: 65000

In order to use the API, three dependencies are needed.
Dependecies and how to install them:
	express = npm install express --save
	bodyParser = npm install body-parser --save
	sql = npm install mssql --save

The API provided makes use of a function named callAPI(option) where the argument 'option'  is one of the follow:
	view
	create
	read
	update
	delete
	
The function callAPI() will then call the respective procedures such that operations can occur.

Each function that callAPI() calls connects with the Room Booking Manager Database using a config file with pre-set credentials.
The respective called functions are then executed using mssql and information messages are then sent back to communicate the status of the request.

How to use API:

1) From a client page, you can view the database records by calling:
	callAPI("view");
	
	That is to say: GET localhost:65000
	To display all records in the table.

2) You can create/insert a new record or update by calling:
	callAPI("create");
	OR
	callAPI("update");
	respectively.
	
	These functions use a POST method with a BODY field of data type JSON in the following manner:
	
	{
            "roomID": 1,
            "FloorNumber": 2,
            "Amenities": "Whiteboard",
            "numParticipants": 10,
            "Distance": 0
        }
	
	That is: 
		POST localhost:65000/createroom
	OR
		POST localhost:65000/updateroom
	With a body field attached.

These attributes will be used to create a new record.

4) You can Read or Delete a record by using the following format:
	localhost:port/readroom/roomID
	
	That is: GET localhost:65000/readroom/1
	And: GET localhost:65000/deleteroom/1
	
	To filter using room with ID=1 or delete that room.