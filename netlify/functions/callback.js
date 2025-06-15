exports.handler = async (event) => {
  const code = event.queryStringParameters.code;
  if (!code) return { statusCode: 400, body: "Missing code" };

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const data = await response.json();

  if (!data.access_token) return { statusCode: 500, body: JSON.stringify(data) };

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html' },
    body: `
        <script>
          localStorage.setItem('netlify-cms-user', JSON.stringify({
            token: "${data.access_token}",
            backendName: "github"
          }));
          window.location.href = "/admin";
        </script>
      `,
  };
};