/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Externalize pdf-parse to prevent webpack bundling issues
      config.externals = [...(config.externals || []), 'pdf-parse']
    }
    return config
  },
}

module.exports = nextConfig
