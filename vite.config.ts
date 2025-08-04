import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// // https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})

// // tailwind.config.js
// module.exports = {
//   theme: {
//     extend: {
//       fontFamily: {
//         signature: ["Sacramento", "cursive"],
//         classy: ["Playfair Display", "serif"],
//       },
//     },
//   },
//   plugins: [],
// };
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// });