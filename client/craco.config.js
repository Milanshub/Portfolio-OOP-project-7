const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@routes': path.resolve(__dirname, 'src/routes'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@styles': path.resolve(__dirname, 'src/styles'),
      '@themes': path.resolve(__dirname, 'src/themes'),
      '@types': path.resolve(__dirname, 'src/types'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@assets': path.resolve(__dirname, 'src/assets'),
      // Subdirectories for common imports
      '@api': path.resolve(__dirname, 'src/lib/api'),
      '@ui': path.resolve(__dirname, 'src/components/ui'),
      '@common': path.resolve(__dirname, 'src/components/common'),
      '@layout': path.resolve(__dirname, 'src/components/layout'),
      '@sections': path.resolve(__dirname, 'src/components/sections'),
      '@features': path.resolve(__dirname, 'src/types/features'),
      '@entities': path.resolve(__dirname, 'src/types/entities'),
    }
  },
  style: {
    postcssOptions: {
        plugins: [
            require('tailwindcss'),
            require('autoprefixer'),
        ],
    },
  },
  typescript: {
    enableTypeChecking: true
  }
};