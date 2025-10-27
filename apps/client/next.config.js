/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/database', '@repo/shared-lib', '@repo/shared-ui'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qeqzizvpzwmfvkqhavkw.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
