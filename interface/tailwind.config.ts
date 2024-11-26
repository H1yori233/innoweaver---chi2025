import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      spacing: {
        96: "24rem",
        128: "32rem",
      },
    },
  },
  plugins: [
    require('tailwindcss-themer')({
      defaultTheme: {
        extend: {
          colors: {
            primary: "#171717",
            secondary: "#262626",
            border: {
              primary: "#4B5563",
              secondary: "#9CA3AF",
              line: "#FFFFFF",
            },
            text: {
              primary: "#FFFFFF",
              secondary: "#D1D5DB",
              placeholder: "#9CA3AF",
              link: "#77EEFF",
              linkHover: "#4BB3FD",
            },
            scrollbar: {
              thumb: "#4B5563",
              thumbHover: "#6B7280",
              track: "#1F2937",
            },
          },
          boxShadow: {
            primary: "0 1px 10px rgba(255, 255, 255, 0.5)",
          },
        },
      },
      themes: [
        {
          name: "light",
          extend: {
            colors: {
              primary: "#F9FAFB",
              secondary: "#E5E7EB",
              border: {
                primary: "#D1D5DB",
                secondary: "#9CA3AF",
                line: "#1F2937",
              },
              text: {
                primary: "#1F2937",
                secondary: "#4B5563",
                placeholder: "#6B7280",
                link: "#3B82F6",
                linkHover: "#2563EB",
              },
              scrollbar: {
                thumb: "#D1D5DB", // light 模式的滑块颜色
                thumbHover: "#9CA3AF", // light 模式的滑块悬停颜色
                track: "#F3F4F6", // light 模式的轨道颜色
              },
            },
            boxShadow: {
              primary: "0 1px 10px rgba(0, 0, 0, 0.5)", // light 模式的 boxShadow
            },
          },
        },
        {
          name: "dark",
          extend: {
            colors: {
              primary: "#171717",
              secondary: "#262626",
              border: {
                primary: "#4B5563",
                secondary: "#9CA3AF",
                line: "#FFFFFF",
              },
              text: {
                primary: "#FFFFFF",
                secondary: "#D1D5DB",
                placeholder: "#9CA3AF",
                link: "#77EEFF",
                linkHover: "#4BB3FD",
              },
              scrollbar: {
                thumb: "#4B5563",
                thumbHover: "#6B7280",
                track: "#1F2937",
              },
            },
            boxShadow: {
              primary: "0 1px 10px rgba(255, 255, 255, 0.5)",
            },
          },
        },
      ],
    }),
  ],
};
export default config;
