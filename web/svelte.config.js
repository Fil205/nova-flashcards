import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			// Output directory: one level up from web/, inside public/
			pages: '../public',
			assets: '../public',
			// SPA fallback — Nginx serves index.html for all non-asset paths
			fallback: 'index.html',
			precompress: false,
			strict: false
		})
	}
};

export default config;
