var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var DatabaseQuerries = require("./DatabaseQuerries");
app.use(bodyParser.json());

module.exports = {
    getRoomsInOrderOfDistances: async function (Frooms, attendeelocation) {
        var arr = [],
            arr2 = [];
        console.log(Frooms + attendeelocation);
        var Boolkey = Infinity;
        var bestRoom;
        var arrayofAverageDistances = [];
        // var Frooms=["1P2","1Q2","2Q2","2P1","2P2"];//feasible room id
        // var attendeelocation=["1A1","1D1","1M1"];
        var Feasibleroom = []; //will contain feasible room name
        var hold;
        for (
            var n = 0;
            n < Frooms.length;
            n++ //for converting feasible room ids to room name
        ) {
            hold = await DatabaseQuerries.roomNameQuery(Frooms[n]);
            hold = hold[0];
            Feasibleroom.push(hold["RoomName"]);
        }

        //var Feasibleroom=["Texas","Colorado","NewYork","Florida","Georgia"];

        var retrDist, temp, temp2, room;
        var sql;

        // //calculate Average
        for (var i = 0; i < Feasibleroom.length; i++) {
            temp = 0;
            room = Feasibleroom[i]; //assuming room names are given in this array instead of roomid
            for (var j = 0; j < attendeelocation.length; j++) {
                temp2 = await DatabaseQuerries.FindDistances(room, attendeelocation[j]);
                console.log("\ntemp2 =>");
                console.log(temp2);
                temp2 = JSON.stringify(temp2[0]);
                var parsed = JSON.parse(temp2);
                temp += parsed[room];
                if (temp < Boolkey) {
                    bestRoom = room;
                    Boolkey = temp;
                }
            }
            arr = [room, temp / attendeelocation.length];
            arr2.push(arr);
            arrayofAverageDistances.push(temp / attendeelocation.length);
            //console.log("arrayofAverageDistances: "+ arrayofAverageDistances);
        }

        arrayofAverageDistances = arrayofAverageDistances.sort(function (a, b) {
            return a - b;
        }); //for sorting

        var bool = false,
            f,
            sorted = []; //sorted will contain sorted names with distances
        var sortedNames = []; //will contain sorted room names in ascending order of distances

        for (var u = 0; u < arrayofAverageDistances.length; u++) {
            f = 0;
            bool = false;
            while (!bool) {
                console.log("arr2 contains: ");
                console.log(arr2);
                if (arr2[f][1] == arrayofAverageDistances[u]) {
                    bool = true;
                    sorted.push(arr2[f]);
                }
                f++;
            }
        }
        //sorted array is in the form [[index 0,index 1],[index 0,index 1]...] index 0 is the room name index 1 is average distance to it
        var hold1, parsed2;
        for (var e = 0; e < sorted.length; e++) {
            hold1 = await DatabaseQuerries.roomIDQuery(sorted[e][0]);
            hold1 = JSON.stringify(hold1[0]);
            parsed2 = JSON.parse(hold1);
            sortedNames.push(parsed2.RoomID);
        }

        console.log("\n\nSORTED NAMES = " + sortedNames);
        return sortedNames;
    },
    bookMeetingRoom: async function (meetingID,extractedDetails, amenity, ListOfRooms) {
        var wait = await DatabaseQuerries.storeRooms(meetingID, extractedDetails, amenity, ListOfRooms);
    },
};
