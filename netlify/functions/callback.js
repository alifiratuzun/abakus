import fetch from 'node-fetch';

exports.handler = async (event, context) => {
    const code = event.queryStringParameters.code;

    if (!code) {
        return { statusCode: 400, body: 'Missing code' };
    }

    const client_id = process.env.GITHUB_CLIENT_ID;
    const client_secret = process.env.GITHUB_CLIENT_SECRET;

    const response = await fetch(`https://github.com/login/oauth/access_token`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams({
            client_id,
            client_secret,
            code,
        }),
    });

    const data = await response.json();

    if (data.error) {
        return { statusCode: 500, body: JSON.stringify(data) };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ token: data.access_token }),
    };
};
