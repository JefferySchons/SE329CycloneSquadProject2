var data = [];

//doesn't fire when you search, wouldn't use this
// $(window).on('load', function() {
//     alert('loaded');
//     loadit();
// });



/*
//to fire loadit whenever someone does a new search, i'd do something like

$('.lsb').onclick(function(){
loadit()
});

//and

$('#lst-ib').keypress(function(e){
//enter pressed
  if(e.which == 13)
    loadit()
});

//should do it (I think)
*/


function loadit() {
  console.log('loadingit')
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


function vote(uid, updown) {
    $.get("https://vps.boschwitz.me:8443/vote/" + uid + "/" + updown, function(data) {
        //do nothing
    });
}
