const express = require("express");
const app = express();

app.listen(process.env.PORT || 8080);

app.use(express.static('./dist/room-booking-manager'));

app.get('/*', function(req, res) {
  res.sendFile('login/login.component.html', {root: 'src/app/'}
);
});