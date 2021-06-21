const blogTools = require('eleventy-plugin-blog-tools');
const readerBar = require('eleventy-plugin-reader-bar');
const isDev = process.env.NODE_ENV !== 'production';
const mdIt = require('markdown-it');
// Haven't installed
const markdownItEmoji = require('markdown-it-emoji');
const markdownItAttrs = require('markdown-it-attrs');

module.exports = function (eleventyConfig) {
    eleventyConfig.setQuietMode(isDev);
    eleventyConfig.addPlugin(readerBar);
    eleventyConfig.addPlugin(blogTools);
    eleventyConfig.addLayoutAlias('post', 'post.njk');
    eleventyConfig.addLayoutAlias('home', 'home.njk');
    let options = {
        html: true,
    };
    const markdownIt = mdIt(options).use(markdownItAttrs).use(markdownItEmoji);
    eleventyConfig.setLibrary('md', markdownIt(options));
    return {
        dir: {
            input: 'src',
            output: 'dist',
        },
    };
};
