import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Bật standalone output để tạo Docker image nhỏ gọn
  output: 'standalone',
};

export default nextConfig;
