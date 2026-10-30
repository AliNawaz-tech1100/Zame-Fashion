/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'plus.unsplash.com', 'cdn.sanity.io'],
  },
  trailingSlash: true,
}

module.exports = nextConfig
