const { formatMessage } = require('../../utils/formatter');

module.exports.config = {
        name: "system",
        version: "1.0.1",
        hasPermssion: 0,
        credits: "Kashif Raza",
        description: "View information about the hardware the bot is using",
        commandCategory: "System",
        cooldowns: 5,
        dependencies: {
                "systeminformation": "",
                "pidusage": ""
        }
};

function byte2mb(bytes) {
        const units = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        let l = 0, n = parseInt(bytes, 10) || 0;
        while (n >= 1024 && ++l) n = n / 1024;
        return `${n.toFixed(n < 10 && l > 0 ? 1 : 0)}${units[l]}`;
}

module.exports.run = async function ({ api, event }) {
        const timeStart = Date.now();

        try {
                const si = require("systeminformation");
                const pidusage = require("pidusage");
                
                const pidStats = await pidusage(process.pid);
                const cpuInfo = await si.cpu();
                const cpuTemp = await si.cpuTemperature();
                const cpuLoad = await si.currentLoad();
                const timeInfo = await si.time();
                const diskInfo = await si.diskLayout();
                const memInfo = await si.memLayout();
                const memStats = await si.mem();
                const osInfo = await si.osInfo();
                
                var disk = [], i = 1;

                var hours = Math.floor(timeInfo.uptime / (60 * 60));
                var minutes = Math.floor((timeInfo.uptime % (60 * 60)) / 60);
                var seconds = Math.floor(timeInfo.uptime % 60);
                if (hours < 10) hours = "0" + hours;
                if (minutes < 10) minutes = "0" + minutes;
                if (seconds < 10) seconds = "0" + seconds;

                for (const singleDisk of diskInfo) {
                        disk.push(
                                `==== DISK ${i++} ====\n` +
                                "Name: " + singleDisk.name + "\n" +
                                "Type: " + singleDisk.interfaceType + "\n" + 
                                "Size: " + byte2mb(singleDisk.size) + "\n" +
                                "Temperature: " + (singleDisk.temperature || "N/A") + "°C"
                        )
                }

                const message = 
                        "====== System Info ======\n" +
                        "==== CPU ====\n" +
                        "CPU Model: " + cpuInfo.manufacturer + " " + cpuInfo.brand + " " + cpuInfo.speedMax + "GHz\n" +
                        "Cores: " + cpuInfo.cores + "\n" +
                        "Threads: " + cpuInfo.physicalCores + "\n" +
                        "Temperature: " + (cpuTemp.main || "N/A") + "°C\n" +
                        "Load: " + cpuLoad.currentLoad.toFixed(1) + "%\n" +
                        "Node usage: " + pidStats.cpu.toFixed(1) + "%\n" +
                        "==== MEMORY ====\n" +
                        "Size: " + byte2mb(memInfo[0].size) +
                        "\nType: " + memInfo[0].type +
                        "\nTotal: " + byte2mb(memStats.total) +
                        "\nAvailable: " + byte2mb(memStats.available) +
                        "\nNode usage: " + byte2mb(pidStats.memory) + "\n" +
                        disk.join("\n") + "\n" +
                        "==== OS ====\n" +
                        "Platform: " + osInfo.platform +
                        "\nBuild: " + osInfo.build +
                        "\nUptime: " + hours + ":" + minutes + ":" + seconds +
                        "\nPing: " + (Date.now() - timeStart) + "ms";

                return api.sendMessage(
                        formatMessage(message),
                        event.threadID, event.messageID
                )
        }
        catch (e) {
                console.log(e);
                return api.sendMessage(
                        formatMessage("Error getting system information: " + e.message),
                        event.threadID, event.messageID
                );
        }
}
