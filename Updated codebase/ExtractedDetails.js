var fs = require ('fs');

module.exports = {

    EventDetails: async function(eventD)
    {
        return new Promise((resolve, reject) => {

            //Variables
            var organizerMail = eventD.organizer.emailAddress.address;
            var attendeesMail = [];
            var subject = eventD.subject;
            var description = eventD.bodyPreview;
            var startTime = eventD.start.dateTime;
            var endTime = eventD.end.dateTime;
            var capacity = eventD.attendees.length;
            var cancelled = eventD.isCancelled;
            var recurring = eventD.recurrence;
            var attachments = eventD.hasAttachments;

            // Get Attendees list
            for(var i = 0; i < capacity; i++)
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
                "Capacity" : capacity,
                "Cancelled" : cancelled,
                "Attachments" : attachments,
                "Recuuring" : recurring
            };

            return resolve(details);
        });  
    }
};