import './globals.css'
import type { Metadata } from 'next'
import { Orbitron } from 'next/font/google'
import DeviceRedirect from '../components/DeviceRedirect'
import GoogleAnalytics from '../components/GoogleAnalytics'
import { Providers } from '@/components/Providers'

const orbitron = Orbitron({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bit Beats - Bitcoin Will Beat Everything',
  description: 'Watch Bitcoin beat other assets in real-time with market tracking and visualization',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={orbitron.className}>
        <GoogleAnalytics />
        <Providers>
          <DeviceRedirect>
            {children}
          </DeviceRedirect>
        </Providers>
      </body>
    </html>
  )
}
