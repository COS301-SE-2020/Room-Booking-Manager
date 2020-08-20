const assert = require('assert');
var GetRooms = require('../GetRooms');

var amenity = "Whiteboard"
var cap = 7;
var stime = new Date('2020-08-20 06:00:00.000000');

describe('Get rooms Test', () => {
 it('should return list '+'[ '+'1P2'+', '+'2P1'+', '+'2P2'+', '+'2Q1'+', '+'2R1'+' ]', async () => {
        var rooms = await GetRooms.getRooms(amenity,cap,stime);
        // console.log(f);
        assert.deepEqual(rooms,[ '1P2', '2P1', '2P2', '2Q1', '2R1' ]);
    });
//  it('should return false', () => {
//         assert(result1);
//     });
});