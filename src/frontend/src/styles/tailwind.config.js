module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          blue: '#3b82f6',
          purple: '#a21caf',
        },
        surface: '#181a22',
        glass: 'rgba(24,26,42,0.7)',
      },
      borderRadius: {
        lg: '24px',
      },
      boxShadow: {
        lg: '0 8px 32px #3b82f655, 0 1.5px 0 #3b82f6',
      },
      animation: {
        fade: 'fadeIn 0.5s ease-in-out',
        float: 'float 2.5s ease-in-out infinite',
        neon: 'neonGlow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        float: {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
          '100%': { transform: 'translateY(0)' },
        },
        neonGlow: {
          '0%, 100%': { boxShadow: '0 0 16px #3b82f6, 0 0 32px #a21caf' },
          '50%': { boxShadow: '0 0 32px #a21caf, 0 0 64px #3b82f6' },
        },
      },
    },
  },
  plugins: [],
}; 