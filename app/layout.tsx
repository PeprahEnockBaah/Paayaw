import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Gideon Peprah Ministries – Interpreting Destinies',
  description: 'Mobilising the Body of Christ to re-position God\'s people for the second coming of our Lord Jesus Christ.',
  icons: {
    icon: '/images/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white text-ink">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
