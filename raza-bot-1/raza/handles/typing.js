
module.exports = {
    async handle({ api, event, config }) {
        console.log("Typing:", event.isTyping ? "typing..." : "stopped typing");
    }
};
