var express = require('express')
var app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
// 发现有货道的概念 还有 设备
// 卡槽号，货道号。概念
// read from database
var inventory = 10; // 模拟库存

io.on('connection', (socket) => {
  const delay = (Math.random() * 10000);
  socket.on('orderId', (msg) => {
      const user = JSON.parse(msg)
      socket.user = user;
      console.log('库存剩余:' + inventory)
      if (inventory <= 0) {
         socket.emit('fail', JSON.stringify({user:socket.user, error:"库存不足"})) 
      } else {
          inventory--;
          setTimeout(() => {
            if (delay > 6500) {
                inventory += 1
                socket.emit('fail', JSON.stringify({user:socket.user, error:"设备未响应"}))
            } else {
                socket.emit('result', JSON.stringify({user:socket.user, noneStr: delay + ' ms'}))
            }
          }, delay)
      }
      
  })
});


http.listen(3000, () => {
  console.log('listening on *:3000');
});