/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: false,
  images: {
    unoptimized: true,
  },
  // productionBrowserSourceMaps: false,
  env: {
    GIPHY_API_KEY: process.env.GIPHY_API_KEY,
    BASE_WEB_URL: process.env.BASE_WEB_URL,
    BASE_API_ROUTE: process.env.BASE_API_ROUTE,
  },
};

module.exports = nextConfig;
