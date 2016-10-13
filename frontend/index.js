var data = [];
$(window).on('load', function() {
alert('loaded');
    $('.rc').each(function(i) {
        var x = data[i] = {};
        x.index = i;
        x.element = this;
        x.url = this.childNodes[0].childNodes[0].href;


        function handledata(data) {
            console.log(data);
            x.uid = data.data[0].uid;
            x.votes = data.data[0].votes;
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
});

function vote(uid, updown) {
    $.get("https://vps.boschwitz.me:8443/vote/" + uid + "/" + updown, function(data) {
        //do nothing
    });
}
