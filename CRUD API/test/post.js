const assert = require('chai').assert;
const expect=require('chai').expect;
const request=require('supertest');
const api= require('../api');
const port = process.env.PORT || 65001;
describe('Floorplan CRUD', function() {

     it("Create new Meeting room (FloorPlan) record", (done)=> { 
        request(api).post("/")
        .send({
            "table" : "FloorPlan",
            "request" : "create",
            "data" : {
                RoomID: '2A2',
                RoomName: 'Joburg',
                FloorNumber: 3,
                maxSeats: 10,
                Amenity: 'Whiteboard',
                Building: 2,
                Whiteboard: true,
                Projector: false,
                Monitor: false,
                isExternal: false,
                isAvailable: true
                        }
        })
        .then((res)=>{
            const body= res.body[0];
            done();
        }
        )
        .catch((err)=>{
                done(err);})
         });

         it("view FloorPlan records", (done)=> { 
            request(api).post("/")
            .send({
                "table" : "FloorPlan",
                "request" : "view",
                "data" : {
                                "RoomID":"1P2", 
                                "Amenities":"Greenboard", 
                                "numParticipants":"10", 
                                "Distance":"10" 
                            }
            })
            .then((res)=>{
                const body= res.body[0];
                 expect(body).to.contain.property('RoomID');
                 expect(body).to.contain.property('RoomName');
                 expect(body).to.contain.property('FloorNumber');
                 expect(body).to.contain.property('maxSeats');
                 expect(body).to.contain.property('Amenity');
                 expect(body).to.contain.property('Building');
                 expect(body).to.contain.property('Whiteboard');
                 expect(body).to.contain.property('Projector');
                 expect(body).to.contain.property('Monitor');
                 expect(body).to.contain.property('isExternal');
                 expect(body).to.contain.property('isAvailable');
                done();
            }
            )
            .catch((err)=>{
                done(err);})
         });

         it("Update Meeting room (FloorPlan) record", (done)=> { 
            request(api).post("/")
            .send({
                "table" : "FloorPlan",
                "request" : "update",
                "data" : {
                    RoomID: '2A2',
                    RoomName: 'Joburg',
                    FloorNumber: 3,
                    maxSeats: 10,
                    Amenity: 'Projector',
                    Building: 2,
                    Whiteboard: true,
                    Projector: false,
                    Monitor: false,
                    isExternal: false,
                    isAvailable: true
                            }
            })
            .then((res)=>{
                const body= res.body[0];
                done();
            }
            )
            .catch((err)=>{
                    done(err);})
             });

             it("Delete Meeting room from (FloorPlan) record", (done)=> { 
                request(api).post("/")
                .send({
                    "table" : "FloorPlan",
                    "request" : "delete",
                    "data" : {
                        RoomID: '2A2'
                                }
                })
                .then((res)=>{
                    const body= res.body[0];//insert assertion
                    done();
                }
                )
                .catch((err)=>{
                        done(err);})
                 });
    
});

describe('Employee CRUD', function() {
    it("Create new Employee record", (done)=> { 
        request(api).post("/")
        .send({
            "table" : "EmployeeDetails",
            "request" : "create",
            "data" : {
                FirstName: 'Bob',
                LastName: 'Test',
                EmpEmail: 'Bob@test.com',
                EmpPassword: 1010,
                isAdmin: false,
                LocationID: '2A3'
                        }
        })
        .then((res)=>{
            const body= res.body[0];
            done();
        }
        )
        .catch((err)=>{
                done(err);})
         });

         it("view Employee records", (done)=> { 
            request(api).post("/")
            .send({
                "table" : "EmployeeDetails",
                "request" : "view",
                "data" : {
                    FirstName: 'Bob',
                    LastName: 'Test',
                    EmpEmail: 'Bob@test.com',
                    EmpPassword: 1010,
                    isAdmin: false,
                    LocationID: '2A3'
                            }
            })
            .then((res)=>{
                const body= res.body[0];
                 expect(body).to.contain.property('FirstName');
                 expect(body).to.contain.property('LastName');
                 expect(body).to.contain.property('EmpEmail');
                 expect(body).to.contain.property('EmpPassword');
                 expect(body).to.contain.property('isAdmin');
                 expect(body).to.contain.property('LocationID');
                done();
            }
            )
            .catch((err)=>{
                done(err);})
         });

         it("Update Employee record", (done)=> { 
            request(api).post("/")
            .send({
                "table" : "EmployeeDetails",
                "request" : "update",
                "data" : {
                    FirstName: 'Bob',
                    LastName: 'Doe',
                    EmpEmail: 'Bob@test.com',
                    EmpPassword: 1010,
                    isAdmin: false,
                    LocationID: '2A3'
                            }
            })
            .then((res)=>{
                const body= res.body[0];
                done();
            }
            )
            .catch((err)=>{
                    done(err);})
             });

             it("Delete Employee Details from (EmployeeDetails) record", (done)=> { 
                request(api).post("/")
                .send({
                    "table" : "EmployeeDetails",
                    "request" : "delete",
                    "data" : {
                    EmpEmail: 'Bob@test.com'
                                }
                })
                .then((res)=>{
                    const body= res.body[0];//insert assertion
                    done();
                }
                )
                .catch((err)=>{
                        done(err);})
                 });

});

describe('Distance CRUD', function() {
    it("Create new Distance record", (done)=> { 
        request(api).post("/")
        .send({
            "table" : "Distance",
            "request" : "create",
            "data" : {
                        Rooms: '2A1',
                        Texas: 37,
                        Colorado: 42,
                        Mississippi: 48,
                        NewJersey: 51,
                        NewYork: 74,
                        California: 82,
                        Florida: 88,
                        Pennsylvania: 81,
                        Georgia: 86,
                        Tennessee: 92,
                        Washington: 95
                        }
        })
        .then((res)=>{
            const body= res.body[0];
            done();
        }
        )
        .catch((err)=>{
                done(err);})
         });

         it("view Distance records", (done)=> { 
            request(api).post("/")
            .send({
                "table" : "Distance",
                "request" : "view",
                "data" : {
                    Rooms: '2A1'
                            }
            })
            .then((res)=>{
                const body= res.body[0];
                 expect(body).to.contain.property('Rooms');
                done();
            }
            )
            .catch((err)=>{
                done(err);})
         });

         it("Update Distance record", (done)=> { 
            request(api).post("/")
            .send({
                "table" : "Distance",
                "request" : "update",
                "data" : {
                            Rooms: '2A1',
                            Texas: 37,
                            Colorado: 42,
                            Mississippi: 48,
                            NewJersey: 51,
                            NewYork: 70,
                            California: 80,
                            Florida: 86,
                            Pennsylvania: 87,
                            Georgia: 80,
                            Tennessee: 40,
                            Washington: 80
                            }
            })
            .then((res)=>{
                const body= res.body[0];
                done();
            }
            )
            .catch((err)=>{
                    done(err);})
             });

             it("Delete Distance from (Distance) record", (done)=> { 
                request(api).post("/")
                .send({
                    "table" : "Distance",
                    "request" : "delete",
                    "data" : {
                                 Rooms: '2A1'
                                }
                })
                .then((res)=>{
                    const body= res.body[0];//insert assertion
                    done();
                }
                )
                .catch((err)=>{
                        done(err);})
                 });

});

describe('Meetings CRUD', function() {
    it("Create new Meeting record", (done)=> { 
        request(api).post("/")
        .send({
            "table" : "Meetings",
            "request" : "create",
            "data" : {
                        MeetingID: 'test',
                        StartTime: '2020-07-20T03:00:00.000Z',
                        EndTime: '2020-07-20T03:30:00.000Z',
                        Organizer: 'JohnDoe@teamthreshold.onmicrosoft.com',
                        Participants: 'null',
                        OriginalAmenity: 'Projector',
                        RoomID: 'AyP2'
                        }
        })
        .then((res)=>{
            const body= res.body[0];
            done();
        }
        )
        .catch((err)=>{
                done(err);})
         });

         it("view Meetings record", (done)=> { 
            request(api).post("/")
            .send({
                "table" : "Meetings",
                "request" : "view",
                "data" : {
                    Rooms: '2A1'
                            }
            })
            .then((res)=>{
                const body= res.body[0];
                 expect(body).to.contain.property('MeetingID');
                 expect(body).to.contain.property('StartTime');
                 expect(body).to.contain.property('EndTime');
                 expect(body).to.contain.property('Organizer');
                 expect(body).to.contain.property('Participants');
                 expect(body).to.contain.property('OriginalAmenity');
                 expect(body).to.contain.property('RoomID');
                done();
            }
            )
            .catch((err)=>{
                done(err);})
         });

         it("Update Meeting record", (done)=> { 
            request(api).post("/")
            .send({
                "table" : "Meetings",
                "request" : "update",
                "data" : {
                            MeetingID: 'test',
                            StartTime: '2020-08-20T03:00:00.000Z',
                            EndTime: '2020-08-20T03:30:00.000Z',
                            Organizer: 'JohnDoe@teamthreshold.onmicrosoft.com',
                            Participants: 'null',
                            OriginalAmenity: 'Projector',
                            RoomID: 'AyP2'
                            }
            })
            .then((res)=>{
                const body= res.body[0];
                done();
            }
            )
            .catch((err)=>{
                    done(err);})
             });

             it("Delete Meeting from (Meetings) record", (done)=> { 
                request(api).post("/")
                .send({
                    "table" : "Meetings",
                    "request" : "delete",
                    "data" : {
                        MeetingID: 'test'
                                }
                })
                .then((res)=>{
                    const body= res.body[0];//insert assertion
                    done();
                }
                )
                .catch((err)=>{
                        done(err);})
                 });

});