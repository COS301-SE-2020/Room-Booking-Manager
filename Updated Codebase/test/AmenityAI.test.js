const assert = require('assert');
const AmenityAI = require('../AmenityAI');


describe('AmenityAI.js', function(){
    describe('identify(eventDescription)', function(){
        describe('Outputs the correct Amenity based on input', function(){

                it('Given a description identify that a Projector is required', async function(){
                    var eventDescription = 'Projector';
                    var amenityIdentified = await AmenityAI.identify(eventDescription).then(res=>res);
                    assert.equal(amenityIdentified,'Projector');
                }),
                it('Given a description identify that a Whiteboard is required', async function(){
                    var eventDescription = 'We will be having a brainstorm session';
                    var amenityIdentified = await AmenityAI.identify(eventDescription).then(res=>res);
                    assert.equal(amenityIdentified,'Whiteboard');
                }),
                it('Given a description identify that a Monitor is required', async function(){
                    var eventDescription = 'A video presentation will be held';
                    var amenityIdentified = await AmenityAI.identify(eventDescription).then(res=>res);
                    assert.equal(amenityIdentified,'Monitor');
                })

           



        })
    })
})
