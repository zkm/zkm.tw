import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: '/',
    server: {
        proxy: {
            // Forwards to the chat Worker running via `wrangler dev` (see workers/chat)
            '/api': 'http://localhost:8787',
        },
    },
});
