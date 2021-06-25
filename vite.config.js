import { defineConfig } from 'vite';
import viteImagemin from 'vite-plugin-imagemin';
import legacy from '@vitejs/plugin-legacy';
const isDev = process.env.NODE_ENV === 'development';
// https://vitejs.dev/config/
export default defineConfig({
    // This is not critical, but I include it because there are more HTML transforms via plugins, that templates must handle
    // TODO: For legacy() to work without a hitch, we set a known @babel/standalone version in package.json
    // Remove that once https://github.com/vitejs/vite/issues/2442 is fixed
    plugins: [
        legacy(),
        viteImagemin({
            gifsicle: {
                optimizationLevel: 7,
                interlaced: false,
            },
            optipng: {
                optimizationLevel: 7,
            },
            webp: {
                quality: 85,
            },
            mozjpeg: {
                quality: 85,
            },
            pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
            },
            svgo: {
                plugins: [
                    {
                        removeViewBox: false,
                    },
                    {
                        removeEmptyAttrs: false,
                    },
                ],
            },
        }),
    ],
    publicDir: 'static',
    base: '/eleventy-kickstart-blog/',
    build: {
        // This is important: Generate directly to website and then assetsDir.
        // You could opt to build in an intermediate directory,
        // and have Eleventy copy the flies instead.
        outDir: 'website',
        // This is the default assetsDir. If you are using assets
        // for anything else, consider renaming assetsDir.
        // This can help you set cache headers for hashed output more easily.
        // assetsDir: "assets",
        // Sourcemaps are nice, but not critical for this to work
        sourcemap: isDev,
        // This is critical: generate manifest.json in outDir
        manifest: true,
        rollupOptions: {
            // This is critical: overwrite default .html entry
            input: '/src/index.js',
        },
        terserOptions: { ecma: '5' },
    },
});
