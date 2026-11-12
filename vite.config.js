import { defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { fileURLToPath } from 'node:url';

const local = path => fileURLToPath(new URL(path, import.meta.url));
export default defineConfig({
  base: './',
  plugins: [nodePolyfills({ include: ['buffer'] })],
  resolve: { alias: {
    'node:crypto': local('./src/crypto-shim.ts'),
    crypto: local('./src/crypto-shim.ts'),
    'lua-redis-wasm': local('./src/lua-disabled.js'),
  } },
  build: { target: 'es2022', chunkSizeWarningLimit: 1800 },
});
