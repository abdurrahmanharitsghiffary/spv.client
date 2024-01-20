/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  images: {
    unoptimized: true,
  },
  // productionBrowserSourceMaps: false,
  env: {
    GIPHY_API_KEY: process.env.GIPHY_API_KEY,
    NEXT_AUTH_SECRET: process.env.NEXT_AUTH_SECRET,
    BASE_WEB_URL: process.env.BASE_WEB_URL,
  },
};

module.exports = nextConfig;
