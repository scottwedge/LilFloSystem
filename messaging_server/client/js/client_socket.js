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


/////// WebRTC Stuff
navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints = {
  audio: false,
  video: true
};
var video = document.querySelector('video');

function successCallback(stream) {
  window.stream = stream; // stream available to console
  if (window.URL) {
    video.src = window.URL.createObjectURL(stream);
  } else {
    video.src = stream;
  }
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);