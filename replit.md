# Overview

This is a Facebook Messenger chatbot built with Node.js that provides automated responses, moderation features, and various interactive commands. The bot uses a custom Facebook Chat API implementation (kashif-raza-fca) to interact with Facebook Messenger groups and users. It's designed to provide entertainment, utility features, and group management capabilities with a focus on multilingual support (English and Urdu/Hindi).

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Core Bot Framework

**Problem**: Need a robust event-driven architecture to handle Facebook Messenger interactions and command execution.

**Solution**: Implemented a global client object that manages commands, events, cooldowns, and various handler registries. The main entry point (`Priyansh.js`) initializes the bot and loads all modules dynamically.

**Key Components**:
- Global client object stores command maps, event handlers, and state
- Dynamic module loading from the `Priyansh/commands` directory
- Event-driven architecture with separate handlers for messages, reactions, and scheduled tasks
- Time utilities using moment-timezone for Asia/Kolkata timezone

**Pros**: Modular, scalable, easy to add new commands
**Cons**: Heavy reliance on global state

## Authentication & Session Management

**Problem**: Need to maintain persistent Facebook login sessions.

**Solution**: Uses appstate.json file to store authentication cookies and session data. The custom FCA module handles login and session persistence.

**Key Decisions**:
- Cookie-based authentication through appstate.json
- Optional 2FA support via configuration
- Auto-login capability to maintain session
- Session refresh mechanisms to prevent disconnection

**Alternatives Considered**: OAuth tokens (rejected due to Facebook API limitations for unofficial bots)

## Command System

**Problem**: Need a flexible way to register and execute user commands with proper permissions and cooldowns.

**Solution**: File-based command system where each command is a separate module with config and run methods.

**Architecture**:
- Each command exports a config object (name, version, permissions, category, cooldowns)
- Commands stored in `Priyansh/commands` directory
- Support for command categories, permission levels (0=user, 1=group admin, 2=bot admin)
- Built-in cooldown management
- No-prefix commands for natural language interactions

**Pros**: Easy to extend, clear separation of concerns
**Cons**: File system dependent, no hot-reloading

## Event Handling System

**Problem**: Need to respond to various Facebook events (messages, joins, leaves, reactions).

**Solution**: Dual handler system with both command-based and event-based listeners.

**Components**:
- handleEvent functions in command modules for no-prefix triggers
- Dedicated event handlers for group changes
- Reaction handlers for interactive features
- Reply handlers for multi-step interactions

## Data Storage

**Problem**: Need to persist user data, thread settings, and bot configuration.

**Solution**: Hybrid approach using JSON files and SQLite database.

**Storage Layers**:
- config.json for bot configuration
- SQLite database for user/thread data (configurable in DATABASE settings)
- JSON files in cache directory for temporary data
- Thread-specific data maps in memory

**Rationale**: Simple deployment, no external database required for basic functionality, but supports SQLite for structured data needs.

## Auto-Features System

**Problem**: Provide automated responses and scheduled tasks without manual intervention.

**Solution**: Multiple auto-feature modules that hook into the event system.

**Features Implemented**:
- Auto-react to specific keywords
- Auto-mention for tagging users
- Auto-seen message acknowledgment
- Scheduled auto-send messages (using node-schedule)
- Auto-setname for new members
- Auto-reset at specific times

## Media Handling

**Problem**: Handle image/video uploads, downloads, and processing.

**Solution**: Temporary cache directory system with streaming downloads.

**Implementation**:
- Downloads stored in `cache` directory
- Automatic cleanup after sending
- Canvas-based image manipulation for meme generation
- Support for external media APIs

## Moderation & Security

**Problem**: Prevent spam, abuse, and unauthorized access.

**Solution**: Multi-layered security system.

**Features**:
- User ban system with reason tracking
- Thread ban capabilities
- Auto-ban for profanity/spam
- Anti-join to prevent unwanted members
- Anti-out to prevent member removals
- Anti-robbery to protect admin roles
- Approval system for groups

## Web Dashboard (Uptime Monitor)

**Problem**: Need a way to keep the bot alive on cloud platforms and provide status monitoring.

**Solution**: Express server serving a simple HTML page.

**Implementation**:
- Runs on port 8080 (configurable via PORT env variable)
- Serves index.html for uptime monitoring services
- Separate from bot logic to avoid blocking

**Rationale**: Cloud platforms like Replit require an HTTP endpoint; this provides that while keeping bot logic separate.

# External Dependencies

## Facebook Chat API (kashif-raza-fca)

**Purpose**: Custom implementation of Facebook Chat API for unofficial bot access

**Integration**: Located in `kashif-raza-fca` directory, provides login and messaging capabilities

**Key Features**: Message editing, typing indicators, thread management, MQTT listening

## NPM Packages

### Core Dependencies
- **axios**: HTTP client for API requests
- **moment-timezone**: Time/date handling (Asia/Kolkata timezone)
- **express**: Web server for uptime monitoring
- **fs-extra**: Enhanced file system operations
- **node-schedule**: Cron-like task scheduling

### Media & Processing
- **canvas**: Image manipulation and meme generation
- **jimp**: Additional image processing
- **cheerio**: HTML parsing for web scraping
- **axios-cookiejar-support**: Cookie management for requests

### Utilities
- **chalk**: Terminal output formatting
- **lodash**: Utility functions
- **node-fetch**: HTTP fetching
- **form-data**: Multipart form handling

### Bot-Specific
- **priyansh-all-dl**: Media downloader (latest version)
- **nayan-videos-downloader**: Video download utilities
- **ping-monitor**: Service monitoring
- **mqtt**: Message queue for Facebook real-time events

## External APIs

- **OpenAI API**: AI chat responses (GPT integration)
- **Google APIs**: Search and YouTube functionality
- **Random Image APIs**: Anime images, memes, etc.
- **Pastebin API**: Code sharing functionality
- **Various social media downloaders**: TikTok, Instagram, Facebook video downloads

## Database

**Type**: SQLite (configurable)

**Location**: Specified in config.json under DATABASE.sqlite.storage

**Purpose**: Store user data, thread settings, currency/economy data

**Note**: Application uses configurable database type - can be extended to support other databases through the models layer.