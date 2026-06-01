# owosolver-standalone

OWO Bot Standalone Website Captcha Solver – Multi-token Discord Automation Tool built with Discord.js-selfbot-v13 and axios.

## Overview

This project automates OWO Bot website captcha verification by integrating hCaptcha-solving services. It is designed specifically for website-based verification and does **not** support DM/text-based verification challenges.

Since OWO's verification page does not use Cloudflare protection, a browser instance is not required, making the solver lightweight and suitable for deployment on most hosting environments.

The solver can be integrated into existing projects by importing the `Solve` function from `./verify.js`.

## Features

* Multi-token support
* Lightweight implementation using axios
* No browser required
* Easy integration into existing projects
* Simple setup for non-developers
* Supports custom captcha providers

## Recommended Captcha Provider

This project is pre-configured to work with [Scarnox](https://scarnox.com?utm_source=chatgpt.com), a captcha-solving API offering hCaptcha support with competitive pricing and fast solve times.

Typical solve times are between 5–15 seconds, depending on queue load and captcha difficulty.

You may also modify `./hcap.js` to use any other provider of your choice.

## Setup

1. Download the project archive.
2. Extract the files.
3. Add your token(s) to `tokens.txt`.
4. Configure `config.js` with your API key from [Scarnox](https://scarnox.com?utm_source=chatgpt.com).
5. Start the application.

## Performance

The solver itself executes in approximately 1–2 seconds. Total completion time depends primarily on the captcha-solving provider.

When using [Scarnox](https://scarnox.com?utm_source=chatgpt.com), most hCaptcha tasks are typically solved within 5–15 seconds.

## Disclaimer

This project is provided for educational purposes only.

The author does not encourage or endorse violations of the Terms of Service of OWO Bot, Discord, or any other platform. Use this software at your own risk.

The author assumes no responsibility for any account restrictions, suspensions, bans, or other consequences resulting from the use of this project.
