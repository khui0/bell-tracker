/** @type {import('tailwindcss').Config} */

import Typography from "@tailwindcss/typography";
import daisyui from "daisyui";

export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    Typography(),
    daisyui,
  ],
  daisyui: {
    themes: ["dark"],
  },
}
