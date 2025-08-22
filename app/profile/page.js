'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/Header'
import { supabase } from '../../lib/supabase'

export default function Profile() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef(null)
  const [profile, setProfile] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [profileLoading, setProfileLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const fetchProfile = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
      setUsername(data.username)
      setName(data.name)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setProfileLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user, fetchProfile])

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ username, name })
        .eq('id', user.id)

      if (error) throw error
      setIsEditing(false)
      fetchProfile()
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleAvatarUpload = async (event) => {
    try {
      setUploading(true)
      const file = event.target.files[0]
      if (!file) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload image to Supabase Storage using the authenticated client
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true // Override if file exists
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new avatar URL using service role for RLS bypass
      const response = await fetch('/api/update-avatar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          avatarUrl: publicUrl,
          userId: user.id
        })
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error)

      fetchProfile() // Refresh profile data
    } catch (error) {
      console.error('Error uploading avatar:', error)
      alert('Error uploading avatar. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone!')) return

    setDeleting(true)
    try {
      // Use API route with service role to delete account
      const response = await fetch('/api/delete-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id
        })
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error)

      // Sign out and redirect to home
      await signOut()
      router.push('/?message=Account deleted successfully')
      alert('Account deleted successfully.')
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Error deleting account. Please try again.')
    } finally {
      setDeleting(false)
    }
  }

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
        <Header />
        <div className="max-w-2xl mx-auto p-4">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <Header />
      <main className="max-w-2xl mx-auto p-4">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
          <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

          {/* Avatar Section */}
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative">
              <Image
                src={profile?.avatar_url || '/images/default-avatar.png'}
                alt="Profile"
                width={48}
                height={48}
                className="w-20 h-20 rounded-full object-cover"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full text-xs hover:bg-blue-600 disabled:opacity-50"
              >
                {uploading ? '📤' : '📷'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div>
              <h2 className="text-lg font-semibold">{profile?.name}</h2>
              <p className="text-gray-600 dark:text-gray-300">@{profile?.username}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">{user.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              {isEditing ? (
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{profile?.username}</p>
              )}
            </div>
            {/* // Fizzaxx (c) 2025 | Author: Fizzaxx | Project: Fizzaxx Social  
            // DO NOT REMOVE. */}

            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 dark:border-gray-700 rounded-md p-2"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 dark:text-white">{profile?.name}</p>
              )}
            </div>

            <div className="pt-4 flex space-x-4">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Edit Profile
                </button>
              )}
              {/* // Fizzaxx (c) 2025 | Author: Fizzaxx | Project: Fizzaxx Social  
              // DO NOT REMOVE. */}

              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}