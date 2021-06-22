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
    eleventyConfig.addLayoutAlias('post', 'post.njk');
    eleventyConfig.addLayoutAlias('home', 'home.njk');
    eleventyConfig.addCollection('slides', function (collectionApi) {
        return collectionApi.getFilteredByGlob('./src/slides/**/*.md');
    });
    eleventyConfig.addFilter('filterTagList', (tags) => {
        // should match the list in tags.njk
        return (tags || []).filter(
            (tag) => ['all', 'nav', 'post', 'posts'].indexOf(tag) === -1,
        );
    });

    // Create an array of all tags
    eleventyConfig.addCollection('tagList', function (collection) {
        let tagSet = new Set();
        collection.getAll().forEach((item) => {
            (item.data.tags || []).forEach((tag) => tagSet.add(tag));
        });

        return [...tagSet];
    });
    eleventyConfig.setBrowserSyncConfig({
        callbacks: {
            ready: function (err, browserSync) {
                const content_404 = fs.readFileSync('_site/404.html');

                browserSync.addMiddleware('*', (req, res) => {
                    // Provides the 404 content without redirect.
                    res.writeHead(404, {
                        'Content-Type': 'text/html; charset=UTF-8',
                    });
                    res.write(content_404);
                    res.end();
                });
            },
        },
        ui: false,
        ghostMode: false,
    });
    /*************************MarkdownIt Plugins & Options********************************/
    eleventyConfig.addWatchTarget('src/_includes/webpack.ejs');
    const markdownIt = mdIt({
        html: true,
        breaks: true,
        linkify: true,
    })
        .use(markdownItAttrs)
        .use(markdownItEmoji);
    use(markdownItAnchor, {
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
