module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.jsx', '.json']
      },
      alias: {
        map: [
          ['@components', './src/components'],
          ['@auth', './src/auth'],
          ['@dashboards', './src/dashboards'],
          ['@store', './src/store'],
          ['@schemas', './src/schemas'],
          ['@hooks', './src/hooks'],
          ['@utils', './src/utils'],
          ['@pages', './src/pages'],
          ['@constants', './src/constants']
        ],
        extensions: ['.js', '.jsx', '.json']
      }
    }
  }
};