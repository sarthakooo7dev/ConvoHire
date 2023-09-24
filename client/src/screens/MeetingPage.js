import { useEffect, useState, useCallback } from 'react'
import { useSocket } from '../context/SocketProvider'
import ReactPlayer from 'react-player'
import peer from '../service/peer'

const MeetingPage = () => {
  const socket = useSocket()
  const [remoteSocketId, setRemoteSocketId] = useState(null)
  const [remoteUserEmail, setRemoteUserEmail] = useState('')
  const [myStream, setMyStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState()

  const handleUserJoined = (data) => {
    console.log(`user joined ${data.email} with ${data.id}`)
    setRemoteSocketId(data.id)
    setRemoteUserEmail(data.email)
  }

  const handleUserCall = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    })
    const offer = await peer.getOffer()
    socket.emit('user:call', { to: remoteSocketId, offer })
    setMyStream(stream)
  }, [remoteSocketId, socket])

  const handleIncomingCall = useCallback(
    async ({ from, offer }) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      })

      setMyStream(stream)
      console.log(`incoming call from ${from} + ${offer}`)
      setRemoteSocketId(from)
      const ans = await peer.getAnswer(offer)

      socket.emit('call:accepted', { to: from, ans })
    },
    [socket],
  )

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream)
    }
  }, [myStream])

  const handleCallAccepted = useCallback(({ from, ans }) => {
    console.log('handleCallAccepted ->', ans)

    peer.setLocalDescription(ans)
    // to send my stream to remoteConnection
    sendStreams()
  })

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer()
    socket.emit('peer:negotiation:needed', { to: remoteSocketId, offer })
  }, [remoteSocketId, socket])

  const handleNegotiationIncoming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer)
      socket.emit('peer:negotiation:done', { to: from, ans })
    },
    [socket],
  )

  const handleNegotiationComplete = useCallback(({ from, ans }) => {
    peer.setLocalDescription(ans)
  }, [])

  // to handle negotiation needed state
  useEffect(() => {
    peer.peer.addEventListener('negotiationneeded', handleNegoNeeded)
    return () => {
      peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded)
    }
  }, [handleNegoNeeded])

  // to send tracks to other peer
  useEffect(() => {
    peer.peer.addEventListener('track', async (ev) => {
      const remoteStream = ev.streams
      console.log('GOT TRACKS!!')
      setRemoteStream(remoteStream[0])
    })
  }, [])

  useEffect(() => {
    socket.on('user:joined', handleUserJoined)
    socket.on('incoming:call', handleIncomingCall)
    socket.on('call:acceptedFromClient2', handleCallAccepted)
    socket.on('peer:negotiation:needed', handleNegotiationIncoming)
    socket.on('peer:negotiation:done', handleNegotiationComplete)
    return () => {
      socket.off('user:joined', handleUserJoined)
      socket.off('incoming:call', handleIncomingCall)
      socket.off('call:acceptedFromClient2', handleCallAccepted)
      socket.off('peer:negotiation:needed', handleNegotiationIncoming)
      socket.off('peer:negotiation:done', handleNegotiationComplete)
    }
  }, [
    handleCallAccepted,
    handleIncomingCall,
    handleNegotiationComplete,
    handleNegotiationIncoming,
    socket,
  ])

  return (
    <>
      <div>MeetingPage</div>
      <div>
        {remoteSocketId
          ? `${remoteUserEmail} joined the meeting`
          : 'No one joined meeting yet ...'}
      </div>
      <div>
        {remoteSocketId && (
          <>
            <button onClick={handleUserCall}> call user </button>
            <button onClick={sendStreams}> send stream </button>
          </>
        )}
      </div>

      <div>
        My Stream
        {myStream && (
          <>
            <ReactPlayer
              url={myStream}
              playing
              muted
              height="200px"
              width="200px"
            ></ReactPlayer>
          </>
        )}
      </div>

      <div>
        remote Stream
        {remoteStream && (
          <>
            <ReactPlayer
              url={remoteStream}
              playing
              muted
              height="200px"
              width="200px"
            ></ReactPlayer>
          </>
        )}
      </div>
    </>
  )
}

export default MeetingPage
