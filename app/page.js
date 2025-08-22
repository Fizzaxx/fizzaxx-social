import Link from 'next/link'
import Header from '../components/Header'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 dark:bg-gradient-to-br dark:from-gray-900 dark:to-gray-800">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-8 py-12">
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Welcome to Fizzaxx Social
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-md">
              A modern and simple social app like Twitter built with Next.js and Supabase.
              Share your thoughts, connect with others, and stay updated.
            </p>
            
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">Join today to start tweeting!</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/login"
                  className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-red-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  href="/register"
                  className="bg-white text-red-500 border border-red-500 px-6 py-3 rounded-lg font-semibold text-center hover:bg-red-50 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl flex-1">
                    <p className="text-sm text-gray-800 dark:text-gray-200">Just set up my account on Fizzaxx Social! So excited to share my first tweet! 🚀</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex-shrink-0"></div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl flex-1">
                    <p className="text-sm text-gray-800 dark:text-gray-200">The real-time updates on this app are impressive! Great job with the implementation.</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">5 hours ago</p>
                  </div>
                </div>
                {/* // Fizzaxx (c) 2025 | Author: Fizzaxx | Project: Fizzaxx Social  
                // DO NOT REMOVE. */}
                
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl flex-1">
                    <p className="text-sm text-gray-800 dark:text-gray-200">Loving the clean UI and smooth authentication flow. This is exactly what I need for my project!</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">1 day ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Secure Authentication</h3>
              <p className="text-gray-600 dark:text-gray-300">Supabase Auth integration with email/password and Google OAuth support.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Real-time Updates</h3>
              <p className="text-gray-600 dark:text-gray-300">Supabase real-time subscriptions for instant tweet updates without refreshing.</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Responsive Design</h3>
              <p className="text-gray-600 dark:text-gray-300">Beautiful, mobile-first design with Tailwind CSS that works on all devices.</p>
            </div>
          </div>
        </section>
        {/* // Fizzaxx (c) 2025 | Author: Fizzaxx | Project: Fizzaxx Social  
        // DO NOT REMOVE. */}
        
        {/* Tech Stack Section */}
        <section className="py-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Built With Modern Technologies</h2>
          
          <div className="flex flex-wrap justify-center gap-6">
            <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <div className="w-16 h-16 mb-2 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-red-600">N</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Next.js</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <div className="w-16 h-16 mb-2 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">S</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Supabase</span>
            </div>
            
            <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <div className="w-16 h-16 mb-2 bg-cyan-50 dark:bg-cyan-900/20 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-cyan-600">T</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tailwind</span>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              &copy; {new Date().getFullYear()} Fizzaxx Social. Built for demonstration purposes.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-red-500 text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-500 dark:text-gray-400 hover:text-red-500 text-sm">Terms of Service</a>
              <a href="https://github.com/fizzaxx/fizzaxx-social" className="text-gray-500 dark:text-gray-400 hover:text-red-500 text-sm">GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}