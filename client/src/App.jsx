import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './pages/dashboard';
import StudentProfile from './pages/StudentProfile';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Dashboard/>}/>
        <Route path='/student/:id' element={<StudentProfile/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
