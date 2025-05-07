/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve 'fs', 'net', etc. on the client to prevent this error
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        dns: false,
        pg: false,
        path: false,
        child_process: false,
        url: false,
        crypto: false
      };
    }
    return config;
  },
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['pg'],
  },
  // Improve error handling
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
}

module.exports = nextConfig
