/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // For static sites images unoptimized
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
