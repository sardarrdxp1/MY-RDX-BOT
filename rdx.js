const { spawn } = require("child_process");
const axios = require("axios");
const logger = require("./utils/log");

///////////////////////////////////////////////////////////
//========= Create website for dashboard/uptime =========//
///////////////////////////////////////////////////////////

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static('includes/public'));

// Global bot process variable
let botProcess = null;
let manualRestart = false;

// Serve the premium dashboard
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'includes/public/index.html'));
});

// API: Start Bot
app.post('/api/bot/start', async (req, res) => {
    try {
        const { botName, prefix, adminUID, botUID, appstate } = req.body;
        
        if (!botName || !prefix || !adminUID || !botUID || !appstate) {
            return res.status(400).json({ error: 'All fields required' });
        }

        let appstateData;
        try {
            appstateData = JSON.parse(appstate);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid appstate JSON' });
        }

        // Update config.json
        const configPath = path.join(__dirname, 'config.json');
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        
        config.BOTNAME = botName;
        config.PREFIX = prefix;
        
        if (!config.ADMINBOT.includes(adminUID)) {
            config.ADMINBOT.push(adminUID);
        }
        
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

        // Update appstate.json
        const appstatePath = path.join(__dirname, 'appstate.json');
        fs.writeFileSync(appstatePath, JSON.stringify(appstateData, null, 2));

        // Reload global config
        delete require.cache[require.resolve('./config.json')];
        global.config = require('./config.json');

        // Restart bot automatically
        restartBot();

        res.json({ success: true, message: 'Bot configuration saved and restarting...' });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// API: Update Appstate
app.post('/api/bot/update-appstate', async (req, res) => {
    try {
        const { botUID, appstate } = req.body;
        
        if (!botUID || !appstate) {
            return res.status(400).json({ error: 'Bot UID and appstate required' });
        }

        let appstateData;
        try {
            appstateData = JSON.parse(appstate);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid appstate JSON' });
        }

        // Update appstate.json
        const appstatePath = path.join(__dirname, 'appstate.json');
        fs.writeFileSync(appstatePath, JSON.stringify(appstateData, null, 2));

        // Restart bot automatically
        restartBot();

        res.json({ success: true, message: 'Appstate updated and bot restarting...' });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server and add error handling
app.listen(port, () => {
    logger(`Server is running on port ${port}...`, "[ Starting ]");
}).on('error', (err) => {
    if (err.code === 'EACCES') {
        logger(`Permission denied. Cannot bind to port ${port}.`, "[ Error ]");
    } else {
        logger(`Server error: ${err.message}`, "[ Error ]");
    }
});

/////////////////////////////////////////////////////////
//========= Create start bot and make it loop =========//
/////////////////////////////////////////////////////////

// Initialize global restart counter
global.countRestart = global.countRestart || 0;

// Function to restart bot
function restartBot() {
    if (botProcess) {
        logger("Stopping current bot process...", "[ Restart ]");
        manualRestart = true;
        botProcess.kill();
        
        setTimeout(() => {
            logger("Starting new bot process...", "[ Restart ]");
            manualRestart = false;
            startBot("Bot restarted from dashboard");
        }, 2000);
    } else {
        startBot("Starting bot from dashboard");
    }
}

function startBot(message) {
    if (message) logger(message, "[ Starting ]");

    botProcess = spawn("node", ["--trace-warnings", "--async-stack-traces", "sardar.js"], {
        cwd: __dirname,
        stdio: "inherit",
        shell: true
    });

    // Add more detailed error logging
    botProcess.on("error", (error) => {
        logger(`Bot process error: ${error.stack || error.message}`, "[ Error ]");
    });

    // Add stdout and stderr handling for better debugging
    if (botProcess.stdout) {
        botProcess.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
        });
    }

    if (botProcess.stderr) {
        botProcess.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
        });
    }

    botProcess.on("close", (codeExit) => {
        if (manualRestart) {
            logger("Bot stopped for manual restart", "[ Restart ]");
            return;
        }
        
        if (codeExit !== 0) {
            logger(`Bot exited with code ${codeExit}`, "[ Exit ]");
            
            if (global.countRestart < 5) {
                global.countRestart += 1;
                logger(`Restarting... (${global.countRestart}/5)`, "[ Restarting ]");
                startBot();
            } else {
                logger(`Bot stopped after ${global.countRestart} restarts.`, "[ Stopped ]");
                logger("To see detailed errors, check the logs above or run the bot with 'node sardar.js' directly", "[ Debug ]");
            }
        } else {
            logger("Bot process exited with code 0 (normal exit)", "[ Exit ]");
        }
    });
};

////////////////////////////////////////////////
//========= Check update from Github =========//
////////////////////////////////////////////////

// Load package.json info locally instead of from GitHub
try {
    const packageInfo = require('./package.json');
    logger(packageInfo.name, "[ NAME ]");
    logger(`Version: ${packageInfo.version}`, "[ VERSION ]");
    logger(packageInfo.description, "[ DESCRIPTION ]");
    
    // Try to check for updates, but don't stop the bot if it fails
    axios.get("https://raw.githubusercontent.com/codedbypriyansh/Priyansh-Bot/main/package.json")
        .then((res) => {
            // Only log if successful, don't stop the bot if there's an error
            if (res.data && res.data.version) {
                logger(`Remote version: ${res.data.version}`, "[ UPDATE INFO ]");
            }
        })
        .catch((err) => {
            // Just log the error but continue with bot startup
            logger(`Update check failed: ${err.message}`, "[ Update Error ]");
        });
} catch (err) {
    // If local package.json can't be read, just log and continue
    logger(`Failed to load package info: ${err.message}`, "[ Error ]");
}

// Start the bot
startBot();
