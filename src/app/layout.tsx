import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthCheck from '@/components/AuthCheck'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sock Production Management',
  description: 'Sock production management and monitoring system',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthCheck>{children}</AuthCheck>
      </body>
    </html>
  )
}
