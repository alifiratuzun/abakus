const useSanity =
  process.env.SANITY_PROJECT_ID &&
  process.env.SANITY_PROJECT_ID !== "your-project-id";

module.exports = class {
  data() {
    return {
      layout: "project.njk",
      pagination: {
        data: "collections.project",
        size: 1,
        alias: "project",
      },
      permalink: (data) => {
        if (!useSanity) return false;
        const slug =
          data.project?.data?.slug || data.project?.fileSlug || "untitled";
        return `/projects/${slug}/index.html`;
      },
    };
  }

  render() {
    return "";
  }
};
