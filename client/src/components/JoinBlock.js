import React, { useState } from 'react'
import axios from 'axios'
// import socket from '../socket'

function JoinBlock({onLogin}) {
    const [roomId, setRoomId] = useState('')
    const [userName, setUserName] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const onEnter = async () => {
        if (!roomId || !userName) {
            return alert('неверные данные')
        }
        console.log(roomId, userName)
        const obj = {
            roomId,
            userName
        }
        setIsLoading(true)
        await axios.post('/rooms', obj)
        onLogin(obj)
        setIsLoading(false)
    }
    return (
      <div className='join-block'>
        <input 
            type="text" 
            placeholder='room id' 
            value={roomId} 
            onChange={e => setRoomId(e.target.value)} 
        />
        <input 
            type="text" 
            placeholder='ваше имя' 
            value={userName} 
            onChange={e => setUserName(e.target.value)}
        />
        <div>
            <button disabled={isLoading} className='btn btn-success' onClick={() => {onEnter()}}>
                {isLoading ? '...ВХОД' : 'ВОЙТИ'}
            </button>
        </div>
      </div>
    );
  }
  
  export default JoinBlock;