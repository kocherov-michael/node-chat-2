import React, {useReducer, useEffect} from 'react'
import axios from 'axios';
import JoinBlock from './components/JoinBlock';
import socket from './socket'
import reducer from './reducer';
import Chat from './components/Chat';


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
    dispatch({
      type: 'SET_USERS',
      payload: users
    })
  }

  const addMessage = (message) => {
    dispatch({
      type: 'NEW_MESSAGE',
      payload: message,
    });
  };

  useEffect(() => {
    socket.on('ROOM:SET_USERS', setUsers)
    socket.on('ROOM:NEW_MESSAGE', message => {
      dispatch({
        type: 'NEW_MESSAGE',
        payload: message
      })
    })
  }, [])
  return (
    <div className="wrapper">
      {!state.joined ? <JoinBlock onLogin={onLogin} /> : 
      <Chat {...state} onAddMessage={addMessage}/>
      }
    </div>
  );
}

export default App;
