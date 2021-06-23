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

moment.locale('en');

module.exports = function (eleventyConfig) {
    eleventyConfig.setQuietMode(isDev);
    /*************************11ty Plugins********************************/
    eleventyConfig.addPlugin(pluginRss);
    eleventyConfig.addPlugin(pluginSyntaxHighlight);
    eleventyConfig.addPlugin(pluginNavigation);
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
            const minified = htmlmin.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
                minifyJS: true,
            });
            return minified;
        }

        return content;
    });
    eleventyConfig.addLayoutAlias('slide', 'layouts/slide.njk');
    eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');
    eleventyConfig.addLayoutAlias('home', 'layouts/home.njk');
    eleventyConfig.addCollection('allSlides', function (collectionApi) {
        return collectionApi.getFilteredByGlob('./src/content/slides/**/*.md');
    });
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
        dir: {
            input: 'src',
            output: 'public',
        },
    };
};
