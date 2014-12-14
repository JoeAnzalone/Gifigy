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
            $('.page').removeClass('recording');
            var image = obj.image;
            $('.page').css('background-image', 'url(' + image + ')');
            $('.page .live').hide();
            postImage(image);
        }
    });
}

function postImage(base64) {
    $.post('submit.php', {
        photo_data: base64
    });
}
