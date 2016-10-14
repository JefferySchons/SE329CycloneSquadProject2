var data = [];

$(window).on('load', function() {
    window.setTimeout(loadit, 1000);
});




//to fire loadit whenever someone does a new search, i'd do something like

$('.lsb').click(function() {
    loadit()
});

//and

$('#lst-ib').keypress(function(e) {
    //enter pressed
    if (e.which == 13)
        loadit()
});

//should do it (I think)



function loadit() {
    console.log('loadingit')
    var len = $('.rc').length;
    $('.rc').each(function(i) {
        var x = data[i] = {};
        x.index = i;
        x.element = this;
        x.url = this.childNodes[0].childNodes[0].href;


        function handledata(data) {
            console.log(data);
            x.uid = data.data[0].uid;
            x.votes = data.data[0].votes;
            x.element.innerHTML = '<table><tbody><tr><td style="text-align:center"><span onclick="vote(this,'+x.index+','+x.uid+',\'up\')"><img src="'+chrome.extension.getURL('/upvote.png')+'" /></span><br><span class="votes">'+x.votes+'</span><br><span onclick="vote(this,'+x.index+','+x.uid+',\'down\')"><img src="'+chrome.extension.getURL('/downvote.png')+'" /></span></td><td>'+x.element.childNodes[0].innerHTML+(x.element.childNodes[1] ?  x.element.childNodes[1].innerHTML : "")+'</td></tr></tbody></table>';
            // here is the best place you could inject your html into the element using x.element.innerHTML or something

            if (i == len - 1) {
                //everything is done loading here, load keywords
                loadkeywords();
            }
        }
        $.ajax({
            type: 'POST',
            url: "https://vps.boschwitz.me:8443/geturl",
            data: JSON.stringify({
                url: x.url
            }),
            contentType: 'application/json',
            dataType: 'json',
            success: handledata
        });
    });
}


function loadkeywords() {
    //must run after loadit
    console.log('loadkeywords')
    console.log(data.length)
    var urls = [];
    for (var i = 0; i < data.length; i++) {
        urls.push(data[i].url)
    }

    function handledata(rtn) {
        console.log(rtn);
        for (var i = 0; i < rtn.keywords.length; i++) {
          if(data[i] != undefined)
          continue;
            data[i].keywords = rtn.keywords[i];

            var title_keywords = "Top Keywords: ";
            for (var j = 0; rtn.keywords[i] != null && j < rtn.keywords[i].length && j < 3; j++)
                title_keywords += rtn.keywords[i][j].term + ", ";

            data[i].title = title_keywords.substring(0, title_keywords.length - 2);
            $(data[i].element).children('.r').children('a')[0].title = data[i].title;
            console.log($(data[i].element).children('.r').children('a')[0]);
            console.log(title_keywords)
        }
        //everything is done
        afterload();
    }
    console.log({
        urls: urls
    });
    $.ajax({
        type: 'POST',
        url: "https://vps.boschwitz.me:8443/keywords",
        data: JSON.stringify({
            urls: urls
        }),
        contentType: 'application/json',
        dataType: 'json',
        success: handledata
    });
}

function afterload() {
    //this is called after everything is loaded from the server
    console.log('everything is loaded');
    var el = document.createElement('script');
    el.innerHTML = `data = ` + JSON.stringify(data) + `; \n function vote(e, index, uid, updown){
      data[index].votes = data[index].votes + (updown == "up" ? 1 : -1);
      var x = data[index];
      e.parentNode.childNodes[2].innerHTML = x.votes;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", "https://vps.boschwitz.me:8443/vote/" + uid + "/" + updown);
    oReq.send();
  }`;
  var th = document.getElementsByTagName('body')[0];
  th.appendChild(el);
  console.log(el);
}

// function vote(uid, updown) {
//   data[uid].votes = data[uid].votes + (updown == "up" ? 1 : -1);
//   var x = data[uid];
//   x.element.innerHTML = '<table><tr><td style="text-align:center"><span onclick="vote('+x.uid+',\\\"up\\\")">up</span><br><span class="votes">'+x.votes+'</span><br><span onclick="vote('+x.uid+',\'down\')">down</span></td><td>'+x.element.childNodes[0].innerHTML+(x.element.childNodes[1].innerHTML || "")+'</td></tr></table>';
//
//     $.get("https://vps.boschwitz.me:8443/vote/" + uid + "/" + updown, function(data) {
//         //do nothing
//     });
// }
// function injectScript(file, node) {
//     var th = document.getElementsByTagName(node)[0];
//     var s = document.createElement('script');
//     s.setAttribute('type', 'text/javascript');
//     s.setAttribute('src', file);
//     th.appendChild(s);
// }
// console.log(chrome.extension.getURL('/jquery.min.js'));
// injectScript( chrome.extension.getURL('/jquery.min.js'), 'body');
// injectScript( chrome.extension.getURL('/index.js'), 'body');
