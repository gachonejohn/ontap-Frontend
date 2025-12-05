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
  jest: {
    configure: (jestConfig) => {
      // Transform node_modules that export ES modules
      jestConfig.transformIgnorePatterns = [
        "/node_modules/(?!(\\@standard-schema|@reduxjs/toolkit)/)"
      ];

     
      jestConfig.moduleNameMapper = {
        '^@components(.*)$': '<rootDir>/src/components$1',
        '^@auth(.*)$': '<rootDir>/src/auth$1',
        '^@dashboards(.*)$': '<rootDir>/src/dashboards$1',
        '^@store(.*)$': '<rootDir>/src/store$1',
        '^@schemas(.*)$': '<rootDir>/src/schemas$1',
        '^@hooks(.*)$': '<rootDir>/src/hooks$1',
        '^@utils(.*)$': '<rootDir>/src/utils$1',
        '^@pages(.*)$': '<rootDir>/src/pages$1',
        '^@constants(.*)$': '<rootDir>/src/constants$1',
      };

      return jestConfig;
    },
  },
};
