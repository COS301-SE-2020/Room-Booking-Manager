const assert = require('assert');
var CheckConflict = require('../CheckConflict');

var st = new Date('2020-08-20 06:00:00.000000');
// var st1 = new Date('2021-08-20 06:00:00.000000');
var end = new Date('2020-08-20 06:30:00.000000');
// var end1 = new Date('2021-08-20 06:30:00.000000');

describe('Check conflict Test', () => {
    it('should return true', async () => {
        var canBook = await CheckConflict.start("Meeting","AdeleV@teamthreshold.onmicrosoft.com",st,end).then((res) => res);
        assert.equal(canBook,true);
       });
    });
