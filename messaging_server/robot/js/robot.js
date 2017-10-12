"use strict";

var name = 'flo1';
socket.emit('info', 'robot', name);

socket.on('message', function (data) {
    console.log('received message: ' + data);
    if (data.type === "offer") {
        if (!started) {
            try {
                pc = new RTCPeerConnection(null);
                pc.onicecandidate = handleIceCandidate;
                pc.onaddstream = handleRemoteStreamAdded;
                pc.onremovestream = handleRemoteStreamRemoved;
                console.log('Created RTCPeerConnnection');
            } catch (e) {
                console.log('Failed to create PeerConnection, exception: ' + e.message);
                alert('Cannot create RTCPeerConnection object.');
                return;
            }
        }
    }
});

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