var videoInput  = document.getElementById('inputVideo');
var canvasInput = document.getElementById('inputCanvas');
var intervalId;
var facetracker;
var stream;

var spinner = new Spinner({
  lines: 13, // The number of lines to draw
  length: 20, // The length of each line
  width: 10, // The line thickness
  radius: 30, // The radius of the inner circle
  corners: 1, // Corner roundness (0..1)
  rotate: 0, // The rotation offset
  direction: 1, // 1: clockwise, -1: counterclockwise
  color: '#fff', // #rgb or #rrggbb or array of colors
  speed: 1, // Rounds per second
  trail: 60, // Afterglow percentage
  shadow: false, // Whether to render a shadow
  hwaccel: false, // Whether to use hardware acceleration
  className: 'spinner', // The CSS class to assign to the spinner
  zIndex: 2e9, // The z-index (defaults to 2000000000)
  top: '50%', // Top position relative to parent
  left: '50%' // Left position relative to parent
}).spin($('.loading-icon')[0]);


initVideo(videoInput, canvasInput, function(webcamStream){
    stream = webcamStream;
    reset();
});

var ctx = canvasInput.getContext('2d');

function detect() {
    ctx.drawImage(videoInput, 0, 0, canvasInput.width, canvasInput.height);
    facetracker.track();
    var faceObj = facetracker.getTrackingObject();
    if (faceObj.width !== 0 && faceObj.height !== 0) {
        window.clearInterval(intervalId);
        beginRecording();
    }
}

function beginRecording() {
    $('.page').addClass('recording');
    gifshot.createGIF({
        cameraStream: stream,
        keepCameraOn: true,
        gifWidth: canvasInput.width,
        gifHeight: canvasInput.height,
        numFrames: 20,
        interval: 0.1,
        progressCallback: function(progress) {
            if (progress >= 1) {
                $('.page').removeClass('recording');
                $('.page').addClass('loading');
            }
        }
    }, function (obj) {
        if (!obj.error) {
            var image = obj.image;
            $('.page').removeClass('loading');
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

    $('.page').addClass('loading');

    $.post('submit.php', {
        photo_data: photoData,
        usernames: usernames
    })
    .done(function() {
        reset();
        $('.page').removeClass('loading');
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

    facetracker = new headtrackr.facetrackr.Tracker({
        smoothing: false,
        sendEvents: false,
        whitebalancing: false,
        calcAngles : false,
    });

    facetracker.init(canvasInput);

    var videoScale = 0.5;

    canvasInput.width  = videoInput.videoWidth  * videoScale;
    canvasInput.height = videoInput.videoHeight * videoScale;

    intervalId = window.setInterval(detect, 250);
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
    video.addEventListener('play', function() {
        if(video.width > video.height) {
            video.width = 320;
        } else {
            video.height = 240;
        }

        var intervalId = window.setInterval(function(){
            if (video.videoWidth && video.videoHeight) {
                window.clearInterval(intervalId);
                success(stream);
            }
        }, 100);

    }, false);
}
