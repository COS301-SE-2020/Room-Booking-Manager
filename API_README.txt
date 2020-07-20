The following API uses port number: 65000

In order to use the API, three dependencies are needed.
Dependecies and how to install them:
	express = npm install express --save
	bodyParser = npm install body-parser --save
	sql = npm install mssql --save

The API provided makes use of a function named callAPI(table, option, data, res) where the arguments are as follows:
	
(a) 'table' is one of the following:  EmployeeDetails, Distance, FloorPlan, Meetings
(b) 'option' can be any of the following: 	
	view
	create
	read
	update
	delete
(c) 'data' is the request body that goes with the POST method, consisting of the table name, request type ('option') and the data needed to process the request, in JSON format.
	
Each function that callAPI() calls connects with the Room Booking Manager Database using a config file with pre-set credentials.
The respective called functions are then executed using mssql and information messages are then sent back to communicate the status of the request.

How to use API:

1) From a client page, you can view the database records by calling:
	POST localhost:65000 
	with body: 
			{
				"table" : "FloorPlan",
				"request" : "view",
				"data" : {
								"RoomID":"1P2", // comment: required for 'view' "FloorNumber":"2", // comment: NOT required for 'view'
								"Amenities":"Greenboard", // comment: NOT required for 'view'
								"numParticipants":"10", // comment: NOT required for 'view'
								"Distance":"10" // comment: NOT required for 'view'
							}
			}

	Such that the following function is called: callAPI("FloorPlan","view", data, res);
	
	This will communicate with the server in order to display all records in the FloorPlan table.

Similarly, the requests named above ('option') will be executed by changing the option.