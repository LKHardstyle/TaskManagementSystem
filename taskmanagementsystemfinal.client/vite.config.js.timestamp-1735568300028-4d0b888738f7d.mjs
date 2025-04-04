// vite.config.js
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "file:///C:/Users/lukas/source/repos/TaskManagementSystemFinal/taskmanagementsystemfinal.client/node_modules/vite/dist/node/index.js";
import plugin from "file:///C:/Users/lukas/source/repos/TaskManagementSystemFinal/taskmanagementsystemfinal.client/node_modules/@vitejs/plugin-react/dist/index.mjs";
import fs from "fs";
import path from "path";
import child_process from "child_process";
import { env } from "process";
var __vite_injected_original_import_meta_url = "file:///C:/Users/lukas/source/repos/TaskManagementSystemFinal/taskmanagementsystemfinal.client/vite.config.js";
var baseFolder = env.APPDATA !== void 0 && env.APPDATA !== "" ? `${env.APPDATA}/ASP.NET/https` : `${env.HOME}/.aspnet/https`;
var certificateName = "taskmanagementsystemfinal.client";
var certFilePath = path.join(baseFolder, `${certificateName}.pem`);
var keyFilePath = path.join(baseFolder, `${certificateName}.key`);
if (!fs.existsSync(baseFolder)) {
  fs.mkdirSync(baseFolder, { recursive: true });
}
if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
  if (0 !== child_process.spawnSync("dotnet", [
    "dev-certs",
    "https",
    "--export-path",
    certFilePath,
    "--format",
    "Pem",
    "--no-password"
  ], { stdio: "inherit" }).status) {
    throw new Error("Could not create certificate.");
  }
}
var target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` : env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(";")[0] : "https://localhost:7003";
var vite_config_default = defineConfig({
  plugins: [plugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  server: {
    proxy: {
      "^/weatherforecast": {
        target,
        secure: false
      }
    },
    port: 51970,
    https: {
      key: fs.readFileSync(keyFilePath),
      cert: fs.readFileSync(certFilePath)
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxsdWthc1xcXFxzb3VyY2VcXFxccmVwb3NcXFxcVGFza01hbmFnZW1lbnRTeXN0ZW1GaW5hbFxcXFx0YXNrbWFuYWdlbWVudHN5c3RlbWZpbmFsLmNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcbHVrYXNcXFxcc291cmNlXFxcXHJlcG9zXFxcXFRhc2tNYW5hZ2VtZW50U3lzdGVtRmluYWxcXFxcdGFza21hbmFnZW1lbnRzeXN0ZW1maW5hbC5jbGllbnRcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL2x1a2FzL3NvdXJjZS9yZXBvcy9UYXNrTWFuYWdlbWVudFN5c3RlbUZpbmFsL3Rhc2ttYW5hZ2VtZW50c3lzdGVtZmluYWwuY2xpZW50L3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZmlsZVVSTFRvUGF0aCwgVVJMIH0gZnJvbSAnbm9kZTp1cmwnO1xyXG5cclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCBwbHVnaW4gZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xyXG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xyXG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IGNoaWxkX3Byb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XHJcbmltcG9ydCB7IGVudiB9IGZyb20gJ3Byb2Nlc3MnO1xyXG5cclxuY29uc3QgYmFzZUZvbGRlciA9XHJcbiAgICBlbnYuQVBQREFUQSAhPT0gdW5kZWZpbmVkICYmIGVudi5BUFBEQVRBICE9PSAnJ1xyXG4gICAgICAgID8gYCR7ZW52LkFQUERBVEF9L0FTUC5ORVQvaHR0cHNgXHJcbiAgICAgICAgOiBgJHtlbnYuSE9NRX0vLmFzcG5ldC9odHRwc2A7XHJcblxyXG5jb25zdCBjZXJ0aWZpY2F0ZU5hbWUgPSBcInRhc2ttYW5hZ2VtZW50c3lzdGVtZmluYWwuY2xpZW50XCI7XHJcbmNvbnN0IGNlcnRGaWxlUGF0aCA9IHBhdGguam9pbihiYXNlRm9sZGVyLCBgJHtjZXJ0aWZpY2F0ZU5hbWV9LnBlbWApO1xyXG5jb25zdCBrZXlGaWxlUGF0aCA9IHBhdGguam9pbihiYXNlRm9sZGVyLCBgJHtjZXJ0aWZpY2F0ZU5hbWV9LmtleWApO1xyXG5cclxuaWYgKCFmcy5leGlzdHNTeW5jKGJhc2VGb2xkZXIpKSB7XHJcbiAgICBmcy5ta2RpclN5bmMoYmFzZUZvbGRlciwgeyByZWN1cnNpdmU6IHRydWUgfSk7XHJcbn1cclxuXHJcbmlmICghZnMuZXhpc3RzU3luYyhjZXJ0RmlsZVBhdGgpIHx8ICFmcy5leGlzdHNTeW5jKGtleUZpbGVQYXRoKSkge1xyXG4gICAgaWYgKDAgIT09IGNoaWxkX3Byb2Nlc3Muc3Bhd25TeW5jKCdkb3RuZXQnLCBbXHJcbiAgICAgICAgJ2Rldi1jZXJ0cycsXHJcbiAgICAgICAgJ2h0dHBzJyxcclxuICAgICAgICAnLS1leHBvcnQtcGF0aCcsXHJcbiAgICAgICAgY2VydEZpbGVQYXRoLFxyXG4gICAgICAgICctLWZvcm1hdCcsXHJcbiAgICAgICAgJ1BlbScsXHJcbiAgICAgICAgJy0tbm8tcGFzc3dvcmQnLFxyXG4gICAgXSwgeyBzdGRpbzogJ2luaGVyaXQnLCB9KS5zdGF0dXMpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgY3JlYXRlIGNlcnRpZmljYXRlLlwiKTtcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgdGFyZ2V0ID0gZW52LkFTUE5FVENPUkVfSFRUUFNfUE9SVCA/IGBodHRwczovL2xvY2FsaG9zdDoke2Vudi5BU1BORVRDT1JFX0hUVFBTX1BPUlR9YCA6XHJcbiAgICBlbnYuQVNQTkVUQ09SRV9VUkxTID8gZW52LkFTUE5FVENPUkVfVVJMUy5zcGxpdCgnOycpWzBdIDogJ2h0dHBzOi8vbG9jYWxob3N0OjcwMDMnO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIHBsdWdpbnM6IFtwbHVnaW4oKV0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgYWxpYXM6IHtcclxuICAgICAgICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2VydmVyOiB7XHJcbiAgICAgICAgcHJveHk6IHtcclxuICAgICAgICAgICAgJ14vd2VhdGhlcmZvcmVjYXN0Jzoge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LFxyXG4gICAgICAgICAgICAgICAgc2VjdXJlOiBmYWxzZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBwb3J0OiA1MTk3MCxcclxuICAgICAgICBodHRwczoge1xyXG4gICAgICAgICAgICBrZXk6IGZzLnJlYWRGaWxlU3luYyhrZXlGaWxlUGF0aCksXHJcbiAgICAgICAgICAgIGNlcnQ6IGZzLnJlYWRGaWxlU3luYyhjZXJ0RmlsZVBhdGgpLFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrYyxTQUFTLGVBQWUsV0FBVztBQUVyZSxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFlBQVk7QUFDbkIsT0FBTyxRQUFRO0FBQ2YsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sbUJBQW1CO0FBQzFCLFNBQVMsV0FBVztBQVA2USxJQUFNLDJDQUEyQztBQVNsVixJQUFNLGFBQ0YsSUFBSSxZQUFZLFVBQWEsSUFBSSxZQUFZLEtBQ3ZDLEdBQUcsSUFBSSxPQUFPLG1CQUNkLEdBQUcsSUFBSSxJQUFJO0FBRXJCLElBQU0sa0JBQWtCO0FBQ3hCLElBQU0sZUFBZSxLQUFLLEtBQUssWUFBWSxHQUFHLGVBQWUsTUFBTTtBQUNuRSxJQUFNLGNBQWMsS0FBSyxLQUFLLFlBQVksR0FBRyxlQUFlLE1BQU07QUFFbEUsSUFBSSxDQUFDLEdBQUcsV0FBVyxVQUFVLEdBQUc7QUFDNUIsS0FBRyxVQUFVLFlBQVksRUFBRSxXQUFXLEtBQUssQ0FBQztBQUNoRDtBQUVBLElBQUksQ0FBQyxHQUFHLFdBQVcsWUFBWSxLQUFLLENBQUMsR0FBRyxXQUFXLFdBQVcsR0FBRztBQUM3RCxNQUFJLE1BQU0sY0FBYyxVQUFVLFVBQVU7QUFBQSxJQUN4QztBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQTtBQUFBLEVBQ0osR0FBRyxFQUFFLE9BQU8sVUFBVyxDQUFDLEVBQUUsUUFBUTtBQUM5QixVQUFNLElBQUksTUFBTSwrQkFBK0I7QUFBQSxFQUNuRDtBQUNKO0FBRUEsSUFBTSxTQUFTLElBQUksd0JBQXdCLHFCQUFxQixJQUFJLHFCQUFxQixLQUNyRixJQUFJLGtCQUFrQixJQUFJLGdCQUFnQixNQUFNLEdBQUcsRUFBRSxDQUFDLElBQUk7QUFHOUQsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDeEIsU0FBUyxDQUFDLE9BQU8sQ0FBQztBQUFBLEVBQ2xCLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDeEQ7QUFBQSxFQUNKO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDSixPQUFPO0FBQUEsTUFDSCxxQkFBcUI7QUFBQSxRQUNqQjtBQUFBLFFBQ0EsUUFBUTtBQUFBLE1BQ1o7QUFBQSxJQUNKO0FBQUEsSUFDQSxNQUFNO0FBQUEsSUFDTixPQUFPO0FBQUEsTUFDSCxLQUFLLEdBQUcsYUFBYSxXQUFXO0FBQUEsTUFDaEMsTUFBTSxHQUFHLGFBQWEsWUFBWTtBQUFBLElBQ3RDO0FBQUEsRUFDSjtBQUNKLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
