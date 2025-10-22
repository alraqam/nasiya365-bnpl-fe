/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */

module.exports = {
  // Note: 'output: export' mode is for static exports and doesn't support:
  // - Custom headers
  // - API routes
  // - Middleware
  // - ISR (Incremental Static Regeneration)
  // If you need these features, remove or comment out the 'output' line below
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true, // Enable React Strict Mode for better development experience
  
  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }

  // Security headers - DISABLED due to 'output: export' mode
  // To enable security headers, remove 'output: export' above and uncomment this section:
  /*
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  }
  */
}
