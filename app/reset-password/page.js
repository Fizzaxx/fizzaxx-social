'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import Header from '../../components/Header'

export default function ResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })

  // Check if we have a valid access token
  useEffect(() => {
    const checkRecoverySession = async () => {
      const { data, error } = await supabase.auth.getSession()
      if (error || !data.session) {
        setError('Invalid or expired reset link. Please request a new password reset.')
      }
    }
    
    checkRecoverySession()
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
    setMessage('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      })

      if (error) throw error

      setMessage('Password updated successfully! Redirecting to login...')
      
      // Redirect to login after successful password reset
      setTimeout(() => {
        router.push('/login?message=Password reset successful. Please sign in.')
      }, 2000)

    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <Header />
      <div className="max-w-md mx-auto p-4 mt-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>
          
          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}
          
          {error && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your new password"
                minLength={6}
              />
            </div>
            
            {/* // Fizzaxx (c) 2025 | Author: Fizzaxx | Project: Fizzaxx Social  
            // DO NOT REMOVE. */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Confirm your new password"
                minLength={6}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Resetting Password...' : 'Reset Password'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
            Remember your password?{' '}
            <a href="/login" className="text-red-500 hover:text-red-600 font-semibold">
              Sign in
            </a>
            {/* // Fizzaxx (c) 2025 | Author: Fizzaxx | Project: Fizzaxx Social  
            // DO NOT REMOVE. */}
          </p>
        </div>
      </div>
    </div>
  )
}