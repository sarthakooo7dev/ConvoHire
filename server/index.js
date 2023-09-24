const { Server } = require('socket.io')

const serverURL = 'https://convo-hire-4acyeds53-sarthakooo7dev.vercel.app/'

const io = new Server(serverURL, {
  cors: {
    origin: 'https://convo-hire-jgfx.vercel.app', // Adjust the origin to match your client's URL
    methods: ['GET', 'POST'], // Specify the allowed HTTP methods
    credentials: true, // Allow cookies or credentials to be sent
  },
})

// ////
// const ipAddress = '192.168.1.4'

// const PORT = 8000
// io.listen(PORT, { host: ipAddress })

// /////
const socketToEmailMap = new Map()
const emailToSocketMap = new Map()

io.on('connection', (socket) => {
  console.log('Socket Connected', socket.id)

  socket.on('room:join', (data) => {
    console.log(data)
    emailToSocketMap.set(data.email, socket.id)
    socketToEmailMap.set(socket.id, data.email)
    io.to(data.roomId).emit('user:joined', { email: data.email, id: socket.id })
    socket.join(data.roomId)
    io.to(socket.id).emit('room:join id mapped', data)
  })

  socket.on('user:call', ({ to, offer }) => {
    io.to(to).emit('incoming:call', { from: socket.id, offer })
  })

  socket.on('call:accepted', ({ to, ans }) => {
    console.log('callAccepted', ans)
    io.to(to).emit('call:acceptedFromClient2', { from: socket.id, ans })
  })

  socket.on('peer:negotiation:needed', ({ to, offer }) => {
    io.to(to).emit('peer:negotiation:needed', { from: socket.id, offer })
  })

  socket.on('peer:negotiation:done', ({ to, ans }) => {
    io.to(to).emit('peer:negotiation:done', { from: socket.id, ans })
  })
})
