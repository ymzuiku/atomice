import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "index.ts"),
      name: "atomice",
      fileName: (format) => {
        if (format === "es") {
          return `index.js`;
        }
        return `index.${format}.js`;
      },
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["react", "react-dom"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          react: "React",
        },
      },
    },
    outDir: "lib", // 打包后存放的目录文件
  },
});
