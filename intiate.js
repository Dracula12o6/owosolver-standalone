const axios = require('axios');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
// ============================================================================
//   STEP 1: INITIATE OAUTH HANDSHAKE
// ============================================================================
async function initiateOauth() {
    try {
        console.log('[1/6] Initiating OwO Discord Auth...');

        const res = await axios.get('https://owobot.com/api/auth/discord', {
            maxRedirects: 0,
            validateStatus: (status) => status === 302 || status === 200,
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
            }
        });

        const discordAuthUrl = res.headers.location;
        if (!discordAuthUrl) {
            throw new Error("Target redirection path missing from the response headers.");
        }

        console.log('[+] Discord Authorization Link Found:');
        return discordAuthUrl;
    } catch (error) {
        console.error('Failed to initiate OAuth sequence:', error.message);
        return null;
    }
}
module.exports = initiateOauth