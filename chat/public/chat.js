window.onload = function() {      
    var chat = new NodeChat();  
    document.ondragstart = function(){
                    return false;
                }
    // document.onclick = function (ev) {
    //     ev.stopPropagation();
    // }
    // document.getElementById('roomBg').onclick = function(){
    //     return false;
    // }
    chat.init();  
};  
  


var NodeChat = function() {  
    this.socket = null;  
};  



NodeChat.prototype.init = function() {
        var $this = this;        
        this.socket = io.connect();  
        this.socket.on('connect', function() {  
            document.getElementById('info').textContent = 'get yourself a nickname :)';  
            document.getElementById('nickWrapper').style.display = 'block';  
            document.getElementById('nicknameInput').focus();  
        });  
        this.socket.on('nickExisted', function() {  
            document.getElementById('info').textContent = 'nickname is taken, choose another plz'; 
        });  
        this.socket.on('loginSuccess', function() {  
            document.title = 'nodechat of ' + document.getElementById('nicknameInput').value + ':)';  
            document.getElementById('loginWrapper').style.display = 'none';
            document.getElementById('messageInput').focus();
            startMoving(document.querySelector('.wrapper'), {opacity:100}, function() {
                startMoving(document.querySelector('.userBox'), {opacity:100});
                startMoving(document.querySelector('#showBtn'), {opacity:100});
                // $('.userBox').show(1000);
            });
        });



        document.getElementById('loginBtn').addEventListener('click', function() {                  
            var nickName = document.getElementById('nicknameInput').value;  
            if (nickName.trim().length != 0) {  
                $this.socket.emit('login', nickName); 
            } else {  
                document.getElementById('nicknameInput').focus();  
            }  
        }, false); 



        document.getElementById('nicknameInput').addEventListener('keyup', function(ev) {  
            if(ev.keyCode == 13) {
                var nickName = document.getElementById('nicknameInput').value;  
                if (nickName.trim().length != 0) {  
                    $this.socket.emit('login', nickName); 
                } else {  
                    document.getElementById('nicknameInput').focus();  
                }
            }    
        }, false); 



        this.socket.on('system', function(nickName, userCount, type, users) {  
            var msg = nickName + (type == 'login' ? ' joined  (～￣▽￣)～ ' : ' left     ┑(￣Д ￣)┍');  
            $this.displayMsg('system', msg, 'green');
            document.getElementById('userlistUl').innerHTML = '';
            users.forEach(function(item) {
                var oLi = document.createElement('li');
                oLi.innerHTML = '<a href = "#"><span class = "glyphicon glyphicon-user"></span> ' + item + '</a>';
                document.getElementById('userlistUl').appendChild(oLi);
            });
            document.querySelector('.badge').innerHTML = userCount;
        }); 



        function doSend() {
            var messageInput = document.getElementById('messageInput');
            var message = messageInput.value;
            var fontColor = document.querySelector('#colorBtn').value;
            var fontSize = document.querySelector('select').value;
            $this.socket.emit('postMsg', message, fontColor, fontSize);
            $this.displayMsg('me', message, fontColor, fontSize);
            messageInput.value = '';
            messageInput.focus();
        }



        document.getElementById("sendBtn").addEventListener('click', function() {
            doSend();
        }, false );



        document.getElementById("messageInput").addEventListener('keyup', function(ev) {
            if(ev.keyCode == 13) {
                doSend();
            }
        }, false );



        this.socket.on('newMsg', function(user, message, color, fontSize) {
            $this.displayMsg(user, message, color, fontSize);
        })



        document.getElementById("emoji").addEventListener('click', function(ev) {
            document.getElementById("emojiWrapper").style.display = "block";
            ev.cancelBubble = true;
        });



        document.addEventListener('click', function(ev) {
            if(ev.target != document.getElementById("emojiWrapper")) {
                 document.getElementById("emojiWrapper").style.display = "none";
            }
        });




        // var oImg = document.querySelector(".emojiWrapper").getElementsByTagName('img');
        //var oImg = document.getElementsByTagName('img').slice(9);
        var oImg = document.getElementsByTagName('img');
        for(var i = 9; i < oImg.length; i++ ) {
            oImg[i].index = i;
            oImg[i].onclick =  function(ev) {
                var messageInput = document.getElementById('messageInput');
                var message = messageInput.value;
                messageInput.value = messageInput.value + "[emoji:" + (this.index-8) + "]";
                ev.cancelBubble = true;
            };
        }
        //IE问题BUG: 不能让oMsg的 透明度 变成0， 但是 直接在style里改 Opacity兼容性引起，有待测试滤镜 filter:alpha(Opacity:x)
        document.getElementById('clearBtn').addEventListener('click', function(ev) {
        //  var oMsg = document.getElementById('historyMsg');
        // oMsg.hide();
        // oMsg.style.opacity = 0.1;
        // oMsg.style.filter = 'alpha(opacity=10)'
            startMoving(document.getElementById('historyMsg'), {opacity:0},function(){
                document.getElementById('historyMsg').innerHTML = ''; 
                document.getElementById('historyMsg').style.opacity = 1; 
            });
        });
};



NodeChat.prototype.displayMsg = function(user, msg, color, fontSize) { 
        var container = document.getElementById('historyMsg');
        var msgToDisplay = document.createElement('p');
        var date = new Date().toTimeString().substr(0, 8);  
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.style.fontSize = fontSize + 'px';
        var content  = msg;
        var match;
        var reg = /\[emoji:\d+\]/g;

        
        while (match = reg.exec(msg))  {
          var emojiIndex = match[0].slice(7, -1);
          content = content.replace(match[0], '<img src="emoji/' + emojiIndex + '.gif" />');
        }


        msgToDisplay.innerHTML = user + '(' + date + '):' + content;  
        container.appendChild(msgToDisplay);  
        container.scrollTop = container.scrollHeight;  
};











    



 
    
   
