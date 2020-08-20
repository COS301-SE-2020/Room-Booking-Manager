const assert = require('assert');
require("isomorphic-fetch");
var UpdateLocation = require('../UpdateLocation');
const access = require('../accessToken.js');


var orgEmail = "COS301@teamthreshold.onmicrosoft.com";
var sub = "TEST DONT DELETE";
var time = new Date('2020-08-30 15:00:00.000000');
var room = "Texas";

// var end = new Date('2020-08-20 06:30:00.000000');


describe('Update location Test', () => {
 it('should return true', async () => {
        var accessToken = await access.getAccess().then(res=>res);
        var resp = await UpdateLocation.update(accessToken.accessToken,orgEmail,sub,time,room).then((res) => res);
        // console.log(resp);
        assert.equal(resp,true);
    });
});