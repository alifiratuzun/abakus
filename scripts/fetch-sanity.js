/**
 * Fetches projects from Sanity and outputs JSON for Eleventy.
 * Run at build time. Requires SANITY_PROJECT_ID and SANITY_DATASET env vars.
 */
const PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const DATASET = process.env.SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production'

const GROQ = `*[_type == "project"] | order(tarih desc) {
  _id,
  title,
  "slug": slug.current,
  mimar,
  yer,
  tur,
  tarih,
  "coverImageUrl": coverImage.asset->url,
  "coverImageAlt": coverImage.alt,
  "gallery": gallery[] {
    "image": asset->url,
    alt
  },
  body,
  footnote
}`

async function fetchProjects() {
  if (!PROJECT_ID) {
    return []
  }
  const query = encodeURIComponent(GROQ)
  const url = `https://${PROJECT_ID}.api.sanity.io/v2024-01-01/data/query/${DATASET}?query=${query}`
  const token =
    process.env.SANITY_READ_TOKEN ||
    process.env.SANITY_API_TOKEN ||
    process.env.SANITY_AUTH_TOKEN
  const res = await fetch(url, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
  const json = await res.json()
  if (!res.ok || json.error) {
    console.warn('[Sanity]', json.error?.description || res.statusText, '- using empty projects')
    return []
  }
  return json.result || []
}

function portableTextToHtml(blocks) {
  if (!blocks || !Array.isArray(blocks)) return ''
  try {
    const { toHTML } = require('@portabletext/to-html')
    return toHTML(blocks)
  } catch (e) {
    return blocks.map(b => b.children?.map(c => c.text).join('') || '').join('\n\n')
  }
}

async function main() {
  const raw = await fetchProjects()
  const projects = raw.map((p) => {
    const images = (p.gallery || []).map((g) => ({
      image: g.image || '',
      alt: g.alt || '',
    }))
    const coverImage = p.coverImageUrl
      ? { image: p.coverImageUrl, alt: p.coverImageAlt || '' }
      : images[0] || null
    return {
      slug: p.slug || 'untitled',
      title: p.title || '',
      mimar: p.mimar || '',
      yer: p.yer || '',
      tur: p.tur || '',
      tarih: p.tarih || '',
      images,
      cover_image: coverImage,
      body: portableTextToHtml(p.body),
      footnote: p.footnote || '',
    }
  })
  console.log(JSON.stringify(projects))
}

main().catch((err) => {
  console.error(err)
  console.log('[]')
})
