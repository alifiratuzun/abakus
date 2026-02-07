const DEFAULT_DEBOUNCE_SECONDS = 300

function json(body, statusCode = 200) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

exports.handler = async function handler() {
  const {
    NETLIFY_AUTH_TOKEN,
    NETLIFY_SITE_ID,
    NETLIFY_BUILD_HOOK_URL,
    SANITY_DEPLOY_DEBOUNCE_SECONDS,
  } = process.env

  if (!NETLIFY_AUTH_TOKEN || !NETLIFY_SITE_ID || !NETLIFY_BUILD_HOOK_URL) {
    return json(
      {
        ok: false,
        error:
          'Missing NETLIFY_AUTH_TOKEN, NETLIFY_SITE_ID, or NETLIFY_BUILD_HOOK_URL',
      },
      500
    )
  }

  const debounceSeconds = Number(SANITY_DEPLOY_DEBOUNCE_SECONDS) || DEFAULT_DEBOUNCE_SECONDS
  const now = Date.now()

  const deploysRes = await fetch(
    `https://api.netlify.com/api/v1/sites/${NETLIFY_SITE_ID}/deploys?per_page=1`,
    {
      headers: { Authorization: `Bearer ${NETLIFY_AUTH_TOKEN}` },
    }
  )

  if (!deploysRes.ok) {
    return json(
      { ok: false, error: `Failed to fetch deploys: ${deploysRes.status}` },
      502
    )
  }

  const deploys = await deploysRes.json()
  const latest = Array.isArray(deploys) ? deploys[0] : null
  if (latest?.created_at) {
    const lastTime = Date.parse(latest.created_at)
    if (!Number.isNaN(lastTime)) {
      const secondsSince = (now - lastTime) / 1000
      if (secondsSince < debounceSeconds) {
        return json({
          ok: true,
          skipped: true,
          reason: `Last deploy ${Math.round(secondsSince)}s ago (< ${debounceSeconds}s)`,
        })
      }
    }
  }

  const hookRes = await fetch(NETLIFY_BUILD_HOOK_URL, { method: 'POST' })
  if (!hookRes.ok) {
    return json(
      { ok: false, error: `Build hook failed: ${hookRes.status}` },
      502
    )
  }

  return json({ ok: true, skipped: false })
}
