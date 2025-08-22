'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/Header'
import TweetForm from '../../components/TweetForm'
import Tweet from '../../components/Tweet'
import { supabase } from '../../lib/supabase'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [tweets, setTweets] = useState([])
  const [tweetsLoading, setTweetsLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (user) {
      fetchTweets()
      subscribeToTweets()
    }
  }, [user, loading, router])

  const fetchTweets = async () => {
    try {
      const { data: tweetsData, error: tweetsError } = await supabase
        .from('tweets')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles (
            username,
            name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false })

      if (tweetsError) throw tweetsError
      setTweets(tweetsData || [])
    } catch (error) {
      console.error('Error fetching tweets:', error)
    } finally {
      setTweetsLoading(false)
    }
  }

  const subscribeToTweets = () => {
    console.log('Setting up real-time subscription for tweets...')

    const subscription = supabase
      .channel('tweets-feed')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'tweets'
        },
        async (payload) => {
          console.log('New tweet detected!', payload.new)

          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, name, avatar_url')
              .eq('id', payload.new.user_id)
              .single()

            const newTweet = {
              ...payload.new,
              profiles: profile || { username: 'unknown', name: 'Unknown User', avatar_url: null }
            }

            setTweets(currentTweets => [newTweet, ...currentTweets])
          } catch (error) {
            console.error('Error fetching profile for new tweet:', error)
          }
        }
      )
      .on('postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'tweets'
        },
        (payload) => {
          console.log('Tweet deleted:', payload.old.id)
          // Remove the deleted tweet from the local state
          setTweets(currentTweets =>
            currentTweets.filter(tweet => tweet.id !== payload.old.id)
          )
        }
      )
      .subscribe()

    return () => {
      console.log('Unsubscribing from real-time updates')
      subscription.unsubscribe()
    }
  }

  if (loading || tweetsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <Header />
        <div className="max-w-2xl mx-auto p-4">Loading tweets...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }
{/* // Fizzaxx (c) 2025 | Author: Fizzaxx | Project: Fizzaxx Social  
// DO NOT REMOVE. */}
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <Header />
      <main className="max-w-2xl mx-auto p-4">
        <TweetForm />
        <div className="mt-6 space-y-4">
          {tweets.map((tweet) => (
            <Tweet
              key={tweet.id}
              tweet={tweet}
              onUpdate={fetchTweets}
              onDelete={(tweetId) => {
                setTweets(current => current.filter(t => t.id !== tweetId))
              }}
            />
          ))}
        </div>

        {tweets.length === 0 && !tweetsLoading && (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8">
            <p>No tweets yet. Be the first to tweet!</p>
          </div>
        )}
      </main>
    </div>
  )
}