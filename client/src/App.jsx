import { useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router';
import Login from './components/Login'
import Register from './components/Register';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css'

function App() {

  const [isLoading, setIsLoading] = useState(true);

  return (
    // <>
    //   <Login />
    //   <Register />
    //   <Home />
    // </>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route
        path='/'
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
        />

      </Routes>
    </BrowserRouter>
  )
}

export default App
