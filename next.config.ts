import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'transfermarkt.com',
      },
      {
        protocol: 'https',
        hostname: '*.transfermarkt.com',
      },
    ],
  },
};

export default nextConfig;
