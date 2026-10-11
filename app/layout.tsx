import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getLeaders } from '@/lib/leaders'

export const metadata: Metadata = {
  title: 'Gideon Peprah Ministries – Interpreting Destinies',
  description: 'Mobilising the Body of Christ to re-position God\'s people for the second coming of our Lord Jesus Christ.',
  icons: {
    icon: '/images/favicon.png?v=2',
    apple: '/images/apple-touch-icon.png?v=2',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // The About Us menu shows Leadership only once the admin has added a leader.
  const showLeadership = (await getLeaders()).length > 0

  return (
    <html lang="en">
      <body className="bg-white text-ink">
        <Navbar showLeadership={showLeadership} />
        <main>{children}</main>
        <Footer showLeadership={showLeadership} />
      </body>
    </html>
  )
}
