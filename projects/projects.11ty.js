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
      eleventyComputed: {
        title: (d) => d.project?.data?.title ?? d.title,
        mimar: (d) => d.project?.data?.mimar ?? d.mimar,
        yer: (d) => d.project?.data?.yer ?? d.yer,
        tur: (d) => d.project?.data?.tur ?? d.tur,
        tarih: (d) => d.project?.data?.tarih ?? d.tarih,
        images: (d) => d.project?.data?.images ?? d.images,
        cover_image: (d) => d.project?.data?.cover_image ?? d.cover_image,
        footnote: (d) => d.project?.data?.footnote ?? d.footnote,
        content: (d) =>
          d.project?.templateContent ?? d.project?.data?.body ?? d.content ?? "",
      },
    };
  }

  render() {
    return "";
  }
};
