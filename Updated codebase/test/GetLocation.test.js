var assert = require('assert');
var DatabaseQuerries = require("../DatabaseQuerries");

var startTime = new Date('2020-08-20T10:30:00.0000000');
var endTime = new Date('2020-08-20T11:00:00.0000000');

var temp = ["1A1","1D1","1P1","1A2"];
describe('Get Location Test', () =>{

    it('Should return an array', async() => {
        var location = await DatabaseQuerries.getLocation(
            [
                'AdeleV@teamthreshold.onmicrosoft.com',
                'DiegoS@teamthreshold.onmicrosoft.com',
                'AlexW@teamthreshold.onmicrosoft.com',
                'LeeG@teamthreshold.onmicrosoft.com'
              ],
              startTime,
              endTime
        ).then((res) => res);
        assert.deepEqual(location, temp);   
    });
});