import io from 'socket.io-client'

const socket = io("wss://chatwsreact.onrender.com:10000")

export default socket