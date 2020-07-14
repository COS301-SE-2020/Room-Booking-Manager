// credit to jcreigno for mail-notifier dependency

const notifier = require('mail-notifier');

// configuration:

const imap = {
    user: "cos301@teamthreshold.onmicrosoft.com",
    password: "Threshold#301",
    host: "outlook.office365.com",
    port: 993, // imap port
    tls: true,// use secure connection
    tlsOptions: { rejectUnauthorized: false }
};

// Listening for incoming messages in the TeamThreshold mailbox. 
// Any changes will be logged onto the console.

notifier(imap)
  .on('mail', mail => console.log(mail))
  .start();

// how to run:
// node trigger.js


// const n = notifier(imap);
// n.on('end', () => n.start()) // session closed
//   .on('mail', mail => console.log(mail.from[0].address, mail.subject))
//   .start();