# openclaw-xiaomi-home

[![Version](https://img.shields.io/badge/version-v1.0.2-blue.svg)](https://github.com/canmaxice-maker/openclaw-xiaomi-home)
[![ClawHub](https://img.shields.io/badge/ClawHub-openclaw--xiaomi--home-green.svg)](https://clawhub.com/openclaw-xiaomi-home)

**Control your Xiaomi smart home devices with plain English.** No apps, no switching, no pointing and clicking — just tell your AI assistant what you want and it handles it.

## The Problem It Solves

Controlling smart home devices is annoying:
- Open the Mi Home app
- Find the right room
- Find the right device
- Tap the right button
- Repeat for every single device

**This skill fixes that.** Once set up, you just say what you want:

```
"Turn on the living room light"
"Set AC to 26 degrees"
"Is the front door locked?"
"What's the temperature in the bedroom?"
```

And it's done — instantly, without touching your phone.

## What You Can Control

Everything Xiaomi/Mijia through the Xiaomi Home integration:

- 💡 **Lights** — turn on/off, adjust brightness
- ❄️ **Air Conditioning** — set temperature, mode, fan speed
- 🔐 **Door Locks** — lock/unlock from anywhere
- 🌡️ **Sensors** — temperature, humidity, motion, and more
- 💨 **Fans & Humidifiers** — on/off, speed control
- 🪟 **Blinds & Curtains** — open/close
- 🤖 **Robot Vacuums** — start, stop, return to charger

Works with **1837+ devices** via the official Xiaomi Home integration.

## Why It's Better

| Traditional | With This Skill |
|-------------|-----------------|
| Open app → find device → tap | One sentence |
| Can't control when not home | Through AI assistant from anywhere |
| One device at a time | Control multiple at once |
| Remember which app for which device | Just describe what you want |

## How It Works

```
You → "Turn on the living room light"
  ↓
OpenClaw AI (Nana)
  ↓
Home Assistant (your local server)
  ↓
Xiaomi Device
```

Everything stays **on your home network** after initial setup. No cloud dependency, no subscription.

## Installation

```bash
# ClawHub (recommended)
clawhub install openclaw-xiaomi-home

# Manual
git clone https://github.com/canmaxice-maker/openclaw-xiaomi-home.git
mv openclaw-xiaomi-home ~/.openclaw/skills/
```

## Setup (One Time)

### 1. Start Home Assistant

```bash
cd ~/.openclaw/skills/openclaw-xiaomi-home
docker compose up -d
```

Open http://localhost:8123 and create your account.

### 2. Add Your Xiaomi Devices

1. **Settings → Devices & Services → Add Integration**
2. Search **Xiaomi Home** → login with your Xiaomi account
3. Wait for devices to import

### 3. Create an Access Token

1. HA profile → **Long-Lived Access Tokens** → Create Token
2. Copy and save it

### 4. Connect the Control Server

```bash
cd ~/.openclaw/skills/openclaw-xiaomi-home/scripts/ha-mcp-server
npm install && cp .env.example .env
# Edit .env with your HA_URL and HA_TOKEN
```

### 5. Start and Test

```bash
launchctl load ~/.openclaw/skills/openclaw-xiaomi-home/scripts/ha-mcp-server/ai.openclaw.ha-mcp.plist

# Test
node src/call-tool.mjs ping_ha
```

## Usage

After setup, just talk to your AI assistant:

```
"Turn on the living room light"
"Set bedroom AC to 26 degrees"
"Is the front door locked?"
"What's the temperature?"
"Lock all doors"
"Turn off all lights"
"Open the blinds"
"Start the vacuum"
```

## Privacy

- **Local network only** — all control stays in your home
- **No cloud after setup** — Xiaomi cloud only for initial pairing
- **No data collection** — nothing is tracked or sent anywhere
- **Docker isolation** — Home Assistant runs in an isolated container

## Troubleshooting

### Home Assistant won't start
```bash
docker logs homeassistant
```

### Devices not showing up
- Make sure you're using the **China mainland** Xiaomi server in Mi Home
- Restart the homeassistant container

### Token not working
- Re-create the Long-Lived Access Token in HA
- Update `HA_TOKEN` in `.env`

## Credits

- [Home Assistant](https://www.home-assistant.io/)
- [ha_xiaomi_home](https://github.com/nickoowen/ha-xiaomi-home) integration
- [OpenClaw](https://openclaw.ai/) AI Agent framework

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| [v1.0.2](https://github.com/canmaxice-maker/openclaw-xiaomi-home/releases/tag/v1.0.2) | 2026-04-21 | Professional docs rewrite |
| [v1.0.1](https://github.com/canmaxice-maker/openclaw-xiaomi-home/releases/tag/v1.0.1) | 2026-04-21 | HA-MCP server refactor |
| [v1.0.0](https://github.com/canmaxice-maker/openclaw-xiaomi-home/releases/tag/v1.0.0) | 2026-04-21 | Initial release |

## License

MIT
