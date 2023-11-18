import React, { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header/Header'
import Sidebar from '../components/Sidebar'
import { useSocket } from '../context/SocketProvider'
import { Modal } from 'antd'
import { VideoCameraFilled, PlusSquareFilled } from '@ant-design/icons'
import DateTime from '../components/DateTime/DateTime'

const Home = () => {
  const [email, setEmail] = useState('')
  const [roomId, setRoomId] = useState('')
  const [userRoomId, setUserRoomId] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isModalData, setIsModalData] = useState(false)
  const [time, setTime] = useState(new Date())

  console.log(time.getDay())

  const socket = useSocket()
  const navigate = useNavigate()

  // Handling modal func.
  const showModal = (val) => {
    setIsModalOpen(true)

    if (val === 'start a meeting') {
      generateRoomId()
      setIsModalData(true)
    } else {
      setIsModalData(false)
    }
  }

  const handleOk = () => {
    if (isModalData && email.length > 0) {
      setIsModalOpen(false)
      handleJoin()
    }

    if (!isModalData && roomId.length > 0 && email.length > 0) {
      setIsModalOpen(false)
      handleJoin()
    }
  }

  const handleCancel = () => {
    setRoomId('')
    setEmail('')
    setIsModalOpen(false)
  }

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
      navigate(`/room/${data.roomId}`, { state: email })
    },
    [email, navigate],
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
      <div className="main-home ">
        <Sidebar />
        <div className="home_sec ">
          <Header />
          <div className="main_grid  ">
            <div className="main_content_left item ">
              <div className="btns_hm_fnc">
                <div
                  className="btn_cont btn_bg "
                  onClick={() => showModal('start a meeting')}
                >
                  {' '}
                  <VideoCameraFilled className="btn_icon icon_bg" />
                  <div>
                    <p className="info1"> New Meeting </p>
                    <p className="info2 info_clr">set up new meeting</p>
                  </div>
                </div>
                <div
                  className="btn_cont btn_bg2"
                  onClick={() => showModal('join a meeting')}
                >
                  {' '}
                  <PlusSquareFilled className="btn_icon icon_bg2" />
                  <div>
                    <p className="info1"> Join Meeting </p>
                    <p className="info2 info_clr2"> via meeting code</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="main_content_right item ">
              <DateTime />
              {/* <div className="main_task"></div> */}
            </div>
          </div>
          {/* Modal content  */}

          <Modal
            title="Join the Meeting"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            {isModalData ? (
              <div>
                <span>
                  Enter the Meeting as<span className="req"> * </span>
                </span>
                <input
                  type="email"
                  placeholder="Enter your username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p>
                  Share this meeting code to other user <b>{roomId}</b>
                </p>
              </div>
            ) : (
              <div>
                <span>
                  Enter the Meeting as<span className="req"> * </span>
                </span>
                <input
                  type="email"
                  placeholder="Enter your username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <br></br>
                <br></br>
                <span>
                  Enter the Meeting ID <span className="req"> * </span>
                </span>
                <input
                  type="text"
                  placeholder="Enter your meeting id"
                  onChange={test}
                />
              </div>
            )}
          </Modal>
        </div>
      </div>
    </>
  )
}

export default Home
