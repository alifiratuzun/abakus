module.exports = function (eleventyConfig) {
  // Passthrough copy for static assets
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("admin");
  eleventyConfig.addPassthroughCopy("CNAME");

  // Add a unique filter for arrays
  eleventyConfig.addFilter("unique", function (arr) {
    return [...new Set(arr)];
  });

  // Add a map filter for arrays
  eleventyConfig.addFilter("map", function (arr, prop) {
    if (!Array.isArray(arr)) return [];
    if (!prop) return arr;
    // Support dot notation (e.g., 'data.what')
    return arr.map(item => {
      if (typeof item !== "object" || item === null) return undefined;
      return prop.split('.').reduce((acc, key) => acc && acc[key], item);
    });
  });

  // Create a custom collection for projects
  eleventyConfig.addCollection("project", function (collection) {
    return collection.getFilteredByGlob("projects/*.md");
  });

  // Set custom directories
  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
    },
  };
};
