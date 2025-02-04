import React from 'react'
import Signup from './pages/Signup'
import Home from './pages/Home'
import Login from './pages/Login'
import Navbar from './assets/components/Navbar'
import {BrowserRouter, Routes, Route} from 'react-router-dom'

const App = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route path ="/" element={<Home/>}> </Route>
      <Route path ="/register" element={<Signup/>}> </Route>
      <Route path ="/login" element={<Login/>}> </Route>
    </Routes>
    </BrowserRouter>
   
  )
}

export default App
