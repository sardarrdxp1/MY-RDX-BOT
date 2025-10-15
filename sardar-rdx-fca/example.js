const { login } = require('./module/index');

console.log('╔════════════════════════════════════════╗');
console.log('║   Kashif Raza FCA - Example Usage     ║');
console.log('╚════════════════════════════════════════╝\n');

console.log('✅ FCA Module loaded successfully!');
console.log('📦 Package: kashif-raza-fca v1.0.0');
console.log('👤 Author: Kashif Raza\n');

console.log('📚 Available Features:');
console.log('  • Message Editing');
console.log('  • Typing Indicators');
console.log('  • Thread Management');
console.log('  • User Management');
console.log('  • Message Reactions');
console.log('  • File Attachments');
console.log('  • Group Management');
console.log('  • Friend Management');
console.log('  • Post Interactions');
console.log('  • And many more!\n');

console.log('💡 Usage Example:');
console.log(`
const { login } = require('kashif-raza-fca');

login({ appState: [...] }, (err, api) => {
  if (err) return console.error(err);
  
  // Send message
  api.sendMessage('Hello!', threadID);
  
  // Edit message
  api.editMessage('Updated text', messageID);
  
  // Get user info
  api.getUserInfo(userID, (err, info) => {
    console.log(info);
  });
  
  // Listen for messages
  api.listenMqtt((err, message) => {
    if (err) return console.error(err);
    console.log(message);
  });
});
`);

console.log('✨ All features have been merged successfully!');
console.log('🚀 Kashif Raza FCA is ready to use!\n');

console.log('📋 Full API methods available:');

const fs = require('fs');
const path = require('path');

const apiPath = path.join(__dirname, 'src', 'deltas', 'apis');
const folders = ['messaging', 'threads', 'users', 'posting', 'mqtt', 'extra', 'http', 'login'];

folders.forEach(folder => {
  const folderPath = path.join(apiPath, folder);
  if (fs.existsSync(folderPath)) {
    const files = fs.readdirSync(folderPath)
      .filter(f => f.endsWith('.js') && !f.includes('Old') && !f.includes('Deprecated'))
      .map(f => `  • ${f.replace('.js', '')}`)
      .join('\n');
    if (files) {
      console.log(`\n📁 ${folder.toUpperCase()}:`);
      console.log(files);
    }
  }
});

console.log('\n✅ Setup complete! Ready for integration.');
console.log('🎉 Created by Kashif Raza\n');
