const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));

exports.handler = async function (event) {
    const code = event.queryStringParameters.code;
    const client_id = process.env.GITHUB_CLIENT_ID;
    const client_secret = process.env.GITHUB_CLIENT_SECRET;

    const accessTokenRes = await fetch(`https://github.com/login/oauth/access_token`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ client_id, client_secret, code })
    });

    const data = await accessTokenRes.json();
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};
