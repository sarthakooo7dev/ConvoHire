import React from 'react'
import landingPageImg from '../assets/landingPage1remove.png'
import { useNavigate } from 'react-router-dom'
import { ArrowRightOutlined, CaretRightFilled } from '@ant-design/icons'
const LandingPage = () => {
  const navigate = useNavigate()

  const handleDemoLogin = () => {
    navigate('/home')
  }

  return (
    <>
      <div className="landing-page-container ">
        <div className="header flex ">
          <div className=" headerMain flex">
            <div className="header-icon">
              <span>Convo</span>Hire
            </div>
            <div className="header-tabs">About Us</div>
            <div className="header-tabs">Services</div>
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
              <div className="">
                <button
                  onClick={handleDemoLogin}
                  className="btn-basic btn-login"
                >
                  Demo Login <ArrowRightOutlined />
                </button>
                <button className="btn-basic btn-abt">
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
      </div>
    </>
  )
}

export default LandingPage
