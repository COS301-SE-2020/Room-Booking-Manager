const assert = require('chai').assert;
const expect=require('chai').expect;
const request=require('supertest');
const bestRoomsInAsc= require('../bestRoomsInAsc');
var DatabaseQuerries = require('../DatabaseQuerries');

const port = process.env.PORT || 65001;

describe('bestRoomsAsc Test', function() {
    
    it("roomNameQuery should return room name in array", ()=> { 
        return DatabaseQuerries.roomNameQuery('1P2').then((result)=> {
            expect(result).to.be.an('array');
          });
     });

     it("roomIDQuery should return room id in array", ()=> { 
        return DatabaseQuerries.roomIDQuery('Texas').then((result)=> {
            expect(result).to.be.an('array');
          });
     });

     it("should return distance in the of an array form and distance must be a number", ()=> { 
        return DatabaseQuerries.FindDistances('Texas','1A1').then((result)=> {
            expect(result).to.be.an('array');
            expect(result[0]["Texas"]).to.be.a('number')

          });
     });
    let available=['1P2','1R2','1S2',];
    let location=['1A1','1D1'];

     it("getRoomsInOrderOfDistances test should return array of rooms", ()=> { 
        return bestRoomsInAsc.getRoomsInOrderOfDistances(available,location).then((result)=> {

            expect(result).to.be.an('array');

          });
     });
});