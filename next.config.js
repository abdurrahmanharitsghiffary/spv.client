/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  images: {
    unoptimized: true,
  },
  // productionBrowserSourceMaps: false,
  env: {
    GIPHY_API_KEY: process.env.GIPHY_API_KEY,
  },
};

module.exports = nextConfig;
