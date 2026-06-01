const axios = require('axios');

// ============================================================================
//   STEP 4: CAPTCHA SOLVER ON PORT 3000
// ============================================================================
async function requestTokenFromSolver(SOLVER_CONFIG) {
    try {
        console.log(`[5/6] Connecting to Solver Service...`);

        const response = await axios.post(SOLVER_CONFIG.endpoint, {
            site_key: SOLVER_CONFIG.sitekey,
            site_url: SOLVER_CONFIG.baseurl,
            captcha_type: 'hcaptcha',
            proxy: SOLVER_CONFIG.proxy
        },
            {
                headers: {
                    Authorization: `Bearer ${SOLVER_CONFIG.ApiKey}`
                },
                timeout: 120000
            });

        let parsedData;
        try {
            parsedData = JSON.parse(response.data);
        } catch {
            throw new Error(`Your solver rejected the request with text output: "${response.data}"`);
        }

        const token = parsedData.token || parsedData.response || parsedData.solution;
        if (!token) {
            throw new Error('No Solution was Passed.');
        }

        console.log(`[+] Captcha Resolved successfully!`);
        return token;
    } catch (error) {
        console.error('[-] Step 5: Local Solver Framework Error:', error.message);
        return null;
    }
}

module.exports = requestTokenFromSolver