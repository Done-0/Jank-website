import { defineConfig } from 'umi';
import path from 'path';
import { routes } from './routes';

export default defineConfig({
    base: '/',
    hash: true,
    outputPath: 'dist',
    npmClient: 'pnpm',
    routes,
    links: [{ rel: 'icon', href: '/favicon.svg' }],
    alias: {
        "@": path.resolve(__dirname, "../src"),
    },
    plugins: [
        require.resolve('@umijs/plugins/dist/tailwindcss'),
    ],
    esbuildMinifyIIFE: true,
    tailwindcss: {}
});
