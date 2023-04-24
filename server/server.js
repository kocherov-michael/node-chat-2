const express = require('express')
const path = require('path')
const port = process.env.PORT || 9999
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: {
      origin: '*'
    }
  })
//   app.use(bodyParser.json())
  app.use(express.json())
//   app.use(express.urlencoded({extended: true}))
console.log(path.join(__dirname, '../client/build'))
app.use('/', express.static(path.join(__dirname, '../client/build/')))
const rooms = new Map()
app.get('/rooms/:id', (req, res) => {
    const roomId = req.params.id
    const obj = rooms.has(roomId) ? {
        users: [...rooms.get(roomId).get('users').values()],
        messages: [...rooms.get(roomId).get('messages').values()]
    } : {users: [], messages: []}
    res.json(obj)
})

app.post('/rooms' , (req, res) => {
    console.log(req.body)
    
    const {roomId, userName} = req.body
    if (!rooms.has(roomId)) {
        rooms.set(
            roomId, 
            new Map([
                ['users', new Map()],
                ['messages', []],
            ])
            )
    }
    
    res.json(rooms)
})

io.on('connection', (socket) => {
    console.log('user connected', socket.id)
    socket.on('ROOM:JOIN', ({roomId, userName}) => {
        console.log('roomId', roomId)
        socket.join(roomId);
        // console.log('socket', socket)
        rooms.get(roomId).get('users').set(socket.id, userName)
        const users = [...rooms.get(roomId).get('users').values()]
        console.log('users',users)
        // socket.to(roomId).emit('ROOM:JOINED', users)
        socket.broadcast.to(roomId).emit('ROOM:SET_USERS', users)
    })

    socket.on('disconnect', () => {
        console.log('disconnected')
        rooms.forEach((value, roomId) => {
            if( value.get('users').delete(socket.id)) {
                const users = [...value.get('users').values()]
                console.log('users',users)
                socket.broadcast.to(roomId).emit('ROOM:SET_USERS', users)
            }
        })
    })
})

server.listen(port, (err) => {
    if(err) {
        throw Error(err)
    }
    console.log('Сервер запущен на порту ',port)
})