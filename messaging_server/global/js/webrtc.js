'use strict';

var pcConfig = {
  'iceServers': [{
    'urls': 'stun:stun.l.google.com:19302'
  }]
};

var offerOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true
};

var isChannelReady = false;
var isStarted = false;
var localStream;
var pc;
var remoteStream;
var turnReady;
var readyToConnect = true;

var socket = io.connect(); //TODO: investigate no args here

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

var constraints = {
    audio: false,
    video: true
};

var startTime;