"use strict";

var name = 'flo1';
socket.emit('info', 'robot', name);

socket.on('messages', function (data) {
    alert(data);
});

var remoteVideo = document.getElementById('remoteVideo');
trace('got video panels');

function gotStream(stream) {
    trace('Received local stream');
    localStream = stream;
}

trace('Requesting local stream');
navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true
})
    .then(gotStream)
    .catch(function (e) {
        alert('getUserMedia() error: ' + e.name);
    });