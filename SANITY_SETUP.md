# Sanity CMS Setup

Abakus uses [Sanity](https://sanity.io) for content management. The old Netlify CMS has been removed.

## 1. Create a Sanity project

1. Go to [sanity.io](https://sanity.io) and sign in
2. Create a new project
3. Note your **Project ID** (in project settings)

## 2. Run the Studio locally

```bash
cd sanity
npm install
SANITY_STUDIO_PROJECT_ID=your-project-id npm run dev
```

Open http://localhost:3333 and add your first project.

## 3. Configure Eleventy builds

Create `.env` in the project root:

```
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
```

Or set these env vars in your hosting (Netlify, Vercel, etc.).

## 4. Build the site

```bash
SANITY_PROJECT_ID=your-project-id npm run build
```

Without `SANITY_PROJECT_ID`, the site falls back to the Markdown files in `projects/`.

## 5. Migrate existing content (optional)

To copy your 3 Markdown projects into Sanity:

1. Create a token at [sanity.io/manage](https://sanity.io/manage)
2. Run: `SANITY_PROJECT_ID=xxx SANITY_AUTH_TOKEN=xxx node scripts/migrate-to-sanity.js`
3. Add images in the Studio (the script migrates text only)

## 6. Deploy the Studio

Deploy to Sanity's free hosting:

```bash
cd sanity && npx sanity deploy
```

You'll get a URL like `abakus.sanity.studio` to edit content.
