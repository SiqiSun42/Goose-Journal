import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxy = {
    "/api/ollama": {
      target: "http://127.0.0.1:11434",
      changeOrigin: true,
      rewrite: (p: string) => p.replace(/^\/api\/ollama/, ""),
    },
    "/api/groq": {
      target: "https://api.groq.com",
      changeOrigin: true,
      secure: true,
      rewrite: (p: string) => p.replace(/^\/api\/groq/, ""),
      configure: (proxyServer) => {
        proxyServer.on("proxyReq", (proxyReq) => {
          const key = env.GROQ_API_KEY;
          if (key) {
            proxyReq.setHeader("Authorization", `Bearer ${key}`);
          }
        });
      },
    },
  } as const;

  return {
    plugins: [react()],
    server: { proxy },
    preview: { proxy },
  };
});
