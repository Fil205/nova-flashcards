import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],

	server: {
		proxy: {
			// In dev: proxy /api to php -S 127.0.0.1:8787 api/index.php
			'/api': {
				target: 'http://127.0.0.1:8787',
				changeOrigin: true,
				// Keep the /api prefix — php router expects it
			}
		}
	},

	build: {
		sourcemap: false,
	}
});
