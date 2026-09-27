/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Slider images uploaded through /admin are served from Supabase Storage.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  // Tell search engines never to index the admin area (backs up the page's robots metadata).
  async headers() {
    return [{ source: '/admin/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]
  },
  experimental: {
    // Allow event photo uploads (default is 1mb) through Server Actions.
    serverActions: {
      bodySizeLimit: '8mb',
    },
  },
}

module.exports = nextConfig
