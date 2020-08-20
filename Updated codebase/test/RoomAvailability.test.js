const assert = require('assert');
var RoomAvailability = require('../RoomAvailability');

var room_ID = "1S2";
var st = new Date('2020-08-20 06:00:00.000000');
// var st1 = new Date('2021-08-20 06:00:00.000000');
var end = new Date('2020-08-20 06:30:00.000000');
// var end1 = new Date('2021-08-20 06:30:00.000000');


describe('Room availability Test', () => {
 it('should return true', async () => {
        var resp = await RoomAvailability.checkAvailability(room_ID,st,end).then((res) => res);
        assert.equal(resp,true);
    });
});