# Overview

RK Premium Bot is a Facebook Messenger bot built on top of the Kashif Raza FCA (Facebook Chat API) library. The bot provides a modular command and event system, allowing developers to add custom commands in `modules/cmds/` and event handlers in `modules/events/`. It includes a premium web dashboard for creating, managing, and monitoring multiple bot instances, accessible via Express on port 5000.

The bot uses Facebook's appState authentication (session cookies only) to log in securely without storing any credentials, and communicates with Facebook Messenger through MQTT for real-time message handling.

# Recent Changes

**October 2, 2025 (Latest)**
- **Command/Event Loading Optimization**: Changed system to load all commands and events ONCE at startup (before any bot creation), matching the ryk bot architecture. Previously loaded per-bot, now loads at system initialization for better performance and consistency.
- **Added Defensive Guards**: Implemented fallback mechanism in `startBot()` to reload commands/events if they're unexpectedly empty, ensuring system resilience.
- **Fixed FCA Library Issues**: Resolved duplicate code error in `getBotInitialData.js` and improved error handling in `listenMqtt.js` to prevent crashes when bot metadata is unavailable.
- Dashboard correctly displays original Facebook bot name and profile picture using `api.getBotInitialData()`.

**October 2, 2025**
- Restructured runner system: `index.js` now supervises `raza.js` as the main bot runner
- Created new RK Premium Bot dashboard with HTML-only responsive design
- Added multi-bot creation and management features to dashboard
- Imported economy commands from rv5 (balance, slot, work, wiki)
- Fixed critical security issue: removed unused username/password storage, system now only requires appState for bot creation
- Cleaned up unnecessary files and deprecated workflows

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Authentication & Session Management

**Problem**: Need to authenticate with Facebook securely without storing credentials.

**Solution**: Uses appState-based authentication only. Users provide their Facebook session cookies (appState JSON) via the dashboard, which are stored in `states/{uid}.json` and tracked in `config/users.json`. No usernames or passwords are ever stored.

**Rationale**: This approach eliminates credential storage risks entirely. The appState contains only session tokens that can be invalidated by Facebook, and bypasses Facebook's anti-bot detection for traditional logins. The Kashif Raza FCA library handles the underlying MQTT connection and session maintenance.

**Bot Creation Process**:
1. User provides appState JSON via dashboard
2. System validates appState by attempting Facebook login
3. If successful, appState is saved to `states/{uid}.json`
4. Bot metadata (name, prefix, admin UID) is stored in `config/users.json`
5. Bot automatically starts and connects to Facebook Messenger

## Modular Command System

**Problem**: Need an extensible way to add bot commands without modifying core code.

**Solution**: Commands are stored as individual JavaScript modules in `modules/cmds/`. Each command exports a `config` object (with `name`, `description`, and `adminOnly` flag) and a `run` function. The loader (`raza/loader.js`) dynamically imports all command files and stores them in a Map for fast lookup.

**Pros**: 
- Easy to add new commands by creating new files
- Commands are isolated and don't affect each other
- Hot-reloading support is possible

**Cons**:
- No built-in command dependency management
- Requires consistent module structure across all commands

## Event Handling System

**Problem**: Need to respond to various Facebook Messenger events (joins, leaves, reactions, etc.).

**Solution**: Event modules in `modules/events/` export a `config` and `run` function. The main listener (`raza/listen.js`) routes incoming Facebook events to specialized handlers in `raza/handles/`, which then invoke relevant event modules.

**Rationale**: Separating event types into handlers keeps the codebase organized and makes it easy to extend with new event types without touching the core listener.

## Message Routing & Handlers

**Problem**: Different event types (messages, reactions, unsends, etc.) require different processing logic.

**Solution**: The `raza/handles/` directory contains specialized handler modules for each event type. The main listener delegates events to the appropriate handler based on `event.type`.

**Event Flow**:
1. MQTT listener receives event from Facebook
2. `listen.js` determines event type
3. Appropriate handler in `raza/handles/` processes the event
4. Event modules in `modules/events/` are triggered if applicable
5. For messages starting with the prefix, command modules are executed

**Pros**:
- Clean separation of concerns
- Easy to debug specific event types
- Handlers can be modified independently

## Configuration Management

**Problem**: Need persistent storage for bot settings, admin lists, and multiple bot instances.

**Solution**: Uses JSON files in `config/` and `states/` directories:
- `config/config.json`: Global bot settings (prefix, name, admin UIDs, premium flag)
- `config/users.json`: Array of bot instances with metadata (uid, name, prefix, admins, creation date)
- `states/{uid}.json`: Individual appState files per bot (session cookies)
- `data/`: User economy data (balance, transactions, etc.)

**Bot Structure in users.json**:
```json
{
  "bots": [
    {
      "uid": "100000000000000",
      "name": "Bot Display Name",
      "botname": "CustomBotName",
      "prefix": "/",
      "admins": ["100000000000001"],
      "thumbSrc": "https://graph.facebook.com/.../picture",
      "profileUrl": "https://facebook.com/...",
      "created": "2025-10-02T08:00:00.000Z"
    }
  ]
}
```

**Rationale**: Separating appState files by UID prevents cross-contamination and allows easy bot removal. JSON files are simple, human-readable, and don't require a database for multi-bot deployments. Atomic writes prevent corruption during concurrent operations.

## MQTT Communication Layer

**Problem**: Need real-time bidirectional communication with Facebook Messenger.

**Solution**: The Kashif Raza FCA library establishes an MQTT connection to Facebook's servers. The bot subscribes to topics like `/legacy_web`, `/messaging_events`, and `/orca_typing_notifications` to receive events, and publishes messages to `/ls_req` for sending.

**Key Components**:
- `listenMqtt.js`: Main MQTT event listener
- `sendMessageMqtt.js`: Sends messages via MQTT
- `setMessageReactionMqtt.js`: Handles reactions via MQTT

**Pros**:
- Low latency for message delivery
- Persistent connection reduces overhead
- Supports real-time features like typing indicators

**Cons**:
- MQTT connection can drop and requires reconnection logic
- Facebook's MQTT protocol is undocumented and subject to change

## Web Dashboard (RK Premium Bot)

**Problem**: Need a way to create, manage, and monitor multiple bot instances without terminal access.

**Solution**: Express.js serves a premium dashboard from `raza/public/dashboard.html` with full bot lifecycle management:
- **Bot Creation**: Form to add new bots with appState, name, prefix, and admin UID
- **Bot Management**: View all bots with status indicators (online/offline)
- **Bot Control**: Delete bots individually
- **Command Browser**: View all available bot commands
- **Responsive Design**: HTML-only with inline styles, works on all devices

**Technical Implementation**:
- Uses RESTful API endpoints (`/api/bots`, `/api/create-bot`, `/api/delete-bot`) for bot operations
- Real-time status updates by checking `global.client.accounts` Map
- Validates appState by attempting Facebook login before storing
- Client-side JavaScript with SweetAlert2 for user-friendly notifications

**Rationale**: A comprehensive dashboard enables non-technical users to manage bots easily while maintaining security by never storing credentials. The HTML-only design ensures maximum compatibility and eliminates CSS dependencies.

## Permission System

**Problem**: Need to restrict certain commands to authorized users.

**Solution**: Commands can set `adminOnly: true` in their config. The message handler checks if the sender's UID is in `config.adminUIDs` before executing. Admin management commands (`addadmin`, `onlyadmin`) allow runtime modification of the admin list.

**Rationale**: Simple UID-based authorization is adequate for small bot deployments. More complex role systems would add unnecessary overhead.

## Group Approval Workflow

**Problem**: Need to prevent bot spam by requiring manual approval for group chats.

**Solution**: When `pendingApproval: true`, new groups are added to `config.pendingGroups`. Admins use the `/approve` command to move groups to `config.approvedGroups`. The bot ignores messages from pending groups.

**Rationale**: Manual approval prevents abuse while keeping the approval process transparent and auditable via the config file.

## Locking Mechanisms

**Problem**: Group admins might want to prevent non-bot-admins from changing group settings.

**Solution**: Event modules like `groupNameLock`, `themeLock`, and `emojiLock` listen for change events and revert them if the initiator is not a bot admin. The bot stores locked values in config and compares against incoming changes.

**Pros**:
- Protects group settings from unauthorized changes
- Works transparently without user intervention

**Cons**:
- Requires bot to be a group admin to revert changes
- May conflict with Facebook's rate limits if many changes occur

# External Dependencies

## Facebook Chat API (Kashif Raza FCA)

A custom fork of the Facebook Chat API that handles authentication, MQTT communication, and message formatting. Located in `kashif-raza-fca-main/`, this library is the core of the bot's interaction with Facebook.

**Key Features**:
- AppState-based authentication
- MQTT connection management
- Message sending/receiving APIs
- GraphQL queries for user/thread info

## npm Packages

- **express**: Web server for the dashboard
- **axios**: HTTP client for API requests
- **tough-cookie**: Cookie jar management for authentication
- **mqtt**: MQTT client for real-time messaging
- **websocket-stream**: WebSocket support for MQTT over WS
- **cheerio**: HTML parsing for scraping Facebook pages
- **chalk**: Terminal color formatting for logs
- **gradient-string**: Styled console output
- **node-cron**: Scheduled tasks (not actively used in current codebase)
- **lodash**: Utility functions
- **jsonpath-plus**: JSON querying for complex data structures

## Facebook APIs

- **MQTT Endpoint**: `wss://edge-chat.facebook.com/chat` - Real-time messaging
- **GraphQL API**: Used for fetching thread info, user data, and performing actions like pinning messages
- **Upload API**: `https://upload.facebook.com/ajax/mercury/upload.php` - Attachment uploads
- **HTTP API**: Various endpoints for legacy actions (logout, mark as read, etc.)

## Runtime Requirements

- **Node.js**: >=22.x required (specified in package.json)
- **Port 5000**: Used by the Express dashboard (configurable via `process.env.PORT`)
- **Main Runner**: `raza.js` (supervised by `index.js`)
- **Required Directories**: `config/`, `states/`, `modules/cmds/`, `modules/events/`, `data/`, `bots/`

## Project Structure

```
├── index.js                    # Supervisor process (spawns raza.js)
├── raza.js                     # Main bot runner with dashboard
├── config/
│   ├── config.json            # Global settings
│   └── users.json             # Bot instances metadata
├── states/
│   └── {uid}.json             # AppState files per bot
├── modules/
│   ├── cmds/                  # Command modules
│   └── events/                # Event modules
├── raza/
│   ├── public/
│   │   └── dashboard.html     # RK Premium Bot dashboard
│   ├── loader.js              # Module loader
│   ├── listen.js              # Main event listener
│   └── handles/               # Event type handlers
├── data/                      # User economy data
└── kashif-raza-fca-main/      # Facebook Chat API library
```