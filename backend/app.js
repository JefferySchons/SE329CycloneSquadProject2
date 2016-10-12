var express = require('express');
var app = express();
var database = require('./database');
var bodyParser = require('body-parser');

app.use(bodyParser.json({
    type: 'application/json'
})); // for parsing application/json
app.use(bodyParser.text({
    type: 'text/html'
}));
app.use(bodyParser.text({
    type: 'text/plain'
}));
app.use(bodyParser.text({
    type: ''
}));

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.get('/vote/:uid/:dir', function(req, res, next) {
    var uid = req.params.uid;
    var dir = req.params.dir; //must be up or down
    var rtn = {};
    rtn.uid = uid;
    rtn.dir = dir;
    do {
        if (dir != 'up' && dir != 'down') {
            rtn.error = {
                code: 1002,
                message: 'format must be "/vote/{uid}/{dir}" where dir="up"|"down"'
            }
            break;
        }
        console.log('vote', uid, dir);
    database.query('UPDATE `urls` set `votes` = `votes` ' + (dir == 'up' ? '+' : '-') + ' 1 WHERE `uid` = ?;', [uid], function(err, result) {
        rtn.db_result = result;
        if (err)
            rtn.error = err;
        if (result.changedRows < 1) {
            rtn.error = {
                code: 1001,
                message: 'failed to update votes!'
            }
            console.log("/vote/" + uid + "/" + dir + " - ", result);
        }
    });
} while (false); res.json(rtn);

});

app.post('/getinfo', function(req, res, next) {
var rtn = {};
    var data = req.body;
    var urls = data.urls;
    var urlsLength = urls.length;
    rtn.poop = "true";
    for (var i = 0; i < urlsLength; i++) {
        var url = urls[i];
        database.query('SELECT * FROM `urls` WHERE `url` = ?', [url.substring(0, 80)], function(err, result) {
            rtn.db_result = result;
            if (err)
                rtn.error_sql = err;

            console.log("/getinfo:1", result, err);
            if (result.length < 1) {
              database.query("INSERT INTO `urls` (`uid`, `url`, `votes`) VALUES (NULL, '?', '0');", [url.substring(0, 80)], function(err, result) {
                if(err){
                  rtn.error = {
                      code: 1001,
                      message: 'failed to update urls!'
                  }
                }
                rtn.insert_result = result;
              });

            }
        });
    }
    res.json(rtn);
});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});

var idf = require('./tfidf');
idf.searchPage();
