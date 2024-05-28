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
      "process.env.API_DOMAIN": JSON.stringify(env.API_DOMAIN),
      "process.env.API_PROXY_DOMAIN": JSON.stringify(env.API_PROXY_DOMAIN),
      "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV),
      "process.env.GITHUB_ACCOUNT": JSON.stringify(env.GITHUB_ACCOUNT),
    },

    server: {
      https: true,
      host: true,
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
      rollupOptions: {
        // Material ui's "use client" directive causes a warning.
        // This function ignores those warnings.
        // See https://github.com/rollup/rollup/issues/4699#issuecomment-1571555307
        // for more information.
        onwarn(warning, warn) {
          if (
            warning.code === "MODULE_LEVEL_DIRECTIVE" &&
            warning.message.includes("use client")
          ) {
            return;
          }

          warn(warning);
        },
      },
    },
    esbuild: {
      define: {
        this: "window",
      },
    },
  };
});
