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
    // Keep other experimental features if needed
    serverActions: {
      // Add any specific server actions configuration here
      // For example: bodySizeLimit: '2mb'
    },
    serverComponentsExternalPackages: ['pg'], // Changed from serverExternalPackages
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  // Disable ESLint in builds
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
