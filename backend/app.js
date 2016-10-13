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

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'https://www.google.com');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}
app.use(allowCrossDomain);


app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.get('/vote/:uid/:dir', function(req, res, next) {
    var uid = req.params.uid;
    var dir = req.params.dir; //must be up or down
    var rtn = {};
    rtn.uid = uid;
    rtn.dir = dir;
    rtn.ready = false;

    do {
        if (dir != 'up' && dir != 'down') {
            rtn.error = {
                code: 1002,
                message: 'format must be "/vote/{uid}/{dir}" where dir="up"|"down"'
            }
            break;
        }
        console.log('vote', uid, dir);

        function firstquery(err, result, fields) {
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
            rtn.ready = true;
            res.json(rtn);
        }
        database.query('UPDATE `urls` set `votes` = `votes` ' + (dir == 'up' ? '+' : '-') + ' 1 WHERE `uid` = ?;', [uid], firstquery);
    } while (false);


});

app.post('/geturl', function(req, res, next) {
    var rtn = {};
    var data = req.body;
    rtn.req = {};
    rtn.req.ip = req.ip;
    rtn.req.cmd = 'geturl';
    rtn.ready = false;
    rtn.req.data = data;


    function firstquery(err, rows, fields) {
        console.log(arguments);
        if (err)
            throw err;
        if (rows == undefined || rows.length == 0) {
            database.query("INSERT INTO `urls` (`uid`, `url`, `votes`) VALUES (NULL, ?, '0');", [data.url.substring(0, 80)], secondquery);
            return;
        }
        rtn.data = rows;
        rtn.data[0].uid = Number(rtn.data[0].uid);
        res.json(rtn);
    }

    function secondquery(err, rows, fields) {
        if (err)
            throw err;
        database.query('SELECT * FROM `urls` WHERE `url` = ?', [data.url.substring(0,80)], firstquery);
    }

    database.query('SELECT * FROM `urls` WHERE `url` = ?', [data.url.substring(0,80)], firstquery);

});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});

var idf = require('./tfidf');
idf.searchPage();
