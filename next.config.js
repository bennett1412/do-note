/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('next-pwa')({
  dest: 'public'
})

const nextConfig = {
  reactStrictMode: true,
  basePath: '/notes',
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
  },
  turbopack: {},
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname)
    };
    return config;
  }
}

module.exports = withPWA(nextConfig);
