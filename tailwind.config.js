const mode = process.env.TAILWIND_MODE ? 'jit' : 'aot';
module.exports = {
  mode: 'jit',
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'group-hover'],
    divideColor: ['group-hover'],
  },
  purge: {
    content: ['./src/**/*.{html,ts}', './projects/**/*.{html,ts}'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
      serif: ['Space Grotesk'],
      mono: ['ui-monospace'],
      display: ['Nanum Pen Script'],
      body: ['Poppins', 'sans-serif'],
    },
    fontSize: {
      mini: '.6rem',
      xxs: '.65rem',
      xs: '.7rem',
      sm: '.875rem',
      tiny: '.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },
    extend: {
      colors: {
        primary: '#FF4343',
        secondary: '#04A777',
        green: '#04A777',
        'primary-text': '#2F0601',
        'secondary-text': '#35524A',
        'button-primary': '#315C2B',
        light: '#E7E5DF',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
