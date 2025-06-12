import { useState } from 'react'
import './App.css'
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Register from "./pages/RegisterUser"
import Login from "./pages/Login"
import AboutMe from './pages/AboutMe'
import Admin from './pages/Admin'
import Spinning from './pages/Spinning'
import { Routes, Route } from "react-router-dom"

function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/aboutme" element={<AboutMe />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/spinning" element={<Spinning />} />
      </Routes>

    </>
  )
}

export default App
