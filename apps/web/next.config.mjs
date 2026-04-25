/** @type {import('next').NextConfig} */
import pwa from "next-pwa";

const withPWA = pwa({
  dest: "public",
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
        destination: '/auth',
        permanent: false
      },
    ]
  },
  turbopack: {}
}

export default withPWA(nextConfig);
