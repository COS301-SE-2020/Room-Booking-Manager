var fs = require ('fs');

module.exports = {

    EventDetails: async function(eventD)
    {
        //Variables
        var organizerMail = eventD.organizer.emailAddress.address;
        var attendeesMail = [];
        var subject = eventD.subject;
        var description = eventD.bodyPreview;
        var startTime = eventD.start.dateTime;
        var endTime = eventD.end.dateTime;
        var cancelled = eventD.isCancelled;
        var recurring = eventD.recurrence;
        var attachments = eventD.hasAttachments;

        // Get Attendees list
        for(var i = 0; i < eventD.attendees.length; i++)
        {
            attendeesMail.push(eventD.attendees[i].emailAddress.address);
        }

        //Store values in JSON object
        var details = {
            "Organizer": organizerMail,
            "Attendees": attendeesMail,
            "Subject" : subject,
            "Description" : description,
            "Start" : startTime,
            "End" : endTime,
            "Cancelled" : cancelled,
            "Recuuring" : recurring,
            "Attachments" : attachments
        };
        return details;
    }
};