"use strict";



//setup buttons
callButton.disabled = true;
hangupButton.disabled = true;
startButton.onclick = start;
// callButton.onclick = call;
// hangupButton.onclick = hangup;


/////// WebRTC Stuff


var robot = 'flo1'; // TODO: make this selection based
var name = prompt('What is your username?');

socket.emit('info', 'user', name);

socket.on('messages', function (data) {
    alert(data);
});

socket.on('new_robot', function (name) {
    alert('new robot connected: ' + name);
})

socket.emit('join', robot);
socket.on('joined', function (room) {
    console.log('joined room ' + room);
    isChannelReady = true;
})

///////////////////// Video on screen

var localVideo = document.getElementById('localVideo');
var remoteVideo = document.getElementById('remoteVideo');
trace('got video panels');

function gotStream(stream) {
    trace('Received local stream');
    localVideo.srcObject = stream;
    localStream = stream;
    callButton.disabled = false;
    startButton.disabled = true;
}

function start() {
    if (readyToConnect) {
        trace('Requesting local stream');
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
        })
            .then(gotStream)
            .catch(function (e) {
                alert('getUserMedia() error: ' + e.name);
            });
    }
}
