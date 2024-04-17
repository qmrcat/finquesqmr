/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: [
      './views/**/*.pug', 
      './src/js/*.js'
  ],
  theme: {
    extend: {
    },
  },
  plugins: [],
}

