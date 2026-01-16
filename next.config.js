/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Fixes potential image build errors in App Hosting
  },
  // Ensure the App Router is utilized properly
  experimental: {
    appDir: true, 
  },
};

module.exports = nextConfig;