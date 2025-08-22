import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '../contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Fizzaxx Social',
  description: 'A simple social app like Twitter built with Next.js, Tailwind and Supabase',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-darkreader-mode="dynamic" data-darkreader-scheme="dark">
      <body className={`${inter.className} dark:bg-gray-900 dark:text-white`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}