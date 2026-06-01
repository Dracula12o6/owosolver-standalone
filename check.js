const axios = require('axios');
// ====================================================================================
//    CHECK PRESENCE OF CAPTCHA
// ====================================================================================

async function checkCaptchaRequired(sessionCookie) {
    try {
        console.log(`[4/6] Checking If Account Has Captcha Or Not`)
        const response = await axios.get(
            'https://owobot.com/api/auth',
            {
                headers: {
                    Cookie: sessionCookie,
                    Accept: 'application/json'
                }
            }
        );

        const data = response.data;
        // Example checks — adjust to actual response structure
        if (data && data.captcha.active == true) {
            console.log(`[+] Account Has Captcha Proceeding To Solve...`)
            return true;
        }
        console.log(`[-]  Account Captcha Is Not Found , Returning`)
        return false;

    } catch (err) {
        console.error(
            'Detection failed:',
            err.response?.data || err.message
        );

        return null;
    }
}

module.exports = checkCaptchaRequired