const express = require("express")
var app = express();
var server = app.listen(8080);
var io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
});
class Obj{
    constructor(name,indexAvatar,posX=0,posY=0){
        this.name=name,
        this.posX=posX,
        this.posY=posY,
        this.indexAvatar=indexAvatar
    }
    
}
app.use(express.static(__dirname));
let onlineUsers={};
io.on('connection', (socket) => {
    //io.emit('join;joi',{name:'aaaa',})
    socket.on('join', (data) => {
        const newUser=new Obj(data.name,data.indexAvatar);
        console.log(newUser);
        onlineUsers[socket.id] = newUser;
        io.emit('onlineUsers',{onlineUsers:onlineUsers,userName:newUser.name,socketId:socket.id,flag:true});
      });
    socket.on('chatMessage',(message)=>{
        io.emit('remoteMessage',{name:onlineUsers[socket.id].name,indexAvatar:onlineUsers[socket.id].indexAvatar,content:message,socketId:socket.id})
    })

    socket.on('animation',(anim)=>{
        console.log(anim);
        io.emit('remoteAnimation',{socketId:socket.id,animation:anim})
    })
    socket.on('updatePosition',(position)=>{
        onlineUsers[socket.id].posX=position.posX;
        onlineUsers[socket.id].posY=position.posY;
        io.emit('remotePosition',{socketId:socket.id,posX:position.posX,posY:position.posY})
    })

    socket.on('disconnect', () => {
        const userNameDisconnect=onlineUsers[socket.id].name;
        console.log(`User ${userNameDisconnect} disconnected`);
        delete onlineUsers[socket.id];
        io.emit('onlineUsers',{onlineUsers:onlineUsers,socketId:socket.id,userName:userNameDisconnect,flag:false});
      });
});