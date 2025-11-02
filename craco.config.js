const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@auth': path.resolve(__dirname, 'src/auth'),
      '@dashboards': path.resolve(__dirname, 'src/dashboards'),
      '@store': path.resolve(__dirname, 'src/store'),
      '@schemas': path.resolve(__dirname, 'src/schemas'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@constants': path.resolve(__dirname, 'src/constants'),
    },
  },
};
