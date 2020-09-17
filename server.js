// const express = require("express");
// const app = express();

//  app.use(express.static('./dist/demo'));

// app.get('/*', function(req, res) {
//   res.sendFile('login.component.html', {root: 'src/app/login'}
// );
// });

// app.listen(process.env.PORT || 8080);

const express = require("express");
const compression = require("compression");

const _port = 3000;
const _app_folder = './';

const app = express();
app.use(compression());


// ---- SERVE STATIC FILES ---- //
app.get('*.*', express.static(_app_folder));

// ---- SERVE APLICATION PATHS ---- //
app.all('*', function (req, res) {
    res.status(200).sendFile(`/`, {root: _app_folder});
});

// ---- START UP THE NODE SERVER  ----
app.listen(_port, function () {
    console.log("Node Express server for " + app.name + " listening on http://localhost:" + _port);
});