var assert = require('assert');
var ExtractedDetails = require("../ExtractedDetails");


var startTime = new Date('2020-08-20T10:30:00.0000000');
var endTime = new Date('2020-08-20T11:00:00.0000000');

var eventRes = {
    organizer : {
        emailAddress : {
            address : "AdeleV@teamthreshold.onmicrosoft.com"
        },
    },
    attendees : [
        {
            emailAddress : {
                address : "AdeleV@teamthreshold.onmicrosoft.com"
            }   
        },
        {
            emailAddress : {
                address : "DiegoS@teamthreshold.onmicrosoft.com"
            }   
        },
        {
            emailAddress : {
                address : "AlexW@teamthreshold.onmicrosoft.com"
            }   
        },
        {
            emailAddress : {
                address : "LeeG@teamthreshold.onmicrosoft.com"
            }   
        },
    ],
    subject : "New Product",
    bodyPreview: "A brainstorm session to come up with a new product",
    start : {
        dateTime : startTime
    },
    end : {
        dateTime : endTime
    },
    isCancelled : false,
    recurrence : null,
    hasAttachments : false

};

var capacity = eventRes.attendees.length;
var attendeesMail = [];
for (var i = 0; i < capacity; i++) {
    attendeesMail.push(eventRes.attendees[i].emailAddress.address);
}

var details = {
    Organizer: eventRes.organizer.emailAddress.address,
    Attendees: attendeesMail,
    Subject: eventRes.subject,
    Description: eventRes.bodyPreview,
    Start: startTime,
    End: eventRes.end.dateTime,
    Capacity: capacity,
    Cancelled: eventRes.isCancelled,
    Attachments: eventRes.hasAttachments,
    Recurring: eventRes.recurrence,
};

describe('Extracted Meeting Information Test', () =>{

    it('Should return JSON object', async() => {
        var extract = await ExtractedDetails.EventDetails(eventRes).then((res) => res);
        assert.deepEqual(extract, details);   
    });
});





