const blogTools = require('eleventy-plugin-blog-tools');
const readerBar = require('eleventy-plugin-reader-bar');
const isDev = process.env.NODE_ENV !== 'production';
const mdIt = require('markdown-it');
// Haven't installed
const markdownItEmoji = require('markdown-it-emoji');
const markdownItAttrs = require('markdown-it-attrs');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(lazyImagesPlugin);
};
module.exports = function (eleventyConfig) {
    eleventyConfig.setQuietMode(isDev);
    /*************************11ty Plugins********************************/
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
    eleventyConfig.addLayoutAlias('post', 'post.njk');
    eleventyConfig.addLayoutAlias('home', 'home.njk');
    eleventyConfig.addCollection('slides', function (collectionApi) {
        return collectionApi.getFilteredByGlob('./src/slides/**/*.md');
    });
    /*************************MarkdownIt Plugins & Options********************************/
    let options = {
        html: true,
    };
    const markdownIt = mdIt(options).use(markdownItAttrs).use(markdownItEmoji);
    eleventyConfig.setLibrary('md', markdownIt);
    return {
        dir: {
            input: 'src',
            output: 'public',
        },
    };
};
