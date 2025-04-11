// Updated Tailwind configuration to match Dashdark X Webflow Template styles
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: '#1E1E2F', // Dark background color
        primary: '#4F46E5', // Vibrant primary accent color
        secondary: '#818CF8', // Secondary accent color
        textPrimary: '#E5E7EB', // Light text color
        textSecondary: '#9CA3AF' // Muted text color
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
