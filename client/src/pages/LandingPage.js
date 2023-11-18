import React, { useState } from 'react'
import landingPageImg from '../assets/landingPage1remove.png'
import { useNavigate } from 'react-router-dom'
import { ArrowRightOutlined, CaretRightFilled } from '@ant-design/icons'
import { Modal } from 'antd'

const LandingPage = () => {
  const navigate = useNavigate()

  const handleDemoLogin = () => {
    navigate('/home')
  }
  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = (e) => {
    setIsModalOpen(true)
  }
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div className="landing-page-container ">
        <div className="header flex ">
          <div className=" headerMain flex">
            <div className="header-icon">
              <span>Convo</span>Hire
            </div>
            {/* <div className="header-tabs">About Us</div>
            <div className="header-tabs">Services</div> */}
          </div>
          <div>
            <button onClick={handleDemoLogin} className="btn-basic btn-login">
              Login
            </button>
          </div>
        </div>

        <div className="   grid">
          <div className="container-text gridOrder  ">
            <h2>
              <span className="span-headline">Great Meetings</span> Are Just The
              Beginning
            </h2>
            <p>Discover.Interview.Hire </p>
            <div className="btns ">
              <p>Make Your Meet</p>
              <div className="btn_container ">
                <button
                  onClick={handleDemoLogin}
                  className="btn-basic btn-login"
                >
                  Demo Login <ArrowRightOutlined />
                </button>
                <button className="btn-basic btn-abt" onClick={showModal}>
                  <CaretRightFilled /> How it Works ?
                </button>
              </div>
            </div>
          </div>
          <div className=" gridOrder">
            <div className="container-img ">
              <img src={landingPageImg} alt="" />
            </div>
          </div>
        </div>
        {showModal ? (
          <Modal
            title="How it works ?"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <p>
              <b> Initiating a Meeting -</b> Begin by selecting the "New
              Meeting" option within the app. You will be prompted to enter your
              username. Once entered, you are instantly directed to the meeting
              space.
            </p>
            <p>
              <b> Copy the Meeting Code -</b> Before entering the meeting, a
              unique meeting code is generated. It is crucial to copy this code.
              This code serves as the access key for other users to join the
              same meeting.
            </p>
            <p>
              <b> Joining a Meeting -</b> To join a meeting initiated by another
              user, simply enter the provided meeting code along with the
              required details. Once entered, you are seamlessly connected to
              the ongoing meeting.
            </p>
          </Modal>
        ) : (
          ''
        )}
      </div>
    </>
  )
}

export default LandingPage
