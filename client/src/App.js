import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Home from './pages/Home'
import MeetingPage from './screens/MeetingPage'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/room/:roomId" element={<MeetingPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
