var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/vote/:uid/:dir', function(request, response, next) {
  var uid = request.params.uid;
  var dir = request.params.dir; //must be up or down
  console.log('vote',uid,dir);
    response.send('Not yet implemented!');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
