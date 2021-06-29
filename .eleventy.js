const blogTools = require('eleventy-plugin-blog-tools');
const readerBar = require('eleventy-plugin-reader-bar');
const isDev = process.env.NODE_ENV !== 'production';
const mdIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');
const markdownItEmoji = require('markdown-it-emoji');
const markdownItAttrs = require('markdown-it-attrs');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const pluginRss = require('@11ty/eleventy-plugin-rss');
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');
const pluginNavigation = require('@11ty/eleventy-navigation');
const htmlmin = require('html-minifier');
const moment = require('moment');
const fs = require('fs/promises');
const path = require('path');
const inclusiveLangPlugin = require('@11ty/eleventy-plugin-inclusive-language');

moment.locale();

const INPUT_DIR = 'src';
const OUTPUT_DIR = 'website';

// This will change both Eleventy's pathPrefix, and the one output by the
// vite-related shortcodes below. Double-check if you change this, as this is only a demo :)
const PATH_PREFIX = '/';

module.exports = function (eleventyConfig) {
    eleventyConfig.setQuietMode(isDev);
    /*************************11ty Plugins********************************/
    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(pluginSyntaxHighlight);
    eleventyConfig.addPlugin(pluginNavigation);
    eleventyConfig.addPlugin(inclusiveLangPlugin);
    eleventyConfig.addPlugin(readerBar);
    eleventyConfig.addPlugin(blogTools);
    eleventyConfig.addPlugin(lazyImagesPlugin, {
        transformImgPath: (imgPath) => {
            if (
                imgPath.startsWith('http://') ||
                imgPath.startsWith('https://')
            ) {
                // Handle remote file
                return imgPath;
            } else {
                return `./src/${imgPath}`;
            }
        },
    });
    eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
        if (outputPath.endsWith('.html')) {
            return htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
                minifyJS: true,
            });
        }

        return content;
    });
    eleventyConfig.addNunjucksAsyncShortcode('viteScriptTag', viteScriptTag);
    eleventyConfig.addNunjucksAsyncShortcode(
        'viteLegacyScriptTag',
        viteLegacyScriptTag,
    );
    eleventyConfig.addNunjucksAsyncShortcode(
        'viteLinkStylesheetTags',
        viteLinkStylesheetTags,
    );
    eleventyConfig.addNunjucksAsyncShortcode(
        'viteLinkModulePreloadTags',
        viteLinkModulePreloadTags,
    );

    async function viteScriptTag(entryFilename) {
        const entryChunk = await getChunkInformationFor(entryFilename);
        return `<script type="module" src="${PATH_PREFIX}${entryChunk.file}"></script>`;
    }

    /* Generate link[rel=modulepreload] tags for a script's imports */
    /* TODO(fpapado): Consider link[rel=prefetch] for dynamic imports, or some other signifier */
    async function viteLinkModulePreloadTags(entryFilename) {
        const entryChunk = await getChunkInformationFor(entryFilename);
        if (!entryChunk.imports || entryChunk.imports.length === 0) {
            console.log(
                `The script for ${entryFilename} has no imports. Nothing to preload.`,
            );
            return '';
        }
        /* There can be multiple import files per entry, so assume many by default */
        /* Each entry in .imports is a filename referring to a chunk in the manifest; we must resolve it to get the output path on disk.
         */
        const allPreloadTags = await Promise.all(
            entryChunk.imports.map(async (importEntryFilename) => {
                const chunk = await getChunkInformationFor(importEntryFilename);
                return `<link rel="modulepreload" href="${PATH_PREFIX}${chunk.file}"></link>`;
            }),
        );

        return allPreloadTags.join('\n');
    }

    async function viteLinkStylesheetTags(entryFilename) {
        const entryChunk = await getChunkInformationFor(entryFilename);
        if (!entryChunk.css || entryChunk.css.length === 0) {
            console.warn(
                `No css found for ${entryFilename} entry. Is that correct?`,
            );
            return '';
        }
        /* There can be multiple CSS files per entry, so assume many by default */
        return entryChunk.css
            .map(
                (cssFile) =>
                    `<link rel="stylesheet" href="${PATH_PREFIX}${cssFile}"></link>`,
            )
            .join('\n');
    }

    async function viteLegacyScriptTag(entryFilename) {
        const entryChunk = await getChunkInformationFor(entryFilename);
        return `<script nomodule src="${PATH_PREFIX}${entryChunk.file}"></script>`;
    }

    async function getChunkInformationFor(entryFilename) {
        // We want an entryFilename, because in practice you might have multiple entrypoint
        // This is similar to how you specify an entry in development more
        if (!entryFilename) {
            throw new Error(
                'You must specify an entryFilename, so that vite-script can find the correct file.',
            );
        }

        // TODO: Consider caching this call, to avoid going to the filesystem every time
        const manifest = await fs.readFile(
            path.resolve(process.cwd(), 'website', 'manifest.json'),
        );
        const parsed = JSON.parse(manifest);

        let entryChunk = parsed[entryFilename];

        if (!entryChunk) {
            const possibleEntries = Object.values(parsed)
                .filter((chunk) => chunk.isEntry === true)
                .map((chunk) => `"${chunk.src}"`)
                .join(`, `);
            throw new Error(
                `No entry for ${entryFilename} found in website/manifest.json. Valid entries in manifest: ${possibleEntries}`,
            );
        }

        return entryChunk;
    }
    // eleventyConfig.addLayoutAlias('slide', 'layouts/slide.njk');
    eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');
    eleventyConfig.addLayoutAlias('home', 'layouts/home.njk');
    // eleventyConfig.addCollection('allSlides', function (collectionApi) {
    //     return collectionApi.getFilteredByGlob('./src/content/slides/**/*.md');
    // });
    eleventyConfig.addFilter('filterTagList', (tags) => {
        // should match the list in tags.njk
        return (tags || []).filter(
            (tag) => ['all', 'nav', 'post', 'posts'].indexOf(tag) === -1,
        );
    });

    eleventyConfig.addCollection('allPosts', function (collectionApi) {
        return collectionApi.getFilteredByGlob('./src/content/posts/*.md');
    });

    eleventyConfig.addCollection('allPages', function (collectionApi) {
        return collectionApi.getFilteredByGlob('./src/content/**/*.md');
    });

    eleventyConfig.addFilter('dateIso', (date) => {
        return moment(date).toISOString();
    });
    eleventyConfig.addFilter('dateReadable', (date) => {
        return moment(date).utc().format('LL'); // E.g. May 31, 2019
    });

    // Create an array of all tags
    eleventyConfig.addCollection('tagList', function (collection) {
        let tagSet = new Set();
        collection.getAll().forEach((item) => {
            (item.data.tags || []).forEach((tag) => tagSet.add(tag));
        });

        return [...tagSet];
    });
    /*************************MarkdownIt Plugins & Options********************************/
    const markdownIt = mdIt({
        html: true,
        breaks: true,
        linkify: true,
    })
        .use(markdownItAttrs)
        .use(markdownItEmoji)
        .use(markdownItAnchor, {
            permalink: true,
            permalinkClass: 'direct-link',
            permalinkSymbol: '#',
        });
    eleventyConfig.setLibrary('md', markdownIt);
    return {
        templateFormats: ['md', 'njk', 'html'],
        pathPrefix: PATH_PREFIX,
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dataTemplateEngine: 'njk',
        passthroughFileCopy: true,
        dir: {
            input: INPUT_DIR,
            output: OUTPUT_DIR,
            // NOTE: These two paths are relative to dir.input
            // @see https://github.com/11ty/eleventy/issues/232
            includes: '_includes',
            data: '_data',
        },
    };
};
