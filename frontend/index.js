var data = [];

$(window).on('load', function() {
    window.setTimeout(loadit, 1000);
});




//to fire loadit whenever someone does a new search, i'd do something like

$('.lsb').click(function(){
loadit()
});

//and

$('#lst-ib').keypress(function(e){
//enter pressed
  if(e.which == 13)
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

            // here is the best place you could inject your html into the element using x.element.innerHTML or something

            if(i == len - 1) {
              //everything is done loading
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


function loadkeywords(){
//must run after loadit
console.log('loadkeywords')
console.log(data.length)
  var urls = [];
  for(var i = 0; i < data.length; i++){
    urls.push(data[i].url)
  }

  function handledata(rtn) {
    console.log(rtn);
      for(var i = 0; i < rtn.keywords.length; i++){
        data[i].keywords = rtn.keywords[i];
      }
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


function vote(uid, updown) {
    $.get("https://vps.boschwitz.me:8443/vote/" + uid + "/" + updown, function(data) {
        //do nothing
    });
}
