import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      boxShadow: {
        simple: "0px 0px 0px 5px 10px rgba(0,0,0,0.10)",
        upward: "0 -4px 10px -1px rgba(0, 0, 0, 0.03)", // custom upward shadow
      },
      colors: {
        accent: "#F4F5FD",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("tailwindcss-animate"),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function ({ addUtilities }: { addUtilities: any }) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      addUtilities({
        ".no-scrollbar": {
          "&::-webkit-scrollbar": {
            display: "none",
          },
          "-ms-overflow-style": "none" /* IE and Edge */,
          "scrollbar-width": "none" /* Firefox */,
        },
      });
    },
  ],
} satisfies Config;
