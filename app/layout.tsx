import type { Metadata } from 'next'
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'STS Card Illustration Gen',
  description: 'STS Card Illustration Gen',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <SpeedInsights />
        </body>
    </html>
  )
}
