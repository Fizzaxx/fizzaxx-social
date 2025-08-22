'use client'

import Link from 'next/link'
import Image from 'next/image' // Import the Image component
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { user, signOut, loading } = useAuth()
  setTimeout(() => {  
  console.log("%c FIZZAXX GITHUB ", "background: black; color: red; font-size: 20px;");  
  console.log("%c Code belongs to Fizzaxx. ", "color: red;");  
  }, 3000);
  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (loading) {
    return (
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          {/* Loading state with logo */}
          <div className="flex items-center space-x-2">
            <div className="relative w-6 h-6">
              <Image
                src="/logo.png" // Path to your logo
                alt="Fizzaxx Social Logo"
                fill
                className="rounded-full"
              />
            </div>
            <div className="text-red-500 font-bold text-xl">Fizzaxx Social</div>
          </div>
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={user ? "/home" : "/"} className="flex items-center space-x-2">
          <div className="relative w-9 h-9">
            <Image
              src="/logo.png"
              alt="Fizzaxx Social Logo"
              fill
              className="rounded-full"
            />
          </div>
          <span className="text-red-500 font-bold text-xl">
            Fizzaxx Social
          </span>
        </Link>

        <nav className="flex items-center space-x-4">
          {user ? (
            <>
              <Link href="/home" className="text-gray-700 hover:text-blue-500">
                Home
              </Link>
              <Link href="/profile" className="text-gray-700 hover:text-blue-500">
                Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-600 transition-colors"
            >{/* // Fizzaxx (c) 2025 | Author: Fizzaxx | Project: Fizzaxx Social  
                // DO NOT REMOVE. */}
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}