import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      proxy: {
        "/api/groq": {
          target: "https://api.groq.com",
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/api\/groq/, ""),
          configure: (proxyServer) => {
            proxyServer.on("proxyReq", (proxyReq) => {
              const key = env.GROQ_API_KEY;
              if (key) {
                proxyReq.setHeader("Authorization", `Bearer ${key}`);
              }
            });
          },
        },
      },
    },
    preview: {
      proxy: {
        "/api/groq": {
          target: "https://api.groq.com",
          changeOrigin: true,
          secure: true,
          rewrite: (p) => p.replace(/^\/api\/groq/, ""),
          configure: (proxyServer) => {
            proxyServer.on("proxyReq", (proxyReq) => {
              const key = env.GROQ_API_KEY;
              if (key) {
                proxyReq.setHeader("Authorization", `Bearer ${key}`);
              }
            });
          },
        },
      },
    },
  };
});
