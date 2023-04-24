import React, {useReducer, useEffect} from 'react'
import axios from 'axios';
import JoinBlock from './components/JoinBlock';
import socket from './socket'
import reducer from './reducer';
import Chat from './components/Chat';

// socket.on('ROOM:JOINED', (users) => {
//   console.log('Новый пользователь', users)
// })

function App() {
  const [state, dispatch] = useReducer(reducer, {
    joined: false,
    roomId: null,
    userName: null,
    users: [],
    messages: [],
  })

  window.socket = socket

  const onLogin = async (obj) => {
    dispatch({
      type: 'JOINED',
      payload: obj
    })
    socket.emit('ROOM:JOIN', obj)
    const {data} = await axios.get(`/rooms/${obj.roomId}`)
    setUsers (data.users)
  }

  const setUsers = (users) => {
    console.log('кто-то ушёл', users)
    dispatch({
      type: 'SET_USERS',
      payload: users
    })
  }

  useEffect(() => {
    console.log('useEffect')
    // socket.on('ROOM:JOINED', setUsers)
    socket.on('ROOM:SET_USERS', setUsers)
  }, [])
  return (
    <div className="wrapper">
      {!state.joined ? <JoinBlock onLogin={onLogin} /> : 
      <Chat {...state}/>
      }
    </div>
  );
}

export default App;
