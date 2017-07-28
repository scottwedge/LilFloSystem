var socket = io.connect('http://localhost:8080');

var name = prompt('What is your username?');

socket.emit('info','user',name);

socket.on('messages', function(data){
    alert(data);
});

socket.on('new_robot',function(name){
    alert('new robot connected: '+name);
})

