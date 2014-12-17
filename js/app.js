var videoInput  = document.getElementById('inputVideo');
var canvasInput = document.getElementById('inputCanvas');
var intervalId;
var detectWorker = new Worker('/js/detect.js');

detectWorker.onmessage = function(e) {
    if (e.data == 'beginRecording') {
        beginRecording();
    }
}

initVideo(videoInput, canvasInput, function(){
    reset();
});

var ctx = canvasInput.getContext('2d');

function detect() {
    detectWorker.postMessage('detect');
}

function beginRecording() {
    $('.page').addClass('recording');
    gifshot.createGIF({
        video: videoInput.src,
        gifWidth: canvasInput.width,
        gifHeight: canvasInput.height,
        numFrames: 20,
        interval: 0.1,
        progressCallback: function(progress) {
            if (progress >= 1) {
                $('.page').removeClass('recording');
                $('.page').addClass('rendering');
            }
        }
    }, function (obj) {
        if (!obj.error) {
            var image = obj.image;
            $('.page').removeClass('rendering');
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

$(document).keyup(function(e) {
    if (e.keyCode == 27) {
        // Close form when user hits escape
        reset();
    }
});

function reset() {

    detectWorker.postMessage('reset');

    var videoScale = 0.25;
    canvasInput.width  = videoInput.videoWidth  * videoScale;
    canvasInput.height = videoInput.videoHeight * videoScale;

    intervalId = window.setInterval(detect, 1000);
    $('.page .live').show();
    $('.page .submit-form').hide();
    $('.page').css('background-image', 'none');
    $('.page .submit-form .usernames').val('');
}

function initVideo(video, canvas, success) {
    // Adapted from:
    // https://github.com/auduno/headtrackr/blob/1d29271c6e2c3ed01bfc96b18bacfe4ea56c26c6/headtrackr.js#L149
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;
    // Check for camera support
    if (navigator.getUserMedia) {

        // Chrome 19 shim
        var videoSelector = {video : true};
        if (window.navigator.appVersion.match(/Chrome\/(.*?) /)) {
            var chromeVersion = parseInt(window.navigator.appVersion.match(/Chrome\/(\d+)\./)[1], 10);
            if (chromeVersion < 20) {
                videoSelector = "video";
            }
        };

        // Opera shim
        if (window.opera) {
            window.URL = window.URL || {};
            if (!window.URL.createObjectURL) window.URL.createObjectURL = function(obj) {return obj;};
        }

        // Set up stream
        navigator.getUserMedia(videoSelector, (function( stream ) {
            this.stream = stream;
            if (video.mozCaptureStream) {
              video.mozSrcObject = stream;
            } else {
              video.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
            }
            video.play();
        }).bind(this), function() {
        });
    } else {
        alert('Your browser is unsupported. Try using Chrome or something.');
    }

    // Resize video when it's playing
    video.addEventListener('playing', function() {
        if(video.width > video.height) {
            video.width = 320;
        } else {
            video.height = 240;
        }
        success();
    }, false);
}
