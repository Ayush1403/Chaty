import React from 'react'
import { authState } from '../store/userAuth'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import {MessageSquare} from 'lucide-react'

const Navbar = () => {
  const { logout, useAuth } = authState();
  const navigate = useNavigate();
   const handleLogout = () => {
    logout();         
  };

  return (
    <nav className=' h-fit w-full p-4 border-b-2 border-slate-500 text-white flex items-center justify-around'>
      <div className='font-bold gap-2 flex items-center text-white'>
        <div className='bg-zinc-600/60 p-2 rounded-full'>
          <MessageSquare />
        </div>
        <h1>Chaty</h1>
      </div>

      {useAuth == null ? (
        <div className="flex gap-4">
          <Link to={"/login"} className="btn">Login</Link>
          <Link to={"/signup"} className="btn">SignUp</Link>
          <Link to={"/settings"} className="btn p-1">Setting</Link>
        </div>
      ) : (
        <div className="flex gap-4 items-center">
          <Link to={"/profile"}  className='uppercase'>{useAuth.profilepic ? (
  <img src={useAuth.profilepic} alt="Profile" className="w-8 h-8 rounded-full" />
) : (
  <img src="/image/logo.svg" alt="Default" className="w-8 h-8 rounded-full" />
)}
</Link>
          <button onClick={handleLogout} className="btn">Logout</button>
          <Link to={"/settings"} className="btn p-1">Setting</Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar
