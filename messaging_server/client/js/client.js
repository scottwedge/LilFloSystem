"use strict";



//setup buttons
callButton.disabled = true;
hangupButton.disabled = true;
startButton.onclick = start;
callButton.onclick = call;
// hangupButton.onclick = hangup;


/////// WebRTC Stuff


var robot = 'flo1'; // TODO: make this selection based
var name = prompt('What is your username?');

socket.emit('info', 'user', name);

socket.on('message', function (data) {
    console.log('received message: ' + data);
});

socket.on('new_robot', function (name) {
    console.log('new robot connected: ' + name);
})

socket.on('disconnected_robot', function (name) {
    console.log('robot disconnected: ' + name);
})

socket.emit('join', robot);
socket.on('joined', function (room) {
    console.log('joined room ' + room);
    isChannelReady = true;
})

///////////////////// Video on screen



function gotStream(stream) {
    trace('Received local stream');
    localVideo.srcObject = stream;
    localStream = stream;
    callButton.disabled = false;
    startButton.disabled = true;
}

function start() {
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

// might need to setup a turn server here

function call(){
    createPeerConnection();
    pc.addStream(localStream);
    pc.createOffer(setLocalAndSendMessage, handleCreateOfferError)
}

function handleIceCandidate(event) {
  console.log('icecandidate event: ', event);
  if (event.candidate) {
    sendMessage({
      type: 'candidate',
      label: event.candidate.sdpMLineIndex,
      id: event.candidate.sdpMid,
      candidate: event.candidate.candidate
    });
  } else {
    console.log('End of candidates.');
  }
}





