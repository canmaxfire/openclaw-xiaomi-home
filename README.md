# openclaw-xiaomi-home

[![Version](https://img.shields.io/badge/version-v1.0.1-blue.svg)](https://github.com/canmaxice-maker/openclaw-xiaomi-home)
[![ClawHub](https://img.shields.io/badge/ClawHub-openclaw--xiaomi--home-green.svg)](https://clawhub.com/openclaw-xiaomi-home)

Control Xiaomi/Mijia smart home devices via Home Assistant using natural language, powered by OpenClaw AI.

## What It Does

Use natural voice or text commands to control Xiaomi devices through Home Assistant — no app switching, no manual setup:

```
"Turn on the living room light"
"Set bedroom AC to 26 degrees"
"What's the current temperature?"
"Lock the front door"
"Is the door locked?"
"Turn off all lights"
```

## Features

| Feature | Description |
|---------|-------------|
| **Natural Language Control** | Control 1837+ Xiaomi devices via plain text or voice |
| **Full Device Coverage** | Lights, AC, fans, sensors, locks, switches, blinds, vacuums |
| **Local-Only** | All communication stays on your network — no cloud dependency |
| **Auto-Restart** | LaunchAgent keeps the MCP server running on macOS |
| **Docker-Based HA** | Home Assistant runs in Docker for easy setup |

## Architecture

```
OpenClaw → exec (node call-tool.mjs) → HA MCP HTTP Server → Home Assistant → Xiaomi Devices
                                                               ↑
                                                      ha_xiaomi_home
```

## Prerequisites

- macOS or Linux
- [Docker Desktop](https://docs.docker.com/desktop/setup/install/mac-install/)
- Xiaomi devices paired with Mi Home app (China mainland server)
- Home Assistant access token

## Installation

### Option 1: ClawHub (recommended)

```bash
clawhub install openclaw-xiaomi-home
```

### Option 2: Manual

```bash
git clone https://github.com/canmaxice-maker/openclaw-xiaomi-home.git
mv openclaw-xiaomi-home ~/.openclaw/skills/
```

## Setup

### 1. Start Home Assistant

```bash
cd ~/.openclaw/skills/openclaw-xiaomi-home
docker compose up -d
```

Open http://localhost:8123 and create your account.

### 2. Add Xiaomi Home Integration

1. **Settings → Devices & Services → Add Integration**
2. Search **Xiaomi Home** → login with Xiaomi account (China mainland server)
3. Wait for devices to import

### 3. Create HA Access Token

1. HA profile → **Long-Lived Access Tokens** → **Create Token**
2. Copy and save the token — it won't be shown again

### 4. Configure MCP Server

```bash
cd ~/.openclaw/skills/openclaw-xiaomi-home/scripts/ha-mcp-server
npm install
cp .env.example .env
# Edit .env and set HA_URL and HA_TOKEN
```

### 5. Start MCP Server

```bash
# As background service (macOS)
launchctl load ~/.openclaw/skills/openclaw-xiaomi-home/scripts/ha-mcp-server/ai.openclaw.ha-mcp.plist

# Or manually
node src/http-server.mjs
```

### 6. Test

```bash
node src/call-tool.mjs ping_ha
node src/call-tool.mjs list_all_devices '{"domain":"light"}'
```

## Available Tools

| Category | Tools |
|----------|-------|
| **Lights** | `light_turn_on`, `light_turn_off`, `get_light_state` |
| **Climate** | `climate_set_temperature`, `climate_set_mode`, `get_climate_state` |
| **Fans** | `fan_turn_on`, `fan_turn_off`, `fan_set_speed`, `get_fan_state` |
| **Switches** | `switch_turn_on`, `switch_turn_off`, `get_switch_state` |
| **Locks** | `lock_lock`, `lock_unlock`, `get_lock_state` |
| **Humidifiers** | `humidifier_turn_on`, `humidifier_turn_off`, `get_humidifier_state` |
| **Blinds** | `cover_open`, `cover_close`, `get_cover_state` |
| **Vacuums** | `vacuum_start`, `vacuum_stop`, `vacuum_return_to_base` |
| **Sensors** | `get_sensor_reading`, `list_sensors` |
| **Discovery** | `list_all_devices`, `get_device_state`, `trigger_scene` |
| **System** | `ping_ha`, `get_ha_config` |

## Security & Privacy

- **Local network only**: All traffic stays within your LAN — no external cloud services
- **Home Assistant token**: Stored locally in `.env`, never transmitted elsewhere
- **No data collection**: This skill does not collect or transmit any usage data
- **Docker isolation**: Home Assistant runs in an isolated container

## Troubleshooting

### HA won't start
```bash
docker logs homeassistant
```

### MCP server won't start
```bash
lsof -i :3002  # check port
cat ~/.openclaw/logs/ha-mcp.err.log
```

### Xiaomi devices not showing
- Use **China mainland** Xiaomi server in Mi Home app
- Devices must be paired in Mi Home first
- Restart the homeassistant container

### Token not working
- Re-create the Long-Lived Access Token in HA Profile
- Update `HA_TOKEN` in `.env`

## Credits

- [Home Assistant](https://www.home-assistant.io/)
- [ha_xiaomi_home](https://github.com/nickoowen/ha-xiaomi-home) integration
- [OpenClaw](https://openclaw.ai/) AI Agent framework

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| [v1.0.1](https://github.com/canmaxice-maker/openclaw-xiaomi-home/releases/tag/v1.0.1) | 2026-04-21 | Refactor HA-MCP server, improve OpenClaw skill |
| [v1.0.0](https://github.com/canmaxice-maker/openclaw-xiaomi-home/releases/tag/v1.0.0) | 2026-04-21 | Initial release |

## License

MIT
