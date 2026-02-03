const { DateTime } = require("luxon");
const { execSync } = require("child_process");
const path = require("path");

const useSanity =
  process.env.SANITY_PROJECT_ID &&
  process.env.SANITY_PROJECT_ID !== "your-project-id";

function fetchSanityProjects() {
  try {
    const scriptPath = path.join(__dirname, "scripts", "fetch-sanity.js");
    const out = execSync(`node "${scriptPath}"`, {
      encoding: "utf-8",
      env: process.env,
    });
    return JSON.parse(out);
  } catch (e) {
    return [];
  }
}

module.exports = function (eleventyConfig) {
  if (useSanity) {
    eleventyConfig.ignores.add("projects");
  } else {
    eleventyConfig.ignores.add("projects-pagination.11ty.js");
  }
  eleventyConfig.ignores.add("sanity");
  eleventyConfig.ignores.add("SANITY_SETUP.md");

  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("CNAME");

  // Add a unique filter for arrays
  eleventyConfig.addFilter("unique", function (arr) {
    return [...new Set(arr)];
  });

  // Add a map filter for arrays (supports dot notation)
  eleventyConfig.addFilter("map", function (arr, prop) {
    if (!Array.isArray(arr)) return [];
    if (!prop || typeof prop !== 'string') return arr;
    return arr.map(item => {
      if (typeof item !== "object" || item === null) return undefined;
      return prop.split('.').reduce((acc, key) => acc && acc[key], item);
    }).filter(item => item !== undefined);
  });

  // Add a date filter for Nunjucks
  eleventyConfig.addFilter("date", (dateObj, format = "yyyy-MM-dd") => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat(format);
  });

  // Add a filter to group years by Turkish decade
  eleventyConfig.addFilter("groupByDecade", function (years) {
    const groups = {};
    years.forEach(year => {
      if (typeof year === "string" && year.length === 4 && /^\d+$/.test(year)) {
        const decade = year.slice(0, 3) + "0'lar";
        if (!groups[decade]) groups[decade] = [];
        groups[decade].push(year);
      }
    });
    // Convert to array of {decade, years}
    return Object.entries(groups).map(([decade, years]) => ({
      decade,
      years: years.sort()
    })).sort((a, b) => a.decade.localeCompare(b.decade, "tr"));
  });

  // Add global computed data properties for new Turkish field names
  eleventyConfig.addGlobalData("eleventyComputed", {
    tur: data => data["Tür"] || data["Tur"] || data["Ne"] || data.tur,
    mimar: data => data["Mimar"] || data["Kim"] || data.mimar,
    yer: data => data["Yer"] || data["Nerede"] || data.yer,
    tarih: data => data["Tarih"] || data["Ne Zaman"] || data.tarih,
    cover_image: data => {
      if (data.cover_image && data.cover_image.image) {
        return data.cover_image;
      }
      if (Array.isArray(data.images) && data.images.length > 0) {
        return data.images[0];
      }
      return null;
    }
  });

  eleventyConfig.addCollection("project", function (collection) {
    if (useSanity) {
      const raw = fetchSanityProjects();
      return raw.map((p) => ({
        url: `/projects/${p.slug}/`,
        fileSlug: p.slug,
        data: {
          title: p.title,
          mimar: p.mimar,
          yer: p.yer,
          tur: p.tur,
          tarih: p.tarih,
          slug: p.slug,
          images: p.images || [],
          cover_image: p.cover_image,
          footnote: p.footnote,
          bodyHtml: p.body,
          layout: "project.njk",
        },
      }));
    }
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
