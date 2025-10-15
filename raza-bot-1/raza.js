console.clear();
const chalk = require('chalk');
const express = require('express');
const fs = require('fs-extra');
const path = require('path');
const { login } = require("./main/module/index");
const loader = require("./raza/loader");
const listen = require("./raza/listen");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "raza/public")));

global.client = {
    commands: new Map(),
    events: new Map(),
    accounts: new Map(),
    cooldowns: new Map(),
    onlines: new Array()
};

global.config = {};
global.data = {
    threadInfo: new Map(),
    threadData: new Map(),
    userName: new Map(),
    userBanned: new Map(),
    threadBanned: new Map(),
    commandBanned: new Map(),
    threadAllowNSFW: new Array(),
    allUserID: new Array(),
    allCurrenciesID: new Array(),
    allThreadID: new Map()
};

console.log(chalk.magenta.bold(`
╔════════════════════════════════════════╗
║      RK PREMIUM BOT - DASHBOARD        ║
║   Advanced Facebook Messenger Bot      ║
╚════════════════════════════════════════╝
`));

const directories = ['config', 'states', 'modules/cmds', 'modules/events', 'data'];
directories.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(chalk.green(`✓ Created directory: ${dir}`));
    }
});

const configPath = path.join(__dirname, "config/config.json");
const usersPath = path.join(__dirname, "config/users.json");
const dashboardUsersPath = path.join(__dirname, "config/dashboard_users.json");

if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({
        prefix: "/",
        botName: "RK Premium Bot",
        adminUIDs: [],
        premium: true
    }, null, 2));
}

if (!fs.existsSync(usersPath)) {
    fs.writeFileSync(usersPath, JSON.stringify({ bots: [] }, null, 2));
}

if (!fs.existsSync(dashboardUsersPath)) {
    fs.writeFileSync(dashboardUsersPath, JSON.stringify({ users: [] }, null, 2));
}

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
global.config = config;

app.post('/api/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const dashboardUsers = JSON.parse(fs.readFileSync(dashboardUsersPath, 'utf-8'));

        const user = dashboardUsers.users.find(u => u.username === username && u.password === password);

        if (user) {
            res.json({ success: true, username: username });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/api/bots', (req, res) => {
    try {
        const { username } = req.query;
        const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));

        let bots = users.bots || [];

        if (username) {
            bots = bots.filter(bot => bot.username === username);
        }

        const botStatuses = bots.map(bot => ({
            ...bot,
            status: global.client.accounts.has(bot.uid) ? 'online' : 'offline'
        }));
        res.json(botStatuses);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load bots' });
    }
});

app.post('/api/bot/:uid/stop', async (req, res) => {
    try {
        const { uid } = req.params;
        const botAccount = global.client.accounts.get(uid);

        if (!botAccount) {
            return res.status(404).json({ error: 'Bot not found or already stopped' });
        }

        if (botAccount.stopListening) {
            botAccount.stopListening();
        }

        global.client.accounts.delete(uid);
        global.client.onlines = global.client.onlines.filter(b => b.uid !== uid);

        console.log(chalk.yellow(`✓ Bot stopped: ${uid}`));
        res.json({ success: true, message: 'Bot stopped successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to stop bot' });
    }
});

app.post('/api/bot/:uid/start', async (req, res) => {
    try {
        const { uid } = req.params;

        if (global.client.accounts.has(uid)) {
            return res.status(400).json({ error: 'Bot is already running' });
        }

        const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
        const bot = usersData.bots.find(b => b.uid === uid);

        if (!bot) {
            return res.status(404).json({ error: 'Bot not found' });
        }

        const statePath = path.join(__dirname, `states/${uid}.json`);
        if (!fs.existsSync(statePath)) {
            return res.status(404).json({ error: 'Bot appstate not found' });
        }

        const appstateData = JSON.parse(fs.readFileSync(statePath, 'utf-8'));

        login({ appState: appstateData }, config.loginoptions || {
            online: true,
            updatePresence: true,
            selfListen: false,
            autoMarkRead: true
        }, async (err, api) => {
            if (err) {
                return res.status(400).json({ error: 'Failed to start bot: ' + (err.error || err) });
            }

            await startBot(api, bot);
            res.json({ success: true, message: 'Bot started successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to start bot' });
    }
});

app.post('/api/bot/:uid/restart', async (req, res) => {
    try {
        const { uid } = req.params;

        const botAccount = global.client.accounts.get(uid);
        if (botAccount && botAccount.stopListening) {
            botAccount.stopListening();
        }
        global.client.accounts.delete(uid);

        const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
        const bot = usersData.bots.find(b => b.uid === uid);

        if (!bot) {
            return res.status(404).json({ error: 'Bot not found' });
        }

        const statePath = path.join(__dirname, `states/${uid}.json`);
        const appstateData = JSON.parse(fs.readFileSync(statePath, 'utf-8'));

        login({ appState: appstateData }, config.loginoptions || {
            online: true,
            updatePresence: true,
            selfListen: false,
            autoMarkRead: true
        }, async (err, api) => {
            if (err) {
                return res.status(400).json({ error: 'Failed to restart bot' });
            }

            await startBot(api, bot);
            res.json({ success: true, message: 'Bot restarted successfully' });
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to restart bot' });
    }
});

app.post('/api/bot/:uid/refresh-appstate', async (req, res) => {
    try {
        const { uid } = req.params;
        const { appstate } = req.body;

        if (!appstate) {
            return res.status(400).json({ error: 'Appstate required' });
        }

        let appstateData;
        try {
            appstateData = JSON.parse(appstate);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid appstate format' });
        }

        const statesDir = path.join(__dirname, 'states');
        if (!fs.existsSync(statesDir)) {
            fs.mkdirSync(statesDir, { recursive: true });
        }
        const statePath = path.join(statesDir, `${uid}.json`);
        fs.writeFileSync(statePath, JSON.stringify(appstateData, null, 2));
        console.log(chalk.green(`✓ Saved appstate for bot: ${uid}`));


        res.json({ success: true, message: 'Appstate refreshed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to refresh appstate' });
    }
});

app.get('/api/commands', (req, res) => {
    const commands = Array.from(global.client.commands.values()).map(cmd => ({
        name: cmd.config.name,
        description: cmd.config.description,
        category: cmd.config.category,
        permission: cmd.config.permission,
        usages: cmd.config.usages,
        credits: cmd.config.credits
    }));
    res.json(commands);
});

app.get('/commands', (req, res) => {
    const commands = Array.from(global.client.commands.values()).map(cmd => ({
        config: {
            name: cmd.config.name,
            description: cmd.config.description,
            category: cmd.config.category,
            permission: cmd.config.permission,
            usages: cmd.config.usages,
            credits: cmd.config.credits
        }
    }));
    res.json(commands);
});

app.get('/info', (req, res) => {
    try {
        const onlineBots = Array.from(global.client.accounts.values()).map(account => ({
            name: account.info.name,
            thumbSrc: account.info.thumbSrc,
            profileUrl: account.info.profileUrl,
            time: Math.floor((Date.now() - (account.startTime || Date.now())) / 1000)
        }));
        res.json(onlineBots);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load online bots' });
    }
});

app.get('/api/online-bots', (req, res) => {
    try {
        const onlineBots = Array.from(global.client.accounts.values()).map(account => ({
            uid: account.info.uid,
            name: account.info.name,
            botname: account.info.botname,
            prefix: account.info.prefix,
            thumbSrc: account.info.thumbSrc,
            username: account.info.username,
            status: 'online'
        }));
        res.json(onlineBots);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load online bots' });
    }
});

app.post('/create', async (req, res) => {
    try {
        const { appstate, botname, botprefix, botadmin, username, password } = req.body;

        if (!appstate || !botname || !botprefix || !botadmin || !username || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const dashboardUsers = JSON.parse(fs.readFileSync(dashboardUsersPath, 'utf-8'));
        if (dashboardUsers.users.find(u => u.username === username)) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        let appstateData;
        try {
            appstateData = JSON.parse(appstate);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid appstate format' });
        }

        const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
        let bots = usersData.bots || [];

        console.log(chalk.blue(`Attempting login for ${botname}...`));

        login({ appState: appstateData }, config.loginoptions || {
            online: true,
            updatePresence: true,
            selfListen: false,
            autoMarkRead: true
        }, async (err, api) => {
            if (err) {
                console.error(chalk.red(`Login failed: ${err.error || err}`));
                return res.status(400).json({ error: 'Facebook login failed. Check your appstate.' });
            }

            const uid = api.getCurrentUserID();

            const existingBotWithUID = bots.find(b => b.uid === uid);
            if (existingBotWithUID) {
                api.logout();
                return res.status(400).json({ error: 'This Facebook account is already registered.' });
            }

            const existingBotWithUsername = bots.find(b => b.username === username);
            if (existingBotWithUsername) {
                api.logout();
                return res.status(400).json({ error: 'Username already taken.' });
            }

            if (global.client.accounts.has(uid)) {
                api.logout();
                return res.status(400).json({ error: 'This bot is already running.' });
            }

            const statesDir = path.join(__dirname, 'states');
            if (!fs.existsSync(statesDir)) {
                fs.mkdirSync(statesDir, { recursive: true });
            }
            const statePath = path.join(statesDir, `${uid}.json`);
            fs.writeFileSync(statePath, JSON.stringify(appstateData, null, 2));
            console.log(chalk.green(`✓ Saved appstate for bot: ${uid}`));

            let realName = botname;
            let thumbSrc = `https://graph.facebook.com/${uid}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            let profileUrl = `https://www.facebook.com/profile.php?id=${uid}`;

            try {
                const botData = await new Promise((resolve, reject) => {
                    api.getBotInitialData((err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });

                if (botData && !botData.error) {
                    realName = botData.name || botname;
                    thumbSrc = botData.thumbSrc || thumbSrc;
                    profileUrl = `https://www.facebook.com/profile.php?id=${uid}`;
                    console.log(chalk.green(`✓ Fetched bot info: ${realName}`));
                } else {
                    console.log(chalk.yellow(`Warning: Using fallback bot info`));
                }
            } catch (e) {
                console.error(chalk.yellow(`Warning: Could not fetch bot info: ${e.message}`));
            }

            const botInfo = {
                uid: uid,
                name: realName,
                botname: botname,
                prefix: botprefix,
                admins: [botadmin],
                username: username,
                password: password,
                thumbSrc: thumbSrc,
                profileUrl: profileUrl,
                created: new Date().toISOString()
            };

            bots.push(botInfo);
            fs.writeFileSync(usersPath, JSON.stringify({ bots: bots }, null, 2));

            dashboardUsers.users.push({ username, password, created: new Date().toISOString() });
            fs.writeFileSync(dashboardUsersPath, JSON.stringify(dashboardUsers, null, 2));

            console.log(chalk.green(`✓ Bot created: ${realName} (${uid})`));

            await startBot(api, botInfo);

            res.json({ 
                data: 'Bot created and started successfully',
                botid: uid,
                token: Buffer.from(`${username}:${password}`).toString('base64')
            });
        });

    } catch (error) {
        console.error(chalk.red(`Error creating bot: ${error.message}`));
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/login', (req, res) => {
    try {
        const { username, password } = req.body;
        const dashboardUsers = JSON.parse(fs.readFileSync(dashboardUsersPath, 'utf-8'));

        const user = dashboardUsers.users.find(u => u.username === username && u.password === password);

        if (user) {
            const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
            const bot = usersData.bots.find(b => b.username === username);

            if (bot) {
                res.json({ 
                    token: Buffer.from(`${username}:${password}`).toString('base64'),
                    botid: bot.uid
                });
            } else {
                res.status(401).json({ error: 'Bot not found' });
            }
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.post('/api/create-bot', async (req, res) => {
    try {
        const { appstate, botname, botprefix, botadmin, username, password } = req.body;

        if (!appstate || !botname || !botprefix || !botadmin || !username || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const dashboardUsers = JSON.parse(fs.readFileSync(dashboardUsersPath, 'utf-8'));
        if (dashboardUsers.users.find(u => u.username === username)) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        let appstateData;
        try {
            appstateData = JSON.parse(appstate);
        } catch (e) {
            return res.status(400).json({ error: 'Invalid appstate format' });
        }

        const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
        let bots = usersData.bots || [];

        console.log(chalk.blue(`Attempting login for ${botname}...`));

        login({ appState: appstateData }, config.loginoptions || {
            online: true,
            updatePresence: true,
            selfListen: false,
            autoMarkRead: true
        }, async (err, api) => {
            if (err) {
                console.error(chalk.red(`Login failed: ${err.error || err}`));
                return res.status(400).json({ error: 'Facebook login failed. Check your appstate.' });
            }

            const uid = api.getCurrentUserID();

            const existingBotWithUID = bots.find(b => b.uid === uid);
            if (existingBotWithUID) {
                api.logout();
                return res.status(400).json({ error: 'This Facebook account is already registered. Each account can only be used once.' });
            }

            const existingBotWithUsername = bots.find(b => b.username === username);
            if (existingBotWithUsername) {
                api.logout();
                return res.status(400).json({ error: 'Username already taken. Please choose a different username.' });
            }

            if (global.client.accounts.has(uid)) {
                api.logout();
                return res.status(400).json({ error: 'This bot is already running. Please stop it first.' });
            }

            const statesDir = path.join(__dirname, 'states');
            if (!fs.existsSync(statesDir)) {
                fs.mkdirSync(statesDir, { recursive: true });
            }
            const statePath = path.join(statesDir, `${uid}.json`);
            fs.writeFileSync(statePath, JSON.stringify(appstateData, null, 2));
            console.log(chalk.green(`✓ Saved appstate for bot: ${uid}`));

            let realName = botname;
            let thumbSrc = `https://graph.facebook.com/${uid}/picture?width=720&height=720&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
            let profileUrl = `https://www.facebook.com/profile.php?id=${uid}`;

            try {
                const botData = await new Promise((resolve, reject) => {
                    api.getBotInitialData((err, data) => {
                        if (err) reject(err);
                        else resolve(data);
                    });
                });

                if (botData && !botData.error) {
                    realName = botData.name || botname;
                    thumbSrc = botData.thumbSrc || thumbSrc;
                    profileUrl = `https://www.facebook.com/profile.php?id=${uid}`;
                    console.log(chalk.green(`✓ Fetched bot info: ${realName}`));
                } else {
                    console.log(chalk.yellow(`Warning: Using fallback bot info`));
                }
            } catch (e) {
                console.error(chalk.yellow(`Warning: Could not fetch bot info: ${e.message}`));
            }

            const botInfo = {
                uid: uid,
                name: realName,
                botname: botname,
                prefix: botprefix,
                admins: [botadmin],
                username: username,
                password: password,
                thumbSrc: thumbSrc,
                profileUrl: profileUrl,
                created: new Date().toISOString()
            };

            bots.push(botInfo);
            fs.writeFileSync(usersPath, JSON.stringify({ bots: bots }, null, 2));

            dashboardUsers.users.push({ username, password, created: new Date().toISOString() });
            fs.writeFileSync(dashboardUsersPath, JSON.stringify(dashboardUsers, null, 2));

            console.log(chalk.green(`✓ Bot created: ${realName} (${uid})`));

            await startBot(api, botInfo);

            res.json({ 
                success: true, 
                message: 'Bot created and started successfully',
                bot: botInfo
            });
        });

    } catch (error) {
        console.error(chalk.red(`Error creating bot: ${error.message}`));
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/bot/:uid', async (req, res) => {
    try {
        const uid = req.params.uid;
        console.log(chalk.yellow(`Deleting bot: ${uid}`));

        const botAccount = global.client.accounts.get(uid);
        if (botAccount) {
            if (botAccount.stopListening && typeof botAccount.stopListening === 'function') {
                try {
                    botAccount.stopListening();
                    console.log(chalk.yellow(`Stopped listener for bot: ${uid}`));
                } catch (err) {
                    console.error(chalk.red(`Error stopping listener: ${err.message}`));
                }
            }

            if (botAccount.api && typeof botAccount.api.logout === 'function') {
                try {
                    botAccount.api.logout();
                    console.log(chalk.yellow(`Logged out bot: ${uid}`));
                } catch (err) {
                    console.error(chalk.red(`Error logging out: ${err.message}`));
                }
            }
        }

        global.client.accounts.delete(uid);

        const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
        const bot = usersData.bots.find(b => b.uid === uid);
        const bots = usersData.bots.filter(b => b.uid !== uid);
        fs.writeFileSync(usersPath, JSON.stringify({ bots: bots }, null, 2));

        if (bot && bot.username) {
            const dashboardUsersPath = path.join(__dirname, 'config/dashboard_users.json');
            if (fs.existsSync(dashboardUsersPath)) {
                const dashboardUsers = JSON.parse(fs.readFileSync(dashboardUsersPath, 'utf-8'));
                dashboardUsers.users = dashboardUsers.users.filter(u => u.username !== bot.username);
                fs.writeFileSync(dashboardUsersPath, JSON.stringify(dashboardUsers, null, 2));
            }
        }

        const statePath = path.join(__dirname, `states/${uid}.json`);
        if (fs.existsSync(statePath)) {
            fs.unlinkSync(statePath);
        }

        console.log(chalk.green(`✓ Bot deleted: ${uid}`));
        res.json({ success: true, message: 'Bot stopped and deleted successfully' });
    } catch (error) {
        console.error(chalk.red(`Error deleting bot: ${error.message}`));
        res.status(500).json({ error: 'Failed to delete bot' });
    }
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'raza/public/profile.html'));
});

app.post('/profile', (req, res) => {
    try {
        const { botid } = req.body;
        const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
        const bot = usersData.bots.find(b => b.uid === botid);

        if (bot) {
            res.json({
                uid: bot.uid,
                name: bot.name,
                thumbSrc: bot.thumbSrc,
                profileUrl: bot.profileUrl,
                botname: bot.botname,
                botprefix: bot.prefix,
                admins: bot.admins.length
            });
        } else {
            res.status(404).json({ error: 'Bot not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to load profile' });
    }
});

app.post('/configure', async (req, res) => {
    try {
        const { botId, content, type } = req.body;
        const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
        const botIndex = usersData.bots.findIndex(b => b.uid === botId);

        if (botIndex === -1) {
            return res.status(404).json({ error: 'Bot not found' });
        }

        if (type === 'botname') {
            usersData.bots[botIndex].botname = content;
            fs.writeFileSync(usersPath, JSON.stringify(usersData, null, 2));
            return res.json({ data: 'Bot name updated successfully' });
        }

        if (type === 'prefix') {
            usersData.bots[botIndex].prefix = content;
            fs.writeFileSync(usersPath, JSON.stringify(usersData, null, 2));

            const botAccount = global.client.accounts.get(botId);
            if (botAccount) {
                botAccount.info.prefix = content;
            }

            return res.json({ data: 'Bot prefix updated successfully' });
        }

        if (type === 'admin') {
            if (!usersData.bots[botIndex].admins.includes(content)) {
                usersData.bots[botIndex].admins.push(content);
                fs.writeFileSync(usersPath, JSON.stringify(usersData, null, 2));

                const botAccount = global.client.accounts.get(botId);
                if (botAccount) {
                    botAccount.info.admins = usersData.bots[botIndex].admins;
                }

                return res.json({ data: 'Admin added successfully' });
            } else {
                return res.json({ error: 'Admin already exists' });
            }
        }

        if (type === 'logout') {
            return res.json({ data: 'Logged out successfully' });
        }

        res.status(400).json({ error: 'Invalid configuration type' });
    } catch (error) {
        res.status(500).json({ error: 'Configuration failed' });
    }
});

app.post('/logout', async (req, res) => {
    try {
        const { botid } = req.body;

        const botAccount = global.client.accounts.get(botid);
        if (botAccount) {
            if (botAccount.stopListening) {
                botAccount.stopListening();
            }
            if (botAccount.api && typeof botAccount.api.logout === 'function') {
                botAccount.api.logout();
            }
        }

        global.client.accounts.delete(botid);
        global.client.onlines = global.client.onlines.filter(b => b.uid !== botid);

        const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
        const bot = usersData.bots.find(b => b.uid === botid);
        const bots = usersData.bots.filter(b => b.uid !== botid);
        fs.writeFileSync(usersPath, JSON.stringify({ bots: bots }, null, 2));

        if (bot) {
            const dashboardUsers = JSON.parse(fs.readFileSync(dashboardUsersPath, 'utf-8'));
            dashboardUsers.users = dashboardUsers.users.filter(u => u.username !== bot.username);
            fs.writeFileSync(dashboardUsersPath, JSON.stringify(dashboardUsers, null, 2));
        }

        const statePath = path.join(__dirname, `states/${botid}.json`);
        if (fs.existsSync(statePath)) {
            fs.unlinkSync(statePath);
        }

        res.json({ data: 'Bot deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete bot' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'raza/public/main/index.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'raza/public/notFound.html'));
});

async function startBot(api, botInfo) {
    try {
        console.log(chalk.blue(`Starting bot: ${botInfo.name}`));

        const existingBot = global.client.accounts.get(botInfo.uid);
        if (existingBot) {
            console.log(chalk.yellow(`⚠ Bot ${botInfo.name} (${botInfo.uid}) is already running, stopping old instance...`));
            if (existingBot.stopListening) {
                try {
                    existingBot.stopListening();
                } catch (err) {
                    console.error(chalk.red(`Error stopping old listener: ${err.message}`));
                }
            }
            global.client.accounts.delete(botInfo.uid);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (global.client.commands.size === 0 || global.client.events.size === 0) {
            console.log(chalk.yellow(`⚠ Commands/events empty, reloading...`));
            const { commands, events } = loader.loadAll();
            global.client.commands = commands;
            global.client.events = events;
        }

        const stopListening = api.listenMqtt(async (err, event) => {
            if (err) {
                console.error(chalk.red(`Listen error for ${botInfo.name}:`, err));
                return;
            }

            const botConfig = {
                ...global.config,
                prefix: botInfo.prefix,
                botName: botInfo.botname,
                adminUIDs: botInfo.admins
            };

            await listen.handleEvent(api, event, global.client.commands, global.client.events, botConfig);
        });

        global.client.accounts.set(botInfo.uid, {
            api: api,
            info: botInfo,
            stopListening: stopListening,
            startTime: Date.now()
        });

        global.client.onlines = global.client.onlines.filter(b => b.uid !== botInfo.uid);
        global.client.onlines.push({
            uid: botInfo.uid,
            name: botInfo.name,
            botname: botInfo.botname
        });

        console.log(chalk.green(`✓ Bot started: ${botInfo.name} (${botInfo.uid})`));
    } catch (error) {
        console.error(chalk.red(`Failed to start bot: ${error.message}`));
    }
}

async function loadExistingBots() {
    try {
        const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
        const bots = usersData.bots || [];

        console.log(chalk.blue(`\nLoading ${bots.length} existing bot(s)...\n`));

        for (const bot of bots) {
            const statePath = path.join(__dirname, `states/${bot.uid}.json`);

            if (!fs.existsSync(statePath)) {
                console.log(chalk.yellow(`⚠ Skipping ${bot.name}: No appstate file found`));
                continue;
            }

            const appstateData = JSON.parse(fs.readFileSync(statePath, 'utf-8'));

            login({ appState: appstateData }, config.loginoptions || {
                online: true,
                updatePresence: true,
                selfListen: false,
                autoMarkRead: true
            }, async (err, api) => {
                if (err) {
                    console.error(chalk.red(`✗ Login failed for ${bot.name}: ${err.error || err}`));
                    return;
                }

                await startBot(api, bot);
            });
        }
    } catch (error) {
        console.error(chalk.red(`Error loading bots: ${error.message}`));
    }
}

async function startSystem() {
    try {
        console.log(chalk.blue('\nLoading commands and events...\n'));
        const { commands, events } = loader.loadAll();
        global.client.commands = commands;
        global.client.events = events;
        console.log(chalk.green(`✓ Loaded ${commands.size} commands and ${events.size} events\n`));

        await new Promise((resolve, reject) => {
            const server = app.listen(PORT, "0.0.0.0", async () => {
                console.log(chalk.green(`\n✓ Dashboard running on http://0.0.0.0:${PORT}`));
                console.log(chalk.cyan(`✓ Access dashboard at: http://localhost:${PORT}\n`));

                await loadExistingBots();

                console.log(chalk.magenta.bold(`\n✓ RK Premium Bot System Ready!\n`));
                resolve();
            });

            server.on('error', reject);
        });
    } catch (error) {
        console.error(chalk.red(`Failed to start system: ${error.message}`));
        process.exit(1);
    }
}

process.on('unhandledRejection', (error) => {
    console.error(chalk.red('Unhandled promise rejection:'), error);
});

process.on('uncaughtException', (error) => {
    console.error(chalk.red('Uncaught exception:'), error);
    process.exit(1);
});

process.on('SIGINT', async () => {
    console.log(chalk.yellow('\n\nShutting down gracefully...'));
    
    // Stop all bot listeners before exit
    for (const [uid, botAccount] of global.client.accounts.entries()) {
        if (typeof botAccount.stopListening === 'function') {
            try {
                botAccount.stopListening();
                console.log(chalk.yellow(`✓ Stopped listener for bot: ${uid}`));
            } catch (err) {
                console.error(chalk.red(`Error stopping listener: ${err.message}`));
            }
        }
    }
    
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log(chalk.yellow('\n\nShutting down gracefully...'));
    
    // Stop all bot listeners before exit
    for (const [uid, botAccount] of global.client.accounts.entries()) {
        if (typeof botAccount.stopListening === 'function') {
            try {
                botAccount.stopListening();
                console.log(chalk.yellow(`✓ Stopped listener for bot: ${uid}`));
            } catch (err) {
                console.error(chalk.red(`Error stopping listener: ${err.message}`));
            }
        }
    }
    
    process.exit(0);
});

startSystem();