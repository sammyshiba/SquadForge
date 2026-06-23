/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary — Deep Navy
        primary: {
          DEFAULT: '#00216e',
          container: '#0033a0',
          fixed: '#dce1ff',
          'fixed-dim': '#b6c4ff',
          'on-fixed': '#001550',
          'on-fixed-variant': '#133ca8',
        },
        'on-primary': '#ffffff',
        'on-primary-container': '#8ea6ff',
        'inverse-primary': '#b6c4ff',

        // Secondary — Spring Green
        secondary: {
          DEFAULT: '#006d2f',
          container: '#72fa92',
          fixed: '#75fd95',
          'fixed-dim': '#56e07b',
          'on-fixed': '#002109',
          'on-fixed-variant': '#005322',
        },
        'on-secondary': '#ffffff',
        'on-secondary-container': '#007232',

        // Tertiary — Gold
        tertiary: {
          DEFAULT: '#372500',
          container: '#533a00',
        },
        'on-tertiary': '#ffffff',
        'on-tertiary-container': '#db9f00',
        'tertiary-fixed': '#ffdea6',
        'tertiary-fixed-dim': '#ffbb16',
        'on-tertiary-fixed': '#271900',
        'on-tertiary-fixed-variant': '#5e4200',

        // Error
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        },
        'on-error': '#ffffff',
        'on-error-container': '#93000a',

        // Surface system
        surface: {
          DEFAULT: '#f8f9ff',
          dim: '#cbdbf5',
          bright: '#f8f9ff',
          'container-lowest': '#ffffff',
          'container-low': '#eff4ff',
          container: '#e5eeff',
          'container-high': '#dce9ff',
          'container-highest': '#d3e4fe',
          tint: '#3456c1',
          variant: '#d3e4fe',
        },
        'on-surface': '#0b1c30',
        'on-surface-variant': '#444653',
        'inverse-surface': '#213145',
        'inverse-on-surface': '#eaf1ff',

        // Outline
        outline: {
          DEFAULT: '#747684',
          variant: '#c4c5d5',
        },

        // Background
        background: '#f8f9ff',
        'on-background': '#0b1c30',
      },

      fontFamily: {
        headline: ['Hanken Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },

      fontSize: {
        'headline-xl': ['48px', { lineHeight: '56px', fontWeight: '700', letterSpacing: '-0.02em' }],
        'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '600', letterSpacing: '-0.01em' }],
        'headline-lg-mobile': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-md': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'label-md': ['14px', { lineHeight: '20px', fontWeight: '500' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '500' }],
      },

      borderRadius: {
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px',
      },

      spacing: {
        base: '4px',
        xs: '8px',
        sm: '16px',
        md: '24px',
        lg: '40px',
        xl: '64px',
        gutter: '24px',
        margin: '32px',
      },

      boxShadow: {
        'elevation-2': '0px 4px 20px rgba(0, 51, 160, 0.08)',
      },

      maxWidth: {
        grid: '1200px',
      },
    },
  },
  plugins: [],
};
