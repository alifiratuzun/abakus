exports.handler = async (event, context) => {
    const code = event.queryStringParameters.code;

    if (!code) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing code' }),
        };
    }

    const client_id = process.env.GITHUB_CLIENT_ID;
    const client_secret = process.env.GITHUB_CLIENT_SECRET;

    const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
        },
        body: new URLSearchParams({
            client_id,
            client_secret,
            code,
        }),
    });

    const data = await response.json();

    if (data.error || !data.access_token) {
        return {
            statusCode: 500,
            body: JSON.stringify(data),
        };
    }

    const redirectHTML = `
      <script>
        localStorage.setItem('netlify-cms-user', JSON.stringify({
          token: "${data.access_token}",
          backendName: "github"
        }));
        window.location.href = "/admin";
      </script>
    `;

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html',
        },
        body: redirectHTML,
    };
};
