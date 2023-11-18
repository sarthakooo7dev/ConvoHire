import React, { useState, useEffect } from 'react'
import CLOCKBG from '../../assets/Bg.png'
import '../../index.css'

const DateTime = () => {
  const [time, setTime] = useState(' ')
  const [date, setDate] = useState(' ')

  const getCurrentDateAndTime = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]

    const now = new Date()
    const dayOfWeek = days[now.getDay()]
    const dayOfMonth = now.getDate()
    const month = months[now.getMonth()]
    const year = now.getFullYear()

    const ordinalSuffix = (day) => {
      if (day >= 11 && day <= 13) {
        return 'th'
      }
      switch (day % 10) {
        case 1:
          return 'st'
        case 2:
          return 'nd'
        case 3:
          return 'rd'
        default:
          return 'th'
      }
    }

    const formattedDate = `${dayOfWeek}, ${dayOfMonth}${ordinalSuffix(
      dayOfMonth,
    )} ${month} ${year}`
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = hours % 12 || 12 // Convert 0 to 12 for AM/PM format
    const formattedTime = `${formattedHours}:${minutes
      .toString()
      .padStart(2, '0')} ${ampm}`

    setTime(formattedTime)
    setDate(formattedDate)

    console.log('interval fired ')
    //return { date: formattedDate, time: formattedTime }
  }

  useEffect(() => {
    const intervalId = setInterval(() => getCurrentDateAndTime(), 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [])

  return (
    <div>
      {' '}
      <div
        className="home_timer"
        style={{
          backgroundImage: `url(${CLOCKBG})`,
        }}
      >
        <h1>{time}</h1>
        <p>{date}</p>
      </div>
    </div>
  )
}

export default DateTime
