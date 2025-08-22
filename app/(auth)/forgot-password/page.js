'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import { supabase } from '../../../lib/supabase'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setMessage('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      setMessage('Check your email for the password reset link. It may take a few minutes to arrive.')
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
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

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-red-500 focus:border-red-500"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
          {/* // Fizzaxx (c) 2025 | Author: Fizzaxx | Project: Fizzaxx Social  
          // DO NOT REMOVE. */}
          <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
            Remember your password?{' '}
            <Link href="/login" className="text-red-500 hover:text-red-600 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}