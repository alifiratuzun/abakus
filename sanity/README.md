# Abakus Sanity Studio

## Setup

1. Create a project at [sanity.io](https://sanity.io)
2. Copy `.env.example` to `.env` in the project root
3. Add your project ID: `SANITY_PROJECT_ID=your-id`
4. Install dependencies and run the studio:

```bash
cd sanity && npm install && npm run dev
```

5. Deploy the schema (first time): run the studio, it will prompt to deploy
6. Add your project ID to `.env` in the repo root for Eleventy builds

## Deploying the Studio

Deploy to [sanity.studio](https://sanity.studio) for free:

```bash
cd sanity && npx sanity deploy
```

Or host it on your own domain.

## Build (Eleventy)

Set `SANITY_PROJECT_ID` and `SANITY_DATASET` when building:

```bash
SANITY_PROJECT_ID=xxx SANITY_DATASET=production npm run build
```
