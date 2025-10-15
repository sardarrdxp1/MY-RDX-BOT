
const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../config/config.json");

function saveConfig(config) {
    try {
        const currentConfig = JSON.parse(fs.readFileSync(configPath, "utf8"));
        Object.assign(currentConfig, config);
        fs.writeFileSync(configPath, JSON.stringify(currentConfig, null, 2));
        return true;
    } catch (error) {
        console.error("Error saving config:", error);
        return false;
    }
}

function getConfig() {
    try {
        return JSON.parse(fs.readFileSync(configPath, "utf8"));
    } catch (error) {
        console.error("Error reading config:", error);
        return null;
    }
}

module.exports = {
    saveConfig,
    getConfig
};
