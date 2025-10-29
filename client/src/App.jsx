import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login'
import Register from './components/Register';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import Profile from './components/Profile';
import Messages from './components/Messages';
import { useQuery } from '@tanstack/react-query';
import { UserContext } from './context/UserContext';
import Loading from './components/Loading';
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

  if (isLoading) return <Loading />

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
              <Layout />
            </ProtectedRoute>
          }
          >
            <Route index element={<Home />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/profile/:profileId' element={<Profile />} />
            <Route path='/messages' element={<Messages />} />
            <Route path='/messages/:chatId' element={<Messages />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default App
