
import type {NextConfig} from 'next';
import type { Configuration as WebpackConfiguration } from 'webpack';

const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (
    config: WebpackConfiguration,
    { isServer }
  ) => {
    // For client-side bundles, provide mocks for Node.js built-in modules
    // that html-to-docx or its dependencies might try to import.
    if (!isServer) {
      if (!config.resolve) {
        config.resolve = {};
      }
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
        path: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        util: false,
        url: false,
        punycode: false,
        events: false,
      };
    }

    return config;
  },
};

export default nextConfig;
