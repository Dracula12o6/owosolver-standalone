const axios = require('axios');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
// ============================================================================
//   STEP 2: DIRECT GATEWAY CLIENT AUTHORIZATION
// ============================================================================
async function authorizeDiscordGateway(oauthUrl, USER_TOKEN) {
    try {
        console.log('[2/6] Simulating Discord App Authorization...');

        const targetUrlObj = new URL(oauthUrl);
        const clientId = targetUrlObj.searchParams.get('client_id');
        const redirectUri = targetUrlObj.searchParams.get('redirect_uri');
        const scope = targetUrlObj.searchParams.get('scope');

        const apiEndpoint = new URL('/api/v9/oauth2/authorize', 'https://discord.com');
        apiEndpoint.searchParams.append('client_id', clientId);
        apiEndpoint.searchParams.append('response_type', 'code');
        apiEndpoint.searchParams.append('redirect_uri', redirectUri);
        apiEndpoint.searchParams.append('scope', scope);

        const response = await axios.post(apiEndpoint.href, {
            permissions: "0",
            authorize: true,
            integration_type: 0,
            location_context: { guild_id: "10000", channel_id: "10000", channel_type: 10000 },
            dm_settings: { allow_mobile_push: false }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': USER_TOKEN,
                'User-Agent': USER_AGENT
            }
        });
        const callbackUrl = response.data.location;
        console.log('[+] Authorization Code Callback URL Intercepted');
        return callbackUrl;
    } catch (error) {
        console.error('[-] Step 2: Discord Application Authorization Rejected:', error.response ? error.response.data : error.message);
        return null;
    }
}

module.exports = authorizeDiscordGateway