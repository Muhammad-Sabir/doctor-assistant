/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      width: {
        '102': '30rem', 
        '94':'22rem'
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem', 
      },
      colors: {
        background: 'hsl(0, 0%, 100%)', 
        foreground: 'hsl(222.2, 84%, 4.9%)',
        card: {
          DEFAULT: 'hsl(0, 0%, 100%)', 
          foreground: 'hsl(222.2, 84%, 4.9%)', 
        },
        popover: {
          DEFAULT: 'hsl(0, 0%, 100%)', 
          foreground: 'hsl(222.2, 84%, 4.9%)',
        },
        primary: {
          DEFAULT: 'hsl(203, 87%, 30%)',
          foreground: 'hsl(210, 40%, 98%)',
        },
        secondary: {
          DEFAULT: 'hsl(197, 90%, 45%)',
          foreground: 'hsl(197, 90%, 45%)',
        },
        muted: {
          DEFAULT: 'hsl(210, 40%, 96.1%)',
          foreground: 'hsl(215.4, 16.3%, 46.9%)',
        },
        accent: {
          DEFAULT: 'hsl(214, 95%, 93%)',
          foreground: 'hsl(214, 95%, 93% / 11.2%)', 
        },
        destructive: {
          DEFAULT: 'hsl(0, 84.2%, 60.2%)',
          foreground: 'hsl(210, 40%, 98%)',
        },
        border: 'hsl(214.3, 31.8%, 91.4%)',
        input: 'hsl(0, 0%, 84%)',
        ring: 'hsl(203, 87%, 30%)', 
        chart: {
          '1': 'hsl(12, 76%, 61%)',
          '2': 'hsl(173, 58%, 39%)',
          '3': 'hsl(197, 37%, 24%)',
          '4': 'hsl(43, 74%, 66%)',
          '5': 'hsl(27, 87%, 67%)',
        },
      },
    },
  },
  plugins: [],
}
