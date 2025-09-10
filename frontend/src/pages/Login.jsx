import React, { useState } from 'react'
import { authState } from '../store/userAuth'
import { Eye, EyeOff, Mail, Lock, MessageSquare, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate()
  const { login, isLoggingIn, useAuth } = authState()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (!formData.email.trim()) return toast.error('Email required')
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error('Invalid email format')
    if (!formData.password.trim()) return toast.error('Password required')
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const success = validateForm()
    if (success === true) {
      login(formData)
      toast.success('Login successful')
      navigate('/')
    }
  }

  return (
    <main className="relative w-full min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="flex flex-col justify-center items-center px-6 py-10 w-full">
        <div className="bg-white/10 flex items-center justify-center w-20 h-20 rounded-full mb-6">
          <MessageSquare className="size-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold uppercase mb-8">Login Here</h1>

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-6 bg-white/5 p-6 rounded-2xl shadow-lg"
        >
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <div className="flex items-center gap-2 border border-gray-400/40 bg-white/10 p-3 rounded-lg">
              <Mail className="text-gray-300" />
              <input
                type="email"
                name="email"
                onChange={handleChange}
                value={formData.email}
                placeholder="xyz@gmail.com"
                className="w-full bg-transparent outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <div className="flex items-center gap-2 border border-gray-400/40 bg-white/10 p-3 rounded-lg">
              <Lock className="text-gray-300" />
              <input
                type={passwordVisible ? 'text' : 'password'}
                onChange={handleChange}
                name="password"
                value={formData.password}
                placeholder="******"
                className="w-full bg-transparent outline-none placeholder:text-gray-400"
              />
              <button
                type="button"
                onClick={() => setPasswordVisible(!passwordVisible)}
                className="text-gray-300 hover:text-white"
              >
                {passwordVisible ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium flex justify-center items-center gap-2 disabled:opacity-50"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Signup
          </Link>
        </p>
      </div>
      <div
        className="hidden md:flex justify-center items-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/auth-bg.jpg)' }}
      />
    </main>
  )
}

export default Login
