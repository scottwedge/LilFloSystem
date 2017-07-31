"use strict";

var socket = io.connect('http://localhost:8080');

var name = prompt('What is your username?');

socket.emit('info','user',name);

socket.on('messages', function(data){
    alert(data);
});

socket.on('new_robot',function(name){
    alert('new robot connected: '+name);
})

//setup buttons
callButton.disabled = true;
hangupButton.disabled = true;
startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;


/////// WebRTC Stuff

///////////////////// Video on screen
navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints = {
  audio: false,
  video: true
};

var local_video = document.getElementById('local_video');
var remote_video = document.getElementById('remote_video');


function successCallback(stream) {
  window.stream = stream; // stream available to console
  if (window.URL) {
    local_video.src = window.URL.createObjectURL(stream);
  } else {
    local_video.src = stream;
  }
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);