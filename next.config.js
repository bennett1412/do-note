/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('next-pwa')({
  dest: 'public'
})

const nextConfig = {
  reactStrictMode: true,
  publicRuntimeConfig: {
    basePath: '/notes',
  },
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
        destination: '/auth',
        permanent: false
      },
    ]
  }
}

module.exports = withPWA(nextConfig);
