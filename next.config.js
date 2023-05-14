const WebpackObfuscator = require('webpack-obfuscator')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (!dev) {
      config.plugins.push(
        new WebpackObfuscator({
          compact: true,
          debugProtection: true,
          rotateStringArray: true,
          controlFlowFlattening: true,
          controlFlowFlatteningThreshold: 0.1,
          deadCodeInjection: true,
          deadCodeInjectionThreshold: 0.2,
          debugProtectionInterval: 4000,
          identifierNamesGenerator: 'hexadecimal',
          selfDefending: true,
          splitStrings: true,
          stringArray: true,
          stringArrayCallsTransform: true,
          stringArrayCallsTransformThreshold: 0.7,
          stringArrayEncoding: ['rc4'],
          stringArrayShuffle: true,
          transformObjectKeys: true,
        }, [])
      )
    }
    return config
  }
}

module.exports = nextConfig
