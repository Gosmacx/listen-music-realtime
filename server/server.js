const http = require('http');
const server = http.createServer();
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"]
  }
});
const roomInfo = {
  duration: 0,
  isPlaying: true,
  partyState: false,
  admin: null
}

io.on("connection", (socket) => {

  socket.on('get-room', () => {
    io.to(socket.id).emit('room-info', roomInfo)
  })

  socket.on('get-song-info', data => {
    if (socket.id == roomInfo.admin) return socket.emit('song-info', roomInfo)
    let admin = io.sockets.sockets.get(roomInfo.admin)
    if (!admin) return
    admin.emit('give-info', socket.id)
  })

  socket.on('info-to-user', data => {
    let user = io.sockets.sockets.get(data.toUser)
    user.emit('song-info', { time: data.time, isPlaying: roomInfo.isPlaying })
  })

  socket.on('start-party', (admin) => {
    roomInfo.partyState = true;
    roomInfo.admin = admin;
    io.emit('room-info', roomInfo);
  })

  socket.on('change-playing', (data) => {
    roomInfo.isPlaying = data;
    io.emit('song-playing', data)
  })

  socket.on('change-duration', duration => {
    io.emit('song-duration', duration);
  })

  socket.on("disconnect", () => {
    if (socket.id == roomInfo.admin) {

      for (let s of io.of('/').sockets) {
        roomInfo.admin = s[1].id;
        break;
      }

      let admin = io.sockets.sockets.get(roomInfo.admin)
      if (!admin) roomInfo.partyState = false;
      socket.broadcast.emit('room-info', roomInfo);
    }
  });

})

server.listen(5555, () => {
  console.log("server listening on port 5555");
})