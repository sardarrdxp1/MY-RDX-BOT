# Facebook Messenger Bot - Priyansh Bot

## Overview
This is a Facebook Messenger bot built with Node.js that responds to commands and events in Facebook groups and messages. The bot uses the `kashif-raza-fca` package for Facebook connection and supports 106+ commands and 10+ events.

## Current Status
- **Bot Status**: ✅ Running
- **Commands**: 106 loaded successfully
- **Events**: 10 loaded successfully
- **Connection**: MQTT connected via kashif-raza-fca
- **Database**: SQLite connected

## Recent Changes

### October 8, 2025
- **Fixed kashif-raza-fca package login issues**
  - Added proper error handling and logging
  - Fixed appstate saving mechanism
  - Removed excessive debug logs
  
- **Fixed missing `checkBan` function**
  - Created checkBan function in loginHelper.js to prevent bot exit after login
  
- **Fixed utility dependencies**
  - Created `utils/formatter.js` with formatting functions
  - Fixed multiple command dependencies on formatter
  
- **Fixed music and video commands**
  - Removed duplicate code in video.js
  - Added proper error handling for file sending
  - Added logging for successful file transfers
  - Improved progress update error handling
  - Extended cleanup timeout to 5 seconds
  
- **Fixed error logging**
  - Added actual error messages in handleCommandEvent.js
  - Commands now show specific error details

## Project Architecture

### Main Files
- `Priyansh.js` - Main bot entry point
- `config.json` - Bot configuration
- `appstate.json` - Facebook login session

### Directory Structure
```
/
├── Priyansh.js                    # Main bot file
├── config.json                    # Configuration
├── kashif-raza-fca/              # Facebook connection package
│   └── src/core/models/
│       └── loginHelper.js        # Login handling
├── Priyansh/
│   ├── commands/                 # Bot commands (106 files)
│   │   ├── music.js             # Music download command
│   │   ├── video.js             # Video download command
│   │   └── ...
│   └── events/                   # Bot events (10 files)
├── includes/
│   ├── handle/
│   │   ├── handleCommand.js     # Command handler
│   │   ├── handleCommandEvent.js # Event handler
│   │   └── ...
│   └── listen.js                # Message listener
└── utils/
    ├── log.js                   # Logging utility
    └── formatter.js             # Text formatting utility
```

### Key Commands
- `/music [song name]` - Download music from YouTube
- `/video [video name]` - Download video from YouTube
- `/help` - Show available commands
- `/admin` - Admin panel

## Known Issues

### Non-Critical Errors (Ignored)
- **Error 1545012**: Normal after FCA update, bot still works in those groups
- Some commands have syntax errors but are non-critical
- Canvas-dependent commands fail on Replit (trump, einstein, mark, tweet, yes)

### Fixed Issues
- ✅ Login issues with kashif-raza-fca
- ✅ checkBan function missing
- ✅ Music/Video file sending
- ✅ Error logging showing actual messages
- ✅ Missing formatter.js utility

## Configuration

### Environment Variables
None required (uses appstate.json for authentication)

### Database
- Type: SQLite
- Location: Auto-created by bot
- Purpose: User data, thread data, currencies

### FCA Options (config.json)
```json
{
  "selfListen": false,
  "listenEvents": true,
  "updatePresence": true,
  "forceLogin": true
}
```

## User Preferences
- Language: English/Urdu mix
- Debug mode: Disabled (minimal logging)
- Error handling: Comprehensive with proper error messages
- File cleanup: 5 seconds after sending

## Deployment Notes
- Bot runs via workflow: `node Priyansh.js`
- Auto-reconnects every ~30-50 minutes
- MQTT connection for message listening
- Appstate auto-saves on successful login

## Maintenance
- Regularly check for FCA package updates
- Monitor command error logs
- Clean cache folder periodically
- Update API endpoints if they fail
