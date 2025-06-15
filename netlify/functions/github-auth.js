const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async function (event) {
    const code = event.queryStringParameters.code;
    const client_id = process.env.GITHUB_CLIENT_ID;
    const client_secret = process.env.GITHUB_CLIENT_SECRET;

    if (!code) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing code' }),
        };
    }

    const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            client_id,
            client_secret,
            code
        })
    });

    const data = await response.json();

    if (data.error) {
        return {
            statusCode: 401,
            body: JSON.stringify(data),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};
