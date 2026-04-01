/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Core brand palette
        ps5: {
          black: "#000000",
          void: "#050505",
          charcoal: "#0D0D0D",
          surface: "#111111",
          elevated: "#161616",
          border: "#1F1F1F",
          muted: "#2A2A2A",
          // Accent blues (PlayStation brand)
          blue: "#006FFF",
          "blue-light": "#3D8EFF",
          "blue-glow": "#0057CC",
          cyan: "#00D4FF",
          // Text
          "text-primary": "#FFFFFF",
          "text-secondary": "#A0A0A0",
          "text-muted": "#555555",
          // Status
          danger: "#FF3B3B",
          success: "#00E676",
          warning: "#FFB300",
          gold: "#FFD700",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "ps5-gradient": "linear-gradient(135deg, #000000 0%, #0D0D0D 50%, #000000 100%)",
        "blue-glow": "radial-gradient(ellipse at center, rgba(0, 111, 255, 0.15) 0%, transparent 70%)",
        "hero-gradient": "linear-gradient(180deg, transparent 0%, #000000 100%)",
        "card-gradient": "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.9) 100%)",
      },
      boxShadow: {
        "ps5-blue": "0 0 20px rgba(0, 111, 255, 0.3), 0 0 40px rgba(0, 111, 255, 0.1)",
        "ps5-blue-sm": "0 0 10px rgba(0, 111, 255, 0.4)",
        "ps5-glow": "0 0 30px rgba(0, 111, 255, 0.2)",
        "card-hover": "0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 111, 255, 0.15)",
        "inner-glow": "inset 0 0 20px rgba(0, 111, 255, 0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "fade-in-up": "fadeInUp 0.4s ease-out",
        "fade-in-down": "fadeInDown 0.4s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "slide-in-left": "slideInLeft 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "pulse-blue": "pulseBlue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s infinite",
        "spin-slow": "spin 3s linear infinite",
        "bounce-subtle": "bounceSubtle 1s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeInDown: {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(-20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseBlue: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0, 111, 255, 0.4)" },
          "50%": { boxShadow: "0 0 0 10px rgba(0, 111, 255, 0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        "400": "400ms",
        "600": "600ms",
        "800": "800ms",
      },
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },
      screens: {
        "xs": "375px",
        "3xl": "1920px",
      },
      backdropBlur: {
        "4xl": "72px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-animate"),
  ],
};
