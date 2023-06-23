const WebpackObfuscator = require('webpack-obfuscator')

const ObfuscatorOptions = {
  compact: true,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.1,
  debugProtection: true,
  debugProtectionInterval: 4000,
  disableConsoleOutput: true,
  identifierNamesGenerator: 'hexadecimal',
  selfDefending: true,
  stringArray: true,
  stringArrayEncoding: ['rc4'],
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { dev }) => {
    if (!dev) {
      /**
      config.module.rules.push({
        test: /\.js$/,
        enforce: 'post',
        use: {
          loader: WebpackObfuscator.loader,
          options: ObfuscatorOptions
        }
      })
      **/
      config.plugins.push(
        new WebpackObfuscator(ObfuscatorOptions, [])
      )
      
    }
    return config
  }
}

module.exports = nextConfig
