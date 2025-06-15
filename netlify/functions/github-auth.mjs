export async function handler(event) {
    const client_id = process.env.GITHUB_CLIENT_ID;
    const client_secret = process.env.GITHUB_CLIENT_SECRET;
    const code = event.queryStringParameters.code;

    const res = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new URLSearchParams({
            client_id,
            client_secret,
            code,
        }),
    });

    const data = await res.json();

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
}
