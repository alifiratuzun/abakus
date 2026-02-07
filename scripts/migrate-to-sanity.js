/**
 * One-time migration: push existing markdown projects to Sanity.
 * Run after: npm install, and set SANITY_PROJECT_ID, SANITY_DATASET.
 * Requires: sanity CLI and a Sanity project with the project schema deployed.
 *
 * Usage: node scripts/migrate-to-sanity.js
 */

const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const crypto = require("crypto");

const PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID;
const DATASET = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || "production";

if (!PROJECT_ID || PROJECT_ID === "your-project-id") {
  console.error("Set SANITY_PROJECT_ID (create a project at sanity.io)");
  process.exit(1);
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function bodyToBlocks(body) {
  return body.split(/\n\n+/).filter(Boolean).map((p) => ({
    _type: "block",
    _key: crypto.randomBytes(16).toString("hex"),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: crypto.randomBytes(16).toString("hex"), text: p, marks: [] }],
  }));
}

const projectsDir = path.join(__dirname, "..", "projects");
const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".md"));

const mutations = [];
for (const file of files) {
  const content = fs.readFileSync(path.join(projectsDir, file), "utf-8");
  const { data: meta, content: body } = matter(content);
  const title = meta.title || "Untitled";
  const slug = slugify(title) || file.replace(/\.md$/, "").replace(/\./g, "-");

  mutations.push({
    createOrReplace: {
      _id: `project-${slug}`,
      _type: "project",
      title,
      slug: { _type: "slug", current: slug },
      mimar: meta.Mimar || meta.mimar || "",
      yer: meta.Yer || meta.yer || "",
      tur: meta.Tur || meta.tur || meta.Tür || "",
      tarih: String(meta.Tarih || meta.tarih || ""),
      gallery: [],
      body: bodyToBlocks((body || "").trim()),
      footnote: meta.footnote || "",
    },
  });
}

async function run() {
  const token = process.env.SANITY_AUTH_TOKEN;
  if (!token) {
    console.log("To migrate, you need SANITY_AUTH_TOKEN (create at sanity.io/manage)");
    console.log("Then run: SANITY_AUTH_TOKEN=xxx node scripts/migrate-to-sanity.js");
    console.log("\nProjects to migrate:", files);
    process.exit(0);
    return;
  }

  const res = await fetch(
    `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ mutations }),
    }
  );
  const json = await res.json();
  if (!res.ok) {
    console.error("Migration failed:", json);
    process.exit(1);
  }
  console.log("Migrated", files.length, "projects to Sanity");
}

run();
