const WebpackObfuscator = require('webpack-obfuscator')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (!dev) {
      config.plugins.push(
        new WebpackObfuscator({
          compact: true,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 0.3,
          debugProtection: true,
          debugProtectionInterval: 10000,
          identifierNamesGenerator: 'hexadecimal',
          selfDefending: true,
          splitStrings: true,
          splitStringsChunkLength: 10,
          stringArray: true,
          stringArrayCallsTransform: true,
          stringArrayCallsTransformThreshold: 0.7,
          stringArrayEncoding: ['rc4'],
          stringArrayShuffle: true,
          stringArrayWrappersCount: 5,
          stringArrayWrappersType: 'variable',
          stringArrayWrappersParametersMaxCount: 4,
          transformObjectKeys: true
        }, [])
      )
    }
    return config
  }
}

module.exports = nextConfig
