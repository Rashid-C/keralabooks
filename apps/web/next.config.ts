import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ['@keralabooks/domain', '@keralabooks/db-types'],
};

export default nextConfig;