import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hemut Q&A Dashboard',
  description: 'Real-time Q&A platform with live updates',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
