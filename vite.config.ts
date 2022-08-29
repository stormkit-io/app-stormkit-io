import { defineConfig, loadEnv } from "vite";
import path from "path";
import { createHtmlPlugin } from "vite-plugin-html";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, __dirname, "") };

  return {
    root: "src",
    base: "/",

    define: {
      "process.env.STRIPE_API_KEY": JSON.stringify(env.STRIPE_API_KEY),
      "process.env.API_DOMAIN": JSON.stringify(env.API_DOMAIN),
      "process.env.API_PROXY_DOMAIN": JSON.stringify(env.API_PROXY_DOMAIN),
      "process.env.SENTRY": JSON.stringify(env.SENTRY),
      "process.env.STORMKIT_ENV": JSON.stringify(env.STORMKIT_ENV),
    },

    server: {
      https: true,
      proxy: {
        // with options
        [env.API_DOMAIN!]: {
          target: env.API_PROXY_DOMAIN,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ""),
        },
      },
    },

    resolve: {
      alias: [
        {
          find: /^~/,
          replacement: "",
        },
        {
          find: "@",
          replacement: path.resolve(__dirname, "src"),
        },
      ],
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    },
    publicDir: "./public",
    plugins: [basicSsl(), createHtmlPlugin({}), svgr(), react()],
    build: {
      outDir: "../dist",
    },
    esbuild: {
      define: {
        this: "window",
      },
    },
  };
});
