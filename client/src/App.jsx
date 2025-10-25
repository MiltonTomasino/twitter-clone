import { BrowserRouter, Route, Routes, Navigate } from 'react-router';
import Login from './components/Login'
import Register from './components/Register';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { useQuery } from '@tanstack/react-query';
import { UserContext } from './context/UserContext';

import './App.css'

function App() {

  const { isLoading, error, data} = useQuery({
      queryKey: ['check-auth'],
      queryFn: async () => {    
          const res = await fetch("/api/user/check-auth", {
              method: "GET",
              credentials: "include"
          })

          if (!res.ok) return { loggedIn: false }

          return res.json();
      },
      staleTime: Infinity
  })

  if (error) return <h1>Error fetching auth</h1>

  if (isLoading) return <h1>Loading...</h1>

  return (
    <UserContext.Provider value={data}>
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
    </UserContext.Provider>
  )
}

export default App
