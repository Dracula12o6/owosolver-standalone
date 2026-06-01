const axios = require('axios');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
// ============================================================================
//   STEP 3: INTERCEPT CONNECT.SID SESSION COOKIE (FIXED ARRAY TO FLAT STRING)
// ============================================================================
async function captureOwoSessionCookie(callbackUrl) {
    try {
        console.log('[3/6] Intercepting OwO Session Verification Cookies...');
        const res = await axios.get(callbackUrl, {
            maxRedirects: 0,
            validateStatus: (status) => status === 302,
            headers: { 'User-Agent': USER_AGENT }
        });

        const cookies = res.headers['set-cookie'] || [];
        const sessionCookie = cookies.find(c => c.startsWith('connect.sid='));

        if (!sessionCookie) {
            throw new Error('Could not find active connect.sid cookie in response headers.');
        }

        // Extract only the base key value cleanly up to the first semi-colon separator
        const cleanCookieValue = sessionCookie.split(';')[0];
        console.log('[+] Successfully Intercepted Session Cookie');
        return cleanCookieValue;
    } catch (error) {
        console.error('[-] Step 3: Failed to fetch state engine session cookie:', error.message);
        return null;
    }
}

module.exports = captureOwoSessionCookie