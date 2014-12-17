var facetracker;
var canvasInput = document.getElementById('inputCanvas');
var ctx = canvasInput.getContext('2d');


onmessage = function(e) {
    // console.log('Message received from main script');
    // var workerResult = 'Result: ' + (e.data[0] * e.data[1]);
    // console.log('Posting message back to main script');
    // postMessage(workerResult);

    if (e.data == 'reset') {
        reset();
    }

    if (e.data == 'detect') {
        detect();
    }

}

function reset() {
    importScripts('lib/headtrackr.js');
    facetracker = new headtrackr.facetrackr.Tracker({
        smoothing: false,
        sendEvents: false,
        whitebalancing: false,
        calcAngles : false,
    });

    facetracker.init(canvasInput);
}

function detect() {
    ctx.drawImage(videoInput, 0, 0, canvasInput.width, canvasInput.height);
    facetracker.track();
    var faceObj = facetracker.getTrackingObject();
    if (faceObj.width !== 0 && faceObj.height !== 0) {
        window.clearInterval(intervalId);
        // beginRecording();
        postMessage('beginRecording');
    }
}
