import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../context/SocketProvider'

const Home = () => {
  const [email, setEmail] = useState('')
  const [roomId, setRoomId] = useState('')
  const [userRoomId, setUserRoomId] = useState('11111')

  const socket = useSocket()
  const navigate = useNavigate()

  // It is used to generate a 6-digit roomId
  const generateRoomId = () => {
    const newRoomId = Math.random().toString(36).substring(2, 9).toUpperCase()
    console.log(newRoomId)
    setRoomId(newRoomId)
  }

  // This method is called to send join req to server
  const handleJoin = useCallback(
    (e) => {
      console.log('email--> ', email)
      console.log('roomId--> ', roomId)

      socket.emit('room:join', { email, roomId })
      if (roomId.length <= 0) {
        setRoomId(userRoomId)
      }
    },
    [email, roomId, socket, userRoomId],
  )

  // this method is called when server returns the event for room joined by the user
  const handleRoomJoined = useCallback(
    (data) => {
      console.log('Room joined by-> ' + data.email + ' ' + data.roomId)
      navigate(`/room/${data.roomId}`)
    },
    [navigate],
  )

  // This useEffect will listen for the room joined event from server and call handleRoomJoined
  useEffect(() => {
    socket.on('room:join id mapped', handleRoomJoined)

    return () => {
      socket.off('room:join id mapped', handleRoomJoined)
    }
  }, [socket, handleRoomJoined])

  const test = (e) => {
    console.log(e.target.value)
    setRoomId(e.target.value)
  }

  return (
    <>
      <h1>Home</h1>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleJoin}> JOIN </button>
      <button onClick={generateRoomId}> gen room Id </button>

      <div>
        <input
          type="text"
          placeholder="Enter your meeting id"
          onChange={test}
        />
      </div>
    </>
  )
}

export default Home
