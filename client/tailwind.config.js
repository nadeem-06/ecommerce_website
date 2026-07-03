export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#8b5cf6",
        dark: "#1f2937",
        accent: "#ec4899",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        "gradient-dark": "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
      },
    },
  },
  plugins: []
}