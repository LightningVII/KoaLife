import app, { loadMiddlewares } from './app'
import { connectDB, initAdmin } from './database/init'
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)
const fs = require('fs')
const filepath = './assets/vertical/wallhaven-237043.jpg'
console.log(initAdmin)
;(async () => {
  try {
    // await connectDB()
    await loadMiddlewares(app)
    await initAdmin()
  } catch (err) {
    console.log(err)
  }

  /* app.get('/', function(req, res) {
        console.log
        res.sendfile('index.html');
    }); */

  /* app.use(async (ctx, next) => {
    const start = new Date()
    // const ms = new Date() - start
    // const body = ctx.request && ctx.request.body
    ctx.body = 'hello world' + start
  }) */

  var bData = fs.readFileSync(filepath)
  var base64Str = bData.toString('base64')
  var datauri = 'data:image/png;base64,' + base64Str
  var users = []
  var find = id => users.find((v) => {
    return v.id === id;
  })
  io.on('connection', function (socket) {
    socket.on('login', function (event) {
      users.push({
        name: event,
        id: socket.id
      })
      socket.broadcast.emit('msg', {
        id: socket.id,
        name: event,
        word: 'joined'
      })
      socket.emit('msg', {
        id: socket.id,
        name: event,
        word: '我登陆了'
      })
    })

    socket.on('self-words', function (event) {
      socket.emit('msg', {
        id: socket.id,
        name: event,
        word: '自言自语'
      })
    })

    socket.on('toSomebody', function (event) {
      socket.to(event).emit('msg', {
        id: event,
        name: find(socket.id).name,
        word: find(socket.id).name + '对我说'
      })
    })

    socket.on('listen event', function (event) {
      const dir = event.indexOf('rtl') >= 0 ? 'rtl' : 'ltr'
      console.log(dir)
      socket.emit('ping', {
        data: {
          type: 'text',
          dir,
          data: event
        }
      })

      event.indexOf('Tupian') >= 0 &&
        socket.emit('ping', {
          data: {
            type: 'pic',
            data: datauri,
            dir
          }
        })
    })
  })

  /* setInterval(() => {
    io.emit('ping', {
      data: {
        type: 'pic',
        data: datauri
      }
    })
  }, 50000) */

  // new Date() / 1

  // http.listen(3000, function() {
  //     console.log('listening on *:3000');
  // });
  // 进行交互
  // ...

  // 关闭浏览器
  // await browser.close();

  // require('./tasks/movie-to-db');
  // require('./tasks/api-to-db');
  // require('./tasks/trailer-to-db');
  // require('./tasks/qiniu-to-db');
})()
export { app, server }
