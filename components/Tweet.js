'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Tweet({ tweet, onUpdate, onDelete }) {
  const { user } = useAuth()
  const [likesCount, setLikesCount] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(tweet.content)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch like data
  useEffect(() => {
    const fetchLikeData = async () => {
      if (!tweet.id) return

      try {
        const { count } = await supabase
          .from('likes')
          .select('*', { count: 'exact' })
          .eq('tweet_id', tweet.id)

        setLikesCount(count || 0)

        if (user) {
          const { data, error: likeError } = await supabase
            .from('likes')
            .select('id')
            .eq('tweet_id', tweet.id)
            .eq('user_id', user.id)
            .maybeSingle()

          setIsLiked(!!data)
        }
      } catch (error) {
        console.error('Error fetching like data:', error)
      }
    }

    fetchLikeData()
  }, [tweet.id, user])

  const handleLike = async () => {
    if (!user || loading) return
    setLoading(true)

    try {
      if (isLiked) {
        await supabase.from('likes').delete().eq('tweet_id', tweet.id).eq('user_id', user.id)
        setIsLiked(false)
        setLikesCount(prev => Math.max(0, prev - 1))
      } else {
        await supabase.from('likes').insert([{ tweet_id: tweet.id, user_id: user.id }])
        setIsLiked(true)
        setLikesCount(prev => prev + 1)
      }
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async () => {
    if (!editContent.trim() || editContent === tweet.content) {
      setIsEditing(false)
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('tweets')
        .update({ content: editContent })
        .eq('id', tweet.id)

      if (error) throw error

      setIsEditing(false)
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error('Error editing tweet:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this tweet?')) return;

    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('tweets')
        .delete()
        .eq('id', tweet.id);

      if (error) {
        console.error('Supabase delete error:', error); // LOG ANY ERROR
        throw error; // Make sure to re-throw to enter the catch block
      }

      // Only call onDelete if the database deletion was successful
      if (onDelete) onDelete(tweet.id);
    } catch (error) {
      console.error('Error deleting tweet:', error);
      alert('Failed to delete tweet. Please check the console for details.'); // Inform the user
    } finally {
      setIsDeleting(false);
    }
  };

  const isOwner = user && user.id === tweet.user_id
  const avatarUrl = tweet.profiles?.avatar_url && !imageError
    ? tweet.profiles.avatar_url
    : '/images/default-avatar.png'

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <Image
            src={avatarUrl}
            alt={tweet.profiles?.name || 'User'}
            width={48}
            height={48}
            className="rounded-full"
            onError={() => setImageError(true)}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                {tweet.profiles?.name}
              </h4>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                @{tweet.profiles?.username}
              </span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                · {new Date(tweet.created_at).toLocaleDateString()}
              </span>
            </div>

            {isOwner && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="text-blue-500 hover:text-blue-700 text-sm"
                  disabled={loading}
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-500 hover:text-red-700 text-sm"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="mt-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none break-words whitespace-pre-wrap"
                rows={3}
                maxLength={280}
              />
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={handleEdit}
                  disabled={loading || !editContent.trim()}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm disabled:opacity-50"
                >{/* // Fizzaxx (c) 2025 | Author: Fizzaxx | Project: Fizzaxx Social  
                // DO NOT REMOVE. */}
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-200 mt-1 break-words whitespace-pre-wrap">{tweet.content}</p>
          )}

          <div className="mt-3 flex items-center">
            <button
              onClick={handleLike}
              disabled={loading || !user}
              className={`flex items-center space-x-1 ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'
                } disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}