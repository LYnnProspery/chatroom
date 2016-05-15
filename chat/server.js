var express = require('express');
var osocket = require('socket.io');
var http = require('http');

var app = express();
var server = http.createServer(app);
var io = osocket.listen(server);
 
var users = [];
app.use('/', express.static(__dirname + '/public'));  
server.listen(8888, 'localhost');  
 

io.on('connection', function(socket) {  
    socket.on('login', function(nickname) {  
        if (users.indexOf(nickname) > -1) {  
            socket.emit('nickExisted');  
        } else {  
        	users.push(nickname);
            socket.userIndex = users.length; 
            
            socket.nickname = nickname;  
              
            socket.emit('loginSuccess'); 

             io.sockets.emit('system', nickname, users.length, 'login', users); //to all users
        }
    }); 



    socket.on('disconnect', function() {  
        users.splice(socket.userIndex - 1, 1);  
        socket.broadcast.emit('system', socket.nickname, users.length, 'logout', users);  //to all users except
        }); 


        socket.on('postMsg', function(message, fontColor, fontSize) {
            socket.broadcast.emit('newMsg', socket.nickname, message, fontColor, fontSize);
        });

});