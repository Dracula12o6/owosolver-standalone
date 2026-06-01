# owosolver-standalone
OWO Bot Standalone Website Captcha Solver - Multi-token Discord Automation Tool Using Discord.js-selfbot-v13 and axios

This code allows you to bypass OWO BOT's Website Captcha verification , by implementing hcaptcha solver from https://scarnox.com
It only bypasses website verification and not dm based text verification keep that in mind!

It can be easily integrated into ur code by importing Solve function from ./verify.js

Owo does not have cloudflare hence browser is not required allowing you to host this code anywhere

The code can be used by non coders by inputting all their tokens into ./tokens.txt and running it 

Steps to use: 
      1. Download the .zip 
      2. Unzip it and upload the files
      3. Put your token in tokens.txt
      4. Fill out the config.js , get apiKey from https://scarnox.com , 0.6-0.75$/1k 
      5. Run the server

The solver speed depends on your provider , the code itself gets executed in just under 1-2s , rest is your hcaptcha solver provider solving time 
If your using https://scarnox.com , usually takes 5-15s . If you wish to use some other provider you can change it in ./hcap.js

This code is for educational purpose only , i do not ecourage the use of this code to break tos of OWO nor DISCORD . Use it at your own risk!
I do not hold responsible for any accounts which get banned/suspended/disabled by OWO or DISCORD
