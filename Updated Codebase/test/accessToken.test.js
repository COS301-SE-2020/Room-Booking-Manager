const assert = require('assert');
const accessToken = require('../accessToken');


describe('accessToken.js',  function(){
    describe('getAccess()',  function(){
        
        it('Should return a accessToken with Bearer tokenType', async function(){
            var token = await accessToken.getAccess().then(res=>res);
           // console.log(token);
            assert.equal(token.tokenType,'Bearer');
        }),
        it('Should return an accessToken that expires in 3599 seconds',async function(){
            var tokenExpiry = await accessToken.getAccess().then(res=>res);
            assert.equal(tokenExpiry.expiresIn,'3599');
        })
    })
})