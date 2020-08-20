const assert = require('assert');
var GatherFeasibleRooms = require('../GatherFeasibleRooms');

var amenity = "Whiteboard";
var cap = 5;
var st = new Date('2020-08-20 06:00:00.000000');
// var st1 = new Date('2021-08-20 06:00:00.000000');
var end = new Date('2020-08-20 06:30:00.000000');
// var end1 = new Date('2021-08-20 06:30:00.000000');
var end = new Date('2020-08-20 06:30:00.000000');

describe('Gather feasible rooms Test', () => {
 it('should return list '+'[ '+'1Q2'+', '+'1S2'+', '+'2Q2'+', '+'2S2]', async () => {
    var resp = await GatherFeasibleRooms.getFeasibleRooms(amenity, cap, st, end).then((res) => res);
    assert.deepEqual(resp,[ '1Q2', '1S2', '2Q2', '2S2' ]);
    });
});