'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext' // Use Supabase auth context
import { supabase } from '../lib/supabase'

export default function TweetForm() {
  const { user } = useAuth() // Get user from Supabase auth context
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim() || isLoading || !user) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('tweets')
        .insert([{ content, user_id: user.id }])

      if (error) throw error
      setContent('')
    } catch (error) {
      console.error('Error creating tweet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null // Don't show tweet form if not logged in

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's happening?"
        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
        rows={3}
        maxLength={280}
      />
      <div className="flex justify-between items-center mt-2">
        <span className={`text-sm ${content.length > 260 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
          {content.length}/280
        </span>
        <button
          type="submit"
          disabled={!content.trim() || isLoading || content.length > 280}
          className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-600 transition-colors"
        >
          {isLoading ? 'Posting...' : 'Tweet'}
        </button>
      </div>
    </form>
  )
}