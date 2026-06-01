const axios = require('axios');
const { verify } = require('crypto');
const initiateOauth = require('./intiate');
const authorizeDiscordGateway = require('./authorise');
const captureOwoSessionCookie = require('./capture');
const checkCaptchaRequired = require('./check');
const requestTokenFromSolver = require('./hcap');

async function submitFinalVerification(sessionCookie, solvedToken) {
    try {
        console.log('[6/6] Submitting verification solution token directly to OwO API...');

        const cookieString = `_ga=GA1.2.559822473.1779218517; _gid=GA1.2.1523003506.1779218517; ${sessionCookie}`;
        const finalBodyPayload = JSON.stringify({ token: solvedToken });

        const finalHeaders = {
            'Host': 'owobot.com',
            'Connection': 'keep-alive',
            'Content-Length': String(Buffer.byteLength(finalBodyPayload)),
            'Accept': 'application/json, text/plain, */*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
            'Content-Type': 'application/json',
            'Origin': 'https://owobot.com',
            'Referer': 'https://owobot.com/captcha',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cookie': cookieString,
            'sec-ch-ua': '"Chromium";v="148", "Google Chrome";v="148", "Not/A)Brand";v="99"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'Priority': 'u=1, i'
        };

        // FIXED API ROUTE TARGET DIRECTORY
        const response = await axios({
            method: 'POST',
            url: 'https://owobot.com/api/captcha/verify',
            data: finalBodyPayload,
            headers: finalHeaders,
            maxRedirects: 0,
            transformRequest: [(data) => data]
        });

        console.log('[!] Final Backend Response Summary:', response.data);
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('[-] Step 6: Verification Submission Denied:', error.response.status, error.response.data);
        } else {
            console.error('[-] Step 6: Network Error during submission:', error.message);
        }
        return null;
    }
}

async function Solve(userToken, SOLVER_CONFIG) {
    const startTime = Date.now();

    const fullOauthUrl = await initiateOauth(userToken);
    if (!fullOauthUrl) throw new Error('OAuth initiation failed');

    const callbackUrl = await authorizeDiscordGateway(fullOauthUrl, userToken);
    if (!callbackUrl) throw new Error('Discord gateway authorization failed');

    const sessionCookie = await captureOwoSessionCookie(callbackUrl);
    if (!sessionCookie) throw new Error('Failed to capture session cookie');

    const needToVerify = await checkCaptchaRequired(sessionCookie);
    if (!needToVerify) return { message: 'No captcha on this account' };

    const MAX_RETRIES = 3;
    let solvedToken = null;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`[+] Captcha solving attempt ${attempt}/${MAX_RETRIES}`);
            solvedToken = await requestTokenFromSolver(SOLVER_CONFIG);

            if (solvedToken) {
                console.log(`[+] Captcha solved successfully on attempt ${attempt}`);
                break;
            } else {
                throw new Error('No token returned from solver');
            }
        } catch (error) {
            console.error(`[-] Attempt ${attempt} failed: ${error.message}`);

            if (attempt === MAX_RETRIES) {
                throw new Error(`Captcha solver failed after ${MAX_RETRIES} attempts`);
            }

            // Wait before retry (exponential backoff)
            const delay = 2000 * attempt;
            console.log(`[-] Retrying in ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    const result = await submitFinalVerification(sessionCookie, solvedToken);
    if (!result) throw new Error('Final verification failed');

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    return { message: 'Solved successfully', elapsed };
}

module.exports = Solve
