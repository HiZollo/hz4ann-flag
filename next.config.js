const WebpackObfuscator = require('webpack-obfuscator')

const ObfuscatorOptions = {
  compact: true,
  debugProtection: true,
  debugProtectionInterval: 4000,
  identifierNamesGenerator: 'hexadecimal',
  selfDefending: true,
  stringArray: true,
  stringArrayEncoding: ['rc4'],
  stringArrayCallsTransform: true
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (!dev) {
      config.plugins.push(
        new WebpackObfuscator(ObfuscatorOptions, [])
      )
      
    }
    return config
  }
}

module.exports = nextConfig
