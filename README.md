# openclaw-xiaomi-home

> Control Xiaomi/Mijia smart home devices via Home Assistant using natural language, powered by OpenClaw AI.

## Overview

This OpenClaw skill enables voice and text control of Xiaomi smart home devices through Home Assistant. Works with lights, AC, fans, sensors, locks, switches, and more — all through natural conversation.

**Architecture:**
```
OpenClaw (Nana) → exec (node call-tool.mjs) → HA MCP HTTP Server → Home Assistant → Xiaomi Devices
                                                           ↑
                                                  ha_xiaomi_home
```

## Features

- 🌐 **Natural language control** — "Turn on the living room light" / "Set AC to 26 degrees"
- 📱 **1837+ devices supported** via ha_xiaomi_home integration
- 💡 Lights, fans, AC, sensors, locks, switches, blinds, vacuums
- 🔄 **Auto-restart** via LaunchAgent (macOS)
- 🐳 **Docker-based** Home Assistant for easy setup
- 🔒 **Local-only** — no cloud, full privacy

## Prerequisites

- macOS (or Linux with LaunchAgent support)
- [Docker Desktop](https://docs.docker.com/desktop/setup/install/mac-install/)
- Home Assistant (included via Docker)
- Xiaomi devices paired with Mi Home app

## Quick Start

### 1. Clone / Copy this skill

```bash
# Copy to your OpenClaw skills folder
cp -r openclaw-xiaomi-home ~/.openclaw/skills/
```

### 2. Start Home Assistant

```bash
cd ~/.openclaw/skills/openclaw-xiaomi-home
docker compose up -d
# OR if you don't have compose:
docker run -d --name homeassistant --privileged -p 8123:8123 \
  -v ~/homeassistant/config:/config \
  --dns=8.8.8.8 --dns=223.5.5.5 \
  -e TZ=Asia/Shanghai \
  ghcr.io/home-assistant/home-assistant:stable
```

Open http://localhost:8123 and create your account.

### 3. Add Xiaomi Home integration

1. Go to **Settings → Devices & Services → Add Integration**
2. Search for **Xiaomi Home** and click it
3. Login with your Xiaomi account (China mainland server)
4. Wait for devices to import

### 4. Configure Home Assistant

Add to `~/homeassistant/config/configuration.yaml`:
```yaml
homeassistant:
  external_url: http://localhost:8123
```

Restart: `docker restart homeassistant`

### 5. Create HA Access Token

1. In HA, click your profile name (top right)
2. Scroll down to **Long-Lived Access Tokens**
3. Click **Create Token**, name it (e.g. `openclaw-xiaomi-home`)
4. **Copy and save the token** — you won't see it again

### 6. Install MCP Server

```bash
cd ~/.openclaw/skills/openclaw-xiaomi-home/scripts/ha-mcp-server
npm install
```

Create your `.env` file:
```bash
cp .env.example .env
# Edit .env and add your HA_TOKEN
```

### 7. Start MCP Server

```bash
# As background service (recommended on macOS)
launchctl load ai.openclaw.ha-mcp.plist

# Or run manually
node src/http-server.mjs
```

### 8. Test

```bash
node src/call-tool.mjs ping_ha
node src/call-tool.mjs list_all_devices '{"domain":"light"}'
```

## Usage with OpenClaw

After setup, control devices with natural language:

```
"Turn on the living room light"
"Set bedroom AC to 26 degrees"
"What's the current temperature?"
"Lock the front door"
"Turn off all lights"
"Open the blinds"
"Return vacuum to base"
```

## Available Tools

| Tool | Description |
|------|-------------|
| `light_turn_on` | Turn on light (optional: brightness 0-255) |
| `light_turn_off` | Turn off light |
| `get_light_state` | Get light state |
| `climate_set_temperature` | Set AC/heater temperature |
| `climate_set_mode` | Set mode (off/heat/cool/dry/fan_only/auto) |
| `get_climate_state` | Get climate device state |
| `fan_turn_on` / `fan_turn_off` | Control fans |
| `fan_set_speed` | Set fan speed (0-100%) |
| `switch_turn_on` / `switch_turn_off` | Control switches/plugs |
| `lock_lock` / `lock_unlock` | Control door locks |
| `humidifier_turn_on` / `humidifier_turn_off` | Control humidifiers |
| `cover_open` / `cover_close` | Control blinds/curtains |
| `vacuum_start` / `vacuum_stop` | Control robot vacuums |
| `get_sensor_reading` | Get sensor value |
| `list_sensors` | List all sensors |
| `list_all_devices` | List all devices (optional: domain filter) |
| `get_device_state` | Get any device state |
| `trigger_scene` | Trigger a HA scene |
| `ping_ha` | Check HA connection |

## Troubleshooting

### HA won't start
```bash
docker logs homeassistant
```

### MCP server won't start
```bash
# Check if port 3002 is in use
lsof -i :3002

# Check logs
cat ~/.openclaw/logs/ha-mcp.err.log
```

### Xiaomi Home not showing devices
- Make sure you're using the **China mainland** Xiaomi server
- Devices must be paired in **Mi Home app** first
- Try clearing HA cache: restart the homeassistant container

### Token not working
- Re-create the Long-Lived Access Token in HA Profile settings
- Update the `HA_TOKEN` in `.env`

## License

MIT License — see LICENSE file.

## Acknowledgments

- [Home Assistant](https://www.home-assistant.io/)
- [ha_xiaomi_home](https://github.com/nickoowen/ha-xiaomi-home) integration
- [OpenClaw](https://openclaw.ai/) AI Agent framework
