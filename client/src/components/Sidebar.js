import React, { useState } from 'react'
import './sidebar/Sidebar.css'
import ICON from '../assets/iconVideo.png'
import { NavLink } from 'react-router-dom'
import { HomeFilled, EditFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { Modal } from 'antd'

const Sidebar = () => {
  const navigate = useNavigate()

  const handleClickNavigate = () => {
    navigate('/')
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const showModal = (e) => {
    e.preventDefault()
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
      <div className="main-sidebar ">
        <div className="icon " onClick={handleClickNavigate}>
          <img src={ICON} alt="" />
        </div>
        <div className="elments ">
          <div className="elm">
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? 'active ' : 'inactive')}
            >
              <HomeFilled style={{ fontSize: '23px' }} />
            </NavLink>
          </div>
          <div className="elm ">
            <NavLink to="/abc" onClick={showModal} className="inactive">
              <EditFilled style={{ fontSize: '23px' }} />
            </NavLink>
          </div>
        </div>
        {showModal ? (
          <Modal
            title="Info"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <p>This feature is currently unavailable.</p>
          </Modal>
        ) : (
          ''
        )}
      </div>
    </>
  )
}

export default Sidebar
