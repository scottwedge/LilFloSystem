var socket = io.connect('http://localhost:8080');
socket.emit('info','robot','flo1');

socket.on('messages', function(data){
    alert(data);
});