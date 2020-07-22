const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 65000;

var sql = require("mssql");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const config = {
    user: "threshold",
    password: "thresh#301",
    server: "rbmserver.database.windows.net",
    database: "RBM Database",
};

var table = "";
var operation = "";
var bodyData = "";

// for all post requests:
app.post("/", function (req, res) {
    table = req.body.table;
    operation = req.body.request;
    bodyData = req.body.data;

    callAPI(table, operation, bodyData, res);
});

// TABLES: EmployeeDetails, Distance, FloorPlan, Meetings

// function used to call the API:
function callAPI(table, option, data, res) {
    // CRUD:

    let recordID;
    let primaryKey;

    if (option == "delete" || option == "read") {
        if (table == "Distance") {
            primaryKey = "Rooms";
            recordID = data.Rooms;
        } else if (table == "FloorPlan") {
            primaryKey = "RoomID";
            recordID = data.RoomID;
        } else if (table == "EmployeeDetails") {
            primaryKey = "EmpEmail";
            recordID = data.EmpEmail;
        } else if (table == "Meetings") {
            primaryKey = "MeetingID";
            recordID = data.MeetingID;
        }

        if (option == "delete") {
            var x = delete_record(table, primaryKey, recordID, res);
            return x;
        } else {
            var x = read_record(table, primaryKey, recordID, res);
            return x;
        }
    }
    if (option == "view") {
        view_records(table, res);
    } else if (option == "create") {
        // POST
        if (table == "EmployeeDetails") UD_create_record(data, res);
        else if (table == "FloorPlan") FP_create_record(data, res);
        else if (table == "Meetings") MEET_create_record(data, res);
        else if (table == "Distance") DIST_create_record(data, res);
    } else if (option == "update") {
        // POST
        if (table == "EmployeeDetails") UD_update_record(data, res);
        else if (table == "FloorPlan") FP_update_record(data, res);
        else if (table == "Meetings") MEET_update_record(data, res);
        else if (table == "Distance") DIST_update_record(data, res);
    }
}

function read_record(table, primaryKey, recordID, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var sqlQuery = "SELECT * FROM " + table + " WHERE " + primaryKey + "= '" + recordID + "';";

        request.query(sqlQuery, function (err, recordset) {
            if (err) {
                console.log(err);
                res.send("Error: Failed To Read Record.");
            } else {
                if (recordset.recordset.length == 0) {
                    console.log("Error: Failed To Find Record With ID = " + recordID);
                    res.send("Error: Failed To Find Record With ID = " + recordID);
                } else {
                    console.log("Success: Record Retrieved! ID = " + recordID);
                    res.send(recordset.recordset);
                }
            }
        });
    });
}

function view_records(table, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
        var sqlQuery = "SELECT * FROM " + table + ";";

        // query to the database and get the records
        request.query(sqlQuery, function (err, recordset) {
            if (err) {
                console.log(err);
                res.send("Error: Failed To View All Records.");
            } else {
                if (recordset.recordset.length == 0) {
                    console.log("Error: Table is empty.");
                    res.send("Error: Table is empty.");
                } else {
                    console.log("All Records Successfully Viewed!");
                    res.send(recordset.recordset);
                }
            }
        });
    });
}

// TABLE FLOOR PLAN

function FP_create_record(body_data, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var sqlQuery =
            "INSERT INTO FloorPlan VALUES ('" +
            body_data.RoomID +
            "','" +
            body_data.RoomName +
            "','" +
            body_data.FloorNumber +
            "','" +
            body_data.maxSeats +
            "','" +
            body_data.Amenity +
            "','" +
            body_data.Building +
            "','" +
            body_data.Whiteboard +
            "','" +
            body_data.Projector +
            "','" +
            body_data.Monitor +
            "','" +
            body_data.isExternal +
            "','" +
            body_data.isAvailable +
            "');";

        request.query(sqlQuery, function (err, recordset) {
            if (err) {
                console.log(err);
                res.send("Error: Failed to insert.");
            } else {
                console.log("Success: Record Created! ID = " + body_data.RoomID);
                res.send("Success: Record Created. ID = " + body_data.RoomID);
            }
        });
    });
}

function FP_update_record(body_data, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();

        var sqlQuery =
            "UPDATE FloorPlan SET RoomID = '" +
            body_data.RoomID +
            "', RoomName = '" +
            body_data.RoomName +
            "', FloorNumber = '" +
            body_data.FloorNumber +
            "', maxSeats = '" +
            body_data.maxSeats +
            "', Amenity = '" +
            body_data.Amenity +
            "', Building = '" +
            body_data.Building +
            "', Whiteboard = '" +
            body_data.Whiteboard +
            "', Projector = '" +
            body_data.Projector +
            "', Monitor = '" +
            body_data.Monitor +
            "', isExternal = '" +
            body_data.isExternal +
            "', isAvailable = '" +
            isAvailable +
            "' WHERE RoomID = '" +
            body_data.RoomID +
            "';";

        request.query(sqlQuery, function (err, recordset) {
            if (err) {
                console.log(err);
                res.send("Error: Failed to update.");
            } else {
                console.log("Success: Record Updated! (ID = " + body_data.RoomID + ")");
                res.send("Success: Record Updated.ID = " + body_data.RoomID);
            }
        });
    });
}

function delete_record(table, primaryKey, recordID, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();

        var sqlQuery = "SELECT * FROM " + table + " WHERE " + primaryKey + "= '" + recordID + "';";

        request.query(sqlQuery, function (err, recordset) {
            if (err) {
                console.log(err);
                res.send("Error: Failed To Read Record.");
            } else {
                if (recordset.recordset.length == 0) {
                    console.log("Error: Failed To Find Record With ID = " + recordID);
                    res.send("Error: Failed To Find Record With ID = " + recordID);
                } else {
                    sqlQuery =
                        "DELETE FROM " + table + " WHERE " + primaryKey + "= '" + recordID + "';";

                    request.query(sqlQuery, function (err, recordset) {
                        if (err) {
                            console.log(err);
                            res.send("Error: Failed To Delete Record.");
                        } else {
                            console.log("Success: Record Deleted! ID = " + recordID);
                            res.send("Success: Record Deleted. ID = " + recordID);
                        }
                    });
                }
            }
        });
    });
}

// TABLE EMPLOYEE DETAILS:

function UD_create_record(body_data, res) {
    // used to insert a record:

    sql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var sqlQuery =
            "INSERT INTO EmployeeDetails VALUES ('" +
            body_data.FirstName +
            "','" +
            body_data.LastName +
            "','" +
            body_data.EmpEmail +
            "','" +
            body_data.EmpPassword +
            "','" +
            body_data.isAdmin +
            "','" +
            body_data.LocationID +
            "');";

        request.query(sqlQuery, function (err, recordset) {
            if (err) {
                console.log(err);
                res.send("Error: Failed To Insert.");
            } else {
                console.log("Success: Record Created! ID = " + body_data.EmpEmail);
                res.send("Success: Record Created. ID = " + body_data.EmpEmail);
            }
        });
    });
}

function UD_update_record(body_data, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var sqlQuery =
            "UPDATE EmployeeDetails SET FirstName = '" +
            body_data.FirstName +
            "', LastName = '" +
            body_data.LastName +
            "', EmpEmail = '" +
            body_data.EmpEmail +
            "', EmpPassword = '" +
            body_data.EmpPassword +
            "', LocationID = '" +
            body_data.LocationID +
            "', isAdmin = '" +
            body_data.isAdmin +
            "' WHERE EmpEmail = '" +
            body_data.EmpEmail +
            "';";

        request.query(sqlQuery, function (err, recordset) {
            if (err) {
                console.log(err);
                res.send("Error: Failed to update.");
            } else {
                console.log("Success: Record Updated! ID = " + body_data.EmpEmail);
                res.send("Success: Record Updated. ID = " + body_data.EmpEmail);
            }
        });
    });
}

// TABLE DISTANCE:

function DIST_create_record(body_data, res) {
    // used to insert a record:

    sql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();
        var sqlQuery =
            "INSERT INTO Distance VALUES ('" +
            body_data.Rooms +
            "','" +
            body_data.Texas +
            "','" +
            body_data.Colorado +
            "','" +
            body_data.Mississippi +
            "','" +
            body_data.NewJersey +
            "','" +
            body_data.NewYork +
            "','" +
            body_data.California +
            "','" +
            body_data.Florida +
            "','" +
            body_data.Pennsylvania +
            "','" +
            body_data.Georgia +
            "','" +
            body_data.Tennessee +
            "','" +
            body_data.Washington +
            "');";

        request.query(sqlQuery, function (err, recordset) {
            if (err) {
                console.log(err);
                res.send("Error: Failed To Insert.");
            } else {
                console.log("Success: Record Created! ID = " + body_data.Rooms);
                res.send("Success: Record Created. ID = " + body_data.Rooms);
            }
        });
    });
}

function DIST_update_record(body_data, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();

        var sqlQuery =
            "UPDATE Distance SET Texas = '" +
            body_data.Texas +
            "', Colorado = '" +
            body_data.Colorado +
            "', Mississippi = '" +
            body_data.Mississippi +
            "', NewJersey = '" +
            body_data.NewJersey +
            "', NewYork = '" +
            body_data.NewYork +
            "', California = '" +
            body_data.California +
            "', Florida = '" +
            body_data.Florida +
            "', Pennsylvania = '" +
            body_data.Pennsylvania +
            "', Georgia = '" +
            body_data.Georgia +
            "', Tennessee = '" +
            body_data.Tennessee +
            "', Washington = '" +
            body_data.Washington +
            "' WHERE Rooms = '" +
            body_data.Rooms +
            "';";

        request.query(sqlQuery, function (err, recordset) {
            if (err) {
                console.log(err);
                res.send("Error: Failed to update.");
            } else {
                console.log("Success: Record Updated! ID = " + body_data.Rooms);
                res.send("Success: Record Updated. ID = " + body_data.Rooms);
            }
        });
    });
}

// TABLE MEETINGS:

function MEET_create_record(body_data, res) {
    // used to insert a record:

    sql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();

        var sqlQuery =
            "INSERT INTO Meetings VALUES (" +
            body_data.MeetingID +
            "," +
            new Date(body_data.StartTime).toISOString() +
            "','" +
            new Date(body_data.EndTime).toISOString() +
            "','" +
            body_data.Organizer +
            "','" +
            body_data.Participants +
            "','" +
            body_data.OriginalAmenity +
            "','" +
            body_data.RoomID +
            "');";

        request.query(sqlQuery, function (err, recordset) {
            if (err) {
                console.log(err);
                res.send("Error: Failed To Insert.");
            } else {
                console.log("Success: Record Created! ID = " + body_data.MeetingID);
                res.send("Success: Record Created. ID = " + body_data.MeetingID);
            }
        });
    });
}

function MEET_update_record(body_data, res) {
    sql.connect(config, function (err) {
        if (err) console.log(err);

        var request = new sql.Request();

        var sqlQuery =
            "UPDATE Meetings SET StartTime = '" +
            new Date(body_data.StartTime).toISOString() +
            "', EndTime = '" +
            new Date(body_data.EndTime).toISOString() +
            "', Organizer = '" +
            body_data.Organizer +
            "', Participants = '" +
            body_data.Participants +
            "', OriginalAmenity = '" +
            body_data.OriginalAmenity +
            "', RoomID = '" +
            body_data.RoomID +
            "' WHERE MeetingID = '" +
            body_data.MeetingID +
            "';";

        request.query(sqlQuery, function (err, recordset) {
            if (err) {
                console.log(err);
                res.send("Error: Failed To Insert.");
            } else {
                console.log("Success: Record Update! ID = " + body_data.MeetingID);
                res.send("Success: Record Update. ID = " + body_data.MeetingID);
            }
        });
    });
}

var server = app.listen(port, function () {
    console.log("Server Is Running On Port " + port);
});
