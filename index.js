const { Client } = require('discord.js-selfbot-v13');
const fs = require('fs');
const readline = require('readline');
const Solve = require('./verify');
const { SOLVER_CONFIG } = require('./config');

async function getTokensFromFile(filePath) {
    const tokens = [];

    try {
        const fileStream = fs.createReadStream(filePath);
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity
        });

        for await (const line of rl) {
            const token = line.trim();
            if (token) {
                tokens.push(token);
            }
        }

        console.log(`Loaded ${tokens.length} tokens`);
        return tokens;
    } catch (error) {
        console.error(`Error reading file:`, error.message);
        return [];
    }
}

// =======================================================================
// VERIFICATION WITH RETRY
// =======================================================================

async function solveWithRetry(token, config, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Attempt ${attempt}/${maxRetries}...`);
            const result = await Solve(token, config);
            console.log(result.message);
            return true;
        } catch (error) {
            console.log(`Attempt ${attempt} failed: ${error.message}`);

            if (attempt === maxRetries) {
                console.log(`All ${maxRetries} attempts failed`);
                return false;
            }

            // Wait before retry (increasing delay)
            const delay = attempt * 2000;
            console.log(`Waiting ${delay / 1000} seconds before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    return false;
}

// =======================================================================
// RUN SINGLE BOT
// =======================================================================

function runBot(token, index) {
    const client = new Client({
        checkUpdate: false
    });

    client.once('ready', async () => {
        console.log(`[${index}] Logged in as ${client.user.tag}`);
    });

    client.on('messageCreate', async message => {
       if (message.author.id !== '408785106942164992') return;

        // Remove zero-width characters and normalize
        const raw = message.content;
        const normalized = raw
            .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
            .replace(/<a?:[a-zA-Z0-9_]+:\d+>/g, '') // Remove custom emojis like <:blank:...>
            .replace(/[^a-zA-Z0-9\s]/g, ' ') // Replace special chars with spaces
            .toLowerCase();

        // Check for captcha indicators in normalized text
        const hasMention = raw.includes(`<@${client.user.id}>`) || raw.includes(`<@!${client.user.id}>`);
        const hasCaptchaKeywords = normalized.includes('human') ||
            normalized.includes('verify') ||
            normalized.includes('captcha') ||
            normalized.includes('complete');

        if (hasMention && hasCaptchaKeywords) {
            console.log(`[] Captcha detected!`);
            await solveWithRetry(token, SOLVER_CONFIG);
        }
    });


    client.login(token).catch(err => {
        console.error(`[${index}] Login failed:`, err.message);
    });
}

// =======================================================================
// MAIN
// =======================================================================

async function main() {
    const tokenFile = process.argv[2] || 'tokens.txt';
    const tokens = await getTokensFromFile(tokenFile);

    if (tokens.length === 0) {
        console.error('No tokens found. Exiting...');
        process.exit(1);
    }

    console.log(`Starting ${tokens.length} acc...`);

    // Run all bots simultaneously
    tokens.forEach((token, index) => {
        runBot(token, index + 1);
    });
}

main();
