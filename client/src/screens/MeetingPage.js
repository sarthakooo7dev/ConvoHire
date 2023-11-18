import { useEffect, useState, useCallback } from 'react'
import { useSocket } from '../context/SocketProvider'
import ReactPlayer from 'react-player'
import peer from '../service/peer'

import { TeamOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'

const MeetingPage = () => {
  const socket = useSocket()
  const [remoteSocketId, setRemoteSocketId] = useState(null)
  const [remoteUserEmail, setRemoteUserEmail] = useState('')
  const [myStream, setMyStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [isVisble, setIsVisble] = useState(true)
  const [isStreamVisible, setIsStreamVisible] = useState(false)
  const [myStreamEmail, setMyStreamEmail] = useState('')
  const [remoteStreamEmail, setRemoteStreamEmail] = useState('')

  const navigate = useNavigate()

  const { state } = useLocation()

  const handleUserNames = useCallback(() => {
    setMyStreamEmail(state)
    console.log('myStreamEmail', state)
  }, [state])

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
    socket.emit('user:call', {
      to: remoteSocketId,
      offer,
      callerEmail: myStreamEmail,
    })
    setMyStream(stream)
  }, [myStreamEmail, remoteSocketId, socket])

  const handleIncomingCall = useCallback(
    async ({ from, offer, callerEmail }) => {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      })

      setMyStream(stream)
      setRemoteStreamEmail(callerEmail)
      console.log(`incoming call from ${from} + ${offer} +${callerEmail}`)
      setRemoteSocketId(from)
      const ans = await peer.getAnswer(offer)

      socket.emit('call:accepted', { to: from, ans })
    },
    [socket],
  )

  const sendStreams = useCallback(() => {
    console.log('Sendstreams --', myStream)

    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream)
    }

    setIsVisble(false)
    setIsStreamVisible(true)
  }, [myStream])

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      console.log('handleCallAccepted ->', ans)

      peer.setLocalDescription(ans)
      // to send my stream to remoteConnection
      sendStreams()
    },
    [sendStreams],
  )

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
    console.log('wwww')
    peer.setLocalDescription(ans)
  }, [])

  // fnc.s to disconnect the call

  const handleDisconnect = () => {
    socket.emit('peer: disconnecting session', { to: remoteSocketId })
    navigate('/home')
    window.location.reload()
  }
  const handleDisconnectComplete = useCallback(() => {
    navigate('/home')
    window.location.reload()
  }, [navigate])

  // to handle negotiation needed state
  useEffect(() => {
    handleUserNames()

    peer.peer.addEventListener('negotiationneeded', handleNegoNeeded)
    return () => {
      peer.peer.removeEventListener('negotiationneeded', handleNegoNeeded)
    }
  }, [handleNegoNeeded, handleUserNames])

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
    socket.on('peer:user diconnected', handleDisconnectComplete)
    return () => {
      socket.off('user:joined', handleUserJoined)
      socket.off('incoming:call', handleIncomingCall)
      socket.off('call:acceptedFromClient2', handleCallAccepted)
      socket.off('peer:negotiation:needed', handleNegotiationIncoming)
      socket.off('peer:negotiation:done', handleNegotiationComplete)
      socket.off('peer:user diconnected', handleDisconnectComplete)
    }
  }, [
    handleCallAccepted,
    handleIncomingCall,
    handleNegotiationComplete,
    handleNegotiationIncoming,
    handleDisconnectComplete,
    socket,
  ])

  // useEffect(() => {
  //   if (remoteSocketId && myStream) {
  //     setTimeout(() => sendStreams(), 10000)
  //   }
  // }, [])

  return (
    <>
      <div className="main_meetingPage ">
        {/* <div className="oo">MeetingPage</div> */}

        {!isStreamVisible ? (
          <div className="connnect_meeting ">
            {remoteSocketId ? (
              <p className="info_meeting">
                {remoteUserEmail} joined the meeting..
              </p>
            ) : (
              <div className="loader">
                <div class="spinner"></div>
                <p className="load_meeting"> waiting for the user to connect</p>
              </div>
            )}

            {/* connect btn to establish connection btwn users  */}
            {remoteSocketId && !myStream && (
              <button className="btn_meeting" onClick={handleUserCall}>
                {' '}
                Connect{' '}
              </button>
            )}

            {/* SendStream btn used to send tracks for remote user */}
            {remoteSocketId && !(remoteUserEmail.length > 0) && isVisble && (
              <>
                <button className="btn_meeting" onClick={sendStreams}>
                  {' '}
                  Allow connection{' '}
                </button>
              </>
            )}
          </div>
        ) : (
          ''
        )}

        {/* _______ currentUser Stream__________ */}

        {isStreamVisible ? (
          <div className="main_stream">
            <div className="stream_heading ">
              <p>
                ConvoHire Meeting <TeamOutlined />
              </p>
            </div>
            <div className="stream_meeting">
              {myStream && isStreamVisible ? (
                <div className="myStream ">
                  <ReactPlayer
                    width="100%"
                    url={myStream}
                    playing
                    muted
                  ></ReactPlayer>
                  <div className="stream_email">{myStreamEmail}</div>
                </div>
              ) : (
                ''
              )}

              {remoteStream && isStreamVisible ? (
                <div className="myStream">
                  <ReactPlayer
                    url={remoteStream}
                    playing
                    muted
                    width="100%"
                  ></ReactPlayer>
                  <div className="stream_email">
                    {remoteUserEmail ? remoteUserEmail : remoteStreamEmail}
                  </div>
                </div>
              ) : (
                ''
              )}
            </div>

            <div className="footer_stream  ">
              <button className="btn_footer" onClick={handleDisconnect}>
                {' '}
                Disconnect
              </button>
            </div>
          </div>
        ) : (
          ''
        )}
      </div>
    </>
  )
}

export default MeetingPage
