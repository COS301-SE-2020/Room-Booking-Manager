//Access the drivers
let sql = require("mssql");

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

let OrganizerEmail = "COS301@teamthreshold.onmicrosoft.com";
let AttendeesEmail = ["AdeleV@teamthreshold.onmicrosoft.com"];

//Store all Emails in 1 Array
AttendeesEmail.push(OrganizerEmail);
for(let i = 0; i < AttendeesEmail.length; i++)
{
    AttendeesEmail[i] = "'" + AttendeesEmail[i] + "'"; 
}

//Variables
let Whiteboard = "Whiteboard = 1";
let Projector = "Projector = 1";
let Monitor = "Monitor = 1";
let WhiteboardProjector = "Whiteboard = 1 AND Projector = 1";
let WhiteboardMonitor = "Whiteboard =1 AND Monitor = 1";

let Amenity = "";

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

Amenity = Whiteboard;

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
    sqlQuery = "SELECT * FROM EmployeeDetails WHERE Email = " + AttendeesEmail[0];
    for(let i = 1; i < sizeEmployee; i++)
    {
        if(i != sizeEmployee)
        {
            sqlQuery = sqlQuery + " OR Email = ";
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

    nonDB();
}

function nonDB (){
    console.log("The most suitable meeting room is: " + roomfound);
    //
    // The REST OF THE CODE GOES BELOW (SEND USER NOTIFICATION)
    //
}

queryDatabase()
    .catch(err=>{
        pool.close();
        sql.close();
        console.log(err)
    })






    





