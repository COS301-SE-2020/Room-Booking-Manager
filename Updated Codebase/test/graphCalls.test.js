var graphCalls = require('../graphCalls.js');
var assert = require('assert');
const access = require('../accessToken.js');

describe('graphCalls.js', function(){
    describe('getDetailsFromEventUrl', function(){
        it('tests if API call returns correct event detail from sample URL', async function(){
            var url = 'Users/b84f0efb-8f72-4604-837d-7ce7ca57fdd4/Events/AAMkAGNmMmE1MzY1LWU5MjAtNDgwZS1hODA1LTAxZmE3MDZjN2Y4MABGAAAAAADtYPw4__duQpoAUtqbk_dvBwATlvcwiTJsQINLpRQn-5KEAAAAAAENAAATlvcwiTJsQINLpRQn-5KEAAApCkcBAAA=';
           var accessToken = await access.getAccess().then(res=>res);
            var eventDetails = await graphCalls.getDetailsFromEventUrl(url,accessToken.accessToken).then(res=>res);
           //console.log(eventDetails);
            assert.equal(eventDetails.organizer.emailAddress.name,'Adele Vance');
            
        })
    })
})