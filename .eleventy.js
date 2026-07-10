const yaml = require("js-yaml");
const { DateTime } = require("luxon");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const htmlmin = require("html-minifier");

module.exports = function (eleventyConfig) {
  // Disable automatic use of your .gitignore
  eleventyConfig.setUseGitIgnore(false);

  // Merge data instead of overriding
  eleventyConfig.setDataDeepMerge(true);

  // Computed permalinks: use front matter slug if set, otherwise fall back to fileSlug
  eleventyConfig.addGlobalData("eleventyComputed", {
    permalink: function (data) {
      var slug = data.slug || data.page.fileSlug;
      if (data.tags && data.tags.includes("animal")) {
        return "/wildlife/" + slug + "/";
      }
      if (data.tags && data.tags.includes("service")) {
        return "/services/" + slug + "/";
      }
      if (data.tags && data.tags.includes("location")) {
        return "/locations/" + slug + "/";
      }
      return data.permalink;
    },
  });

  // human readable date
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Syntax Highlighting for Code blocks
  eleventyConfig.addPlugin(syntaxHighlight);

  // Breadcrumb helper: returns array of {label, url} from a page URL
  // Labels are derived dynamically by capitalizing and replacing hyphens with spaces
  eleventyConfig.addFilter("breadcrumbs", function (pageUrl) {
    if (!pageUrl || pageUrl === "/") return [];
    var parts = pageUrl.replace(/^\/|\/$/g, "").split("/");
    var crumbs = [];
    var path = "";
    for (var i = 0; i < parts.length; i++) {
      if (parts[i] === "") continue;
      path += "/" + parts[i];
      var label = parts[i]
        .split("-")
        .map(function (word) {
          return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(" ");
      crumbs.push({ label: label, url: path + "/" });
    }
    return crumbs;
  });

  // To Support .yaml Extension in _data
  // You may remove this if you can use JSON
  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Copy Static Files to /_Site
  eleventyConfig.addPassthroughCopy({
    "./src/admin/config.yml": "./admin/config.yml",
    "./node_modules/alpinejs/dist/cdn.min.js": "./static/js/alpine.js",
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy("./src/static/img");

  // Copy favicon to route of /_site
  eleventyConfig.addPassthroughCopy("./src/favicon.ico");
  eleventyConfig.addPassthroughCopy("./src/favicon-16x16.png");
  eleventyConfig.addPassthroughCopy("./src/favicon-32x32.png");
  eleventyConfig.addPassthroughCopy("./src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("./src/android-chrome-192x192.png");
  eleventyConfig.addPassthroughCopy("./src/android-chrome-512x512.png");
  eleventyConfig.addPassthroughCopy("./src/site.webmanifest");

  // Minify HTML
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    // Eleventy 1.0+: use this.inputPath and this.outputPath instead
    if (outputPath.endsWith(".html")) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  // Let Eleventy transform HTML files as nunjucks
  // So that we can use .html instead of .njk
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};
