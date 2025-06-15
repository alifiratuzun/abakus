exports.handler = async (event, context) => {
    const client_id = process.env.GITHUB_CLIENT_ID;
    const redirect_uri = 'https://abakus-studio.netlify.app/.netlify/functions/callback';
    const github_auth_url = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=repo`;

    return {
        statusCode: 302,
        headers: {
            Location: github_auth_url,
        },
    };
};
