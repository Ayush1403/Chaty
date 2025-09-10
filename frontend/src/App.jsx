import { Button } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { Box } from '@chakra-ui/react'
import { Navigate, Route , Routes } from 'react-router-dom'
import { Navbar } from './component'
import {Toaster} from 'react-hot-toast'
import { LoaderPinwheel} from 'lucide-react'

import {Home,
  Login, 
  Profile, 
  Settings, 
  Signup 
} from './pages'
import { axiosInstance } from './lib/axios'
import { authState } from './store/userAuth'
import { themeState } from './store/themeState'
const App = () => {
 const {theme } = themeState()

const {useAuth,checkAuth,isCheckingAUth} = authState();

useEffect(()=>{
checkAuth();


},[checkAuth])
 

  if(isCheckingAUth && !useAuth){
    return(
      <div className='h-dvh flex justify-center items-center w-full bg-slate-800'>
        <LoaderPinwheel  className='animate-spin size-10 text-white'/>
      </div>
    )
  }

  return (
    <main data-theme={theme} className='relative flex justify-center items-center flex-col overflow-hidden'>
      <Navbar />
      <Routes>
        <Route path='/' element={useAuth ? <Home /> : <Navigate to="/login" />} />
        <Route path='login' element={!useAuth ? <Login /> : <Navigate to="/" />} />
        <Route path='signup' element={!useAuth ? <Signup /> : <Navigate to="/login" />} />
        <Route path='settings' element={useAuth ? <Settings /> : <Navigate to="/login" />} />
        <Route path='profile' element={useAuth ? <Profile /> : <Navigate to="/login" />} />
      </Routes>

      <Toaster />
    </main>
  )
}

export default App