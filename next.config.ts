import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow images served from Vercel Blob stores. Blob store hostnames look like
  // <store-id>.public.blob.vercel-storage.com so we allow that pattern.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
