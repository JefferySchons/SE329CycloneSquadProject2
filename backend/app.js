var express = require('express');
var app = express();
var database = require('./database');

app.get('/', function(req, res) {
    res.send('Hello World!');
});

app.get('/vote/:uid/:dir', function(request, response, next) {
    var uid = request.params.uid;
    var dir = request.params.dir; //must be up or down
    rtn = {};
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
        database.query('UPDATE `urls` set `votes` = `votes` ' + (dir == 'up' ? '+' : '-' ) + ' 1 WHERE `uid` = ?;', [uid], function(err, result) {
            if (err)
                rtn.error =  err;
            if (result.changedRows != 1) {
                rtn.error = {
                    code: 1001,
                    message: 'failed to update votes!'
                }
            }
            console.log("Tasks: updateTask() - ", result);
        });
    } while (false);
    response.JSON(rtn);

});

app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});

var idf = require('./tfidf');
idf.searchPage();
