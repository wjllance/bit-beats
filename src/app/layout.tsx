import './globals.css'
import type { Metadata } from 'next'
import { Orbitron } from 'next/font/google'
import DeviceRedirect from '../components/DeviceRedirect'

const orbitron = Orbitron({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BTC Beats - Bitcoin Price Tracker',
  description: 'Watch Bitcoin beat other assets in real-time with market tracking and visualization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={orbitron.className}>
        <DeviceRedirect />
        {children}
      </body>
    </html>
  )
}
