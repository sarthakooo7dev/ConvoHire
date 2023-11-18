import React from 'react'
import AVATAR from '../../assets/avatar.png'
import './Header.css'

const Header = () => {
  return (
    <div className="main_header bg_r">
      <div className="header_text">Home</div>
      <div className="header_img">
        <img src={AVATAR} alt="" />
      </div>
    </div>
  )
}

export default Header
