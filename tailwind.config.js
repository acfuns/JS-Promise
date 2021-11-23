module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundColor: theme => ({
        'zbg': '#b7d4a8'
      }),
      borderColor: theme => ({
        'zbg': '#b7d4a8'
      })
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
