/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./context/**/*.{js,jsx,ts,tsx}",
    "./services/**/*.{js,jsx,ts,tsx}"
  ],

  theme: {
    extend: {
      colors: {
        awaazRed: "#D71920",
        awaazRedDark: "#A80F15",
        awaazNavy: "#071A36",
        awaazNavyLight: "#102B50",
        awaazGold: "#D4AF37",
        awaazWhite: "#FFFFFF",
        awaazGray: "#F5F6F8",
        awaazText: "#111827",
        awaazMuted: "#6B7280",
        awaazBorder: "#E5E7EB"
      },

      fontFamily: {
        sans: [
          "Noto Sans Devanagari",
          "Noto Sans",
          "Arial",
          "sans-serif"
        ]
      },

      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.08)",
        card: "0 2px 12px rgba(0,0,0,0.08)"
      },

      borderRadius: {
        "4xl": "2rem"
      }
    }
  },

  plugins: []
};
