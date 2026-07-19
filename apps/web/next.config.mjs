/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  redirects: () => {
    return [
      {
        source: "/",
        destination: "/auth",
        permanent: false,
      },
    ];
  },
  turbopack: {},
};

export default nextConfig;
