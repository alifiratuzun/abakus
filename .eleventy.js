const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  // Copy raw assets
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("CNAME");
  eleventyConfig.addPassthroughCopy("_redirects");

  // Custom copy of admin/index.njk to _site/admin/index.html
  eleventyConfig.on('afterBuild', () => {
    const source = path.join(__dirname, 'admin/index.njk');
    const destDir = path.join(__dirname, '_site/admin');
    const dest = path.join(destDir, 'index.html');

    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.copyFileSync(source, dest);
  });

  eleventyConfig.addCollection("project", function (collection) {
    return collection.getFilteredByGlob("projects/*.md");
  });

  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
    }
  };
};
