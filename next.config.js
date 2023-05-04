/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public'
})

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'lh3.googleusercontent.com'
    }]
  },
  redirects: () => {
    return [
      {
        source: '/',
        destination: '/notes',
        permanent: false
      },
    ]
  }
}

module.exports = withPWA(nextConfig);
