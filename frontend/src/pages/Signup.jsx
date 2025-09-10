import React, { useState } from 'react'
import { authState } from '../store/userAuth'
import { Loader2, Lock, Mail, MessageSquare, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { Navigate } from 'react-router-dom'

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const { signup, isSigninUp, useAuth } = authState()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const validateForm = () => {
    if (!formData.username.trim()) return toast.error('Username required')
    if (!formData.email.trim()) return toast.error('Email required')
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error('Invalid email format')
    if (!formData.password) return toast.error('Password required')
    if (formData.password.length < 6)
      return toast.error('Password must be at least 6 characters')
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const success = validateForm()
    if (success === true) signup(formData)
  }

  if (useAuth) {
    return <Navigate to="/" />
  }

  return (
    <main className="relative w-full min-h-screen grid md:grid-cols-2 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="flex flex-col justify-center items-center px-6 py-10">
        <div className="bg-white/10 p-5 rounded-full mb-6">
          <MessageSquare className="text-white size-8" />
        </div>
        <h1 className="text-3xl font-bold mb-8">Create Account</h1>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-5 bg-white/5 p-6 rounded-2xl shadow-lg"
        >
          <div className="flex items-center border border-gray-400/40 bg-white/10 p-3 rounded-lg gap-2">
            <User className="text-gray-300" />
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder:text-gray-400"
              placeholder="John Doe"
            />
          </div>
          <div className="flex items-center border border-gray-400/40 bg-white/10 p-3 rounded-lg gap-2">
            <Mail className="text-gray-300" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder:text-gray-400"
              placeholder="JohnDoe@gmail.com"
            />
          </div>
          <div className="flex items-center border border-gray-400/40 bg-white/10 p-3 rounded-lg gap-2">
            <Lock className="text-gray-300" />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-transparent outline-none placeholder:text-gray-400"
              placeholder="*****"
            />
          </div>
          <button
            className="w-full py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition text-white font-medium flex justify-center items-center gap-2 disabled:opacity-50"
            disabled={isSigninUp}
          >
            {isSigninUp ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Loading...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
      <div className="hidden md:flex justify-center items-center bg-cover bg-center" style={{ backgroundImage: 'url(/auth-bg.jpg)' }} />
    </main>
  )
}

export default Signup
