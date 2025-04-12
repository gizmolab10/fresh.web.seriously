import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
	plugins: [svelte()],
	build: {
		rollupOptions: {
			input: 'src/main.js',
			output: {
				format: 'iife',
				name: 'SeriouslyPlugin',
				entryFileNames: 'seriously-plugin.js',
				dir: 'dist/bubble'
			}
		}
	}
}); 