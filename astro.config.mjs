// Built-in modules
import { promises as fs } from 'fs';
import { URL } from 'node:url';

// External libraries/frameworks
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import glob from 'fast-glob';

// Project internal modules
import { ASSETS_URL, getCurrentAssetsUrl, getCurrentBaseUrl, getCurrentSiteUrl } from './src/lib/constants.ts';
import htmlBeautifier from './src/lib/htmlFormatter.js';
import { captureException, initSentry } from './src/lib/sentry';

// Initialize Sentry when Astro starts
initSentry();

// Get content based on build environment
const siteUrl = getCurrentSiteUrl();
const baseUrl = getCurrentBaseUrl();
const assetsUrl = getCurrentAssetsUrl();
const outDirUrl = `./dist${getCurrentBaseUrl()}`; // Remove trailing slash

// Set asset output destination when ASSETS_URL is enabled
const assetsDir = ASSETS_URL.STATUS ? new URL(assetsUrl).pathname.replace(/^\//, '') : '_astro';

export default defineConfig({
  site: process.env.PUBLIC_BASE_URL ? 'https://n-tong009.github.io' : siteUrl,
  base: process.env.PUBLIC_BASE_URL ? process.env.PUBLIC_BASE_URL : baseUrl,
  outDir: process.env.PUBLIC_BASE_URL ? './dist' : outDirUrl,
  compressHTML: false, // Whether to compress HTML. By default, compression is disabled.
  build: {
    // Whether to inline stylesheets
    inlineStylesheets: 'never',
    // Explicitly specify the asset directory
    assets: assetsDir,
    // Specify the asset prefix
    assetsPrefix: ASSETS_URL.STATUS ? assetsUrl : undefined,
    // Disable HTML compression and output formatted HTML
    format: 'file',
  },
  integrations: [
    react(),
    // Add HTML formatting plugin
    htmlBeautifier({
      parser: 'html',
      tabWidth: 2,
      useTabs: true,
      printWidth: 120,
      htmlWhitespaceSensitivity: 'css',
    }),
    {
      // Plugin name to clean up folders after build
      name: 'clean-dist-folder',
      hooks: {
        // Hook executed after Astro build process completes
        'astro:build:done': async ({ dir }) => {
          try {
            // Search for unnecessary system files using glob pattern
            // .DS_Store: macOS folder metadata file
            // Thumbs.db: Windows thumbnail cache
            // Desktop.ini: Windows folder display settings file
            const junkFiles = await glob(`${dir.pathname}/**/{.DS_Store,Thumbs.db,Desktop.ini}`);
            console.log(`Found ${junkFiles.length} junk files to delete`);

            // Delete detected unnecessary files one by one
            for (const file of junkFiles) {
              await fs.unlink(file); // Delete file using fs module's unlink method
            }

            // Search for macOS-specific hidden directories
            // __MACOSX directory is unnecessary and generated during zip file extraction
            const macosxDirs = await glob(`${dir.pathname}/**/__MACOSX`);
            console.log(`Found ${macosxDirs.length} __MACOSX directories to delete`);

            // Delete detected __MACOSX directories one by one
            for (const dirPath of macosxDirs) {
              // Confirm it is a directory before deletion
              const stats = await fs.stat(dirPath);
              if (stats.isDirectory()) {
                // recursive: true - Recursively delete all files and directories in the directory
                // force: true - Force delete read-only files and others
                await fs.rm(dirPath, { recursive: true, force: true });
              }
            }

            // Output cleanup success message
            console.log('Clean-up completed successfully');
          } catch (error) {
            // Error handling
            // Output detailed error information to console
            console.error('--- Clean-up Dist Folder Error ---');
            console.error(`Error Message: ${error.message}`); // Error message
            console.error(`Stack Trace: ${error.stack}`); // Stack trace information
            console.error('-----------------------------------');

            // Send error to Sentry (to enable detailed error tracking in production environment)
            // Use captureException method defined in src/lib/sentry.ts
            captureException(error);
          }
        },
      },
    },
  ],
  devToolbar: {
    enabled: false, // Whether to display the Astro standard toolbar
  },
  server: e => ({
    port: e.command === 'dev' ? 4000 : 4321,
    host: true, // Enable access from other devices on the local network
    open: true, // Whether to automatically open browser when server starts
  }),
  vite: {
    plugins: [tailwindcss()],
    build: {
      minify: process.env.NODE_ENV === 'production', // Whether to minify code
      assetsInlineLimit: 0, // Prevent automatic inline embedding when 4KB or less
      rollupOptions: {
        output: {
          entryFileNames: entryInfo => {
            return `assets/js/[name].js`; // You can also add .[hash] if needed
          },
          // Customize asset file names (as needed)
          assetFileNames: assetInfo => {
            if (ASSETS_URL.STATUS) {
              // When ASSETS_URL is enabled, maintain specific path structure
              const info = assetInfo.name.split('.');
              const extType = info[info.length - 1];
              if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
                return `assets/images/[name][extname]`;
              } else if (/css/i.test(extType)) {
                return `assets/css/[name]-[hash][extname]`;
              } else if (/js/i.test(extType)) {
                return `assets/js/[name]-[hash][extname]`;
              }
              return `assets/[name]-[hash][extname]`;
            } else {
              // Default output pattern
              return `_astro/[name].[hash][extname]`;
            }
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          // Handle Deprecation [legacy-js-api]
          api: 'modern-compiler',
          // additionalData: `@use '@/assets/stylesheets/app.scss' as app;`
        },
      },
    },
    // Setting to hide console and debugger only in production builds
    esbuild: process.env.NODE_ENV === 'production' ? { drop: ['console', 'debugger'] } : {},
  },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Oxanium',
      cssVariable: '--font-oxanium',
      weights: ['200', '300', '400', '500', '600', '700', '800'],
    },
    {
      provider: fontProviders.google(),
      name: 'Sora',
      cssVariable: '--font-sora',
      weights: ['200', '300', '400', '500', '600', '700', '800'],
    },
  ],
});
