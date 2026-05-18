import { defineConfig, loadEnv } from "vite";

function normalizeBearerSecret(raw) {
  let v = String(raw ?? "").trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1).trim();
  }
  return v;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const deepseekKey =
    normalizeBearerSecret(env.DEEPSEEK_API_KEY) ||
    normalizeBearerSecret(process.env.DEEPSEEK_API_KEY);

  const deepseekProxy = {
    target: "https://api.deepseek.com",
    changeOrigin: true,
    secure: true,
    rewrite: (p) => p.replace(/^\/api\/deepseek/, ""),
    configure: (proxyServer) => {
      proxyServer.on("proxyReq", (proxyReq) => {
        if (deepseekKey) {
          proxyReq.setHeader("Authorization", `Bearer ${deepseekKey}`);
        }
      });
    },
  };
  return {
    server: {
      proxy: {
        "/api/deepseek": deepseekProxy,
      },
    },
    preview: {
      proxy: {
        "/api/deepseek": deepseekProxy,
      },
    },
  };
});
