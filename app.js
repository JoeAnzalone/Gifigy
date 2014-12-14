var videoInput  = document.getElementById('inputVideo');
var canvasInput = document.getElementById('inputCanvas');

var htracker = new headtrackr.Tracker({
    ui: true,
    headPosition : false,
    fadeVideo: false,
    calcAngles: true,
    headPosition: false
});

htracker.init(videoInput, canvasInput);
htracker.start();

document.addEventListener('headtrackrStatus',
    function (event) {
        var status = event.status;
        if (status == 'found') {
            beginSnapshots();
        }
    }
);

function beginSnapshots() {
    $('.page').addClass('recording');
    gifshot.createGIF({
        video: videoInput.src,
    }, function (obj) {
        if (!obj.error) {
            var image = obj.image;
            $('.page').removeClass('recording');
            $('.page .submit-form').show();
            $('.page .submit-form .usernames').focus();
            $('.page .submit-form .photo-data').val(image);
            $('.page').css('background-image', 'url(' + image + ')');
            $('.page .live').hide();
        }
    });
}

$('.page .submit-form').submit(function(e){
    e.preventDefault();

    var usernames = e.currentTarget.elements.usernames.value;
    var photoData = e.currentTarget.elements['photo-data'].value;

    $.post('submit.php', {
        photo_data: photoData,
        usernames: usernames
    })
    .done(function() {
        reset();
    })
    .fail(function() {
        alert('Something broke! :(');
    });

    return false;
});

$('.page .submit-form .discard').click(function(){
    reset();
});

function reset() {
    $('.page .live').show();
    $('.page .submit-form').hide();
    $('.page').css('background-image', 'none');
    $('.page .submit-form .usernames').val('');
}
