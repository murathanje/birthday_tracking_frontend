'use client'

import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from './contexts/AuthContext'
import { BirthdayProvider } from './contexts/BirthdayContext'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <BirthdayProvider>
            {children}
          </BirthdayProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
