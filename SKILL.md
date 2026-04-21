---
name: openclaw-xiaomi-home
description: Control Xiaomi/Mijia smart home devices via Home Assistant using natural language. Use when user wants to control lights, air conditioning, sensors, locks, or other Xiaomi IoT devices with text or voice commands. Also use for querying device status, setting up automations, or receiving proactive alerts. Triggers: "turn on the living room light", "set AC to 26 degrees", "is the door locked?", "what's the temperature?", "turn off all lights when I leave", "lock the front door".

NOTE: This skill requires Home Assistant running locally (Docker at localhost:8123) and an HA MCP server running at localhost:3002. The MCP server reads the HA access token from the local .env file. All device control stays on the local network.
---

# openclaw-xiaomi-home

Control Xiaomi/Mijia smart home devices via Home Assistant using natural language commands.

## Setup

```bash
# Install Home Assistant (Docker)
cd ~/.openclaw/skills/openclaw-xiaomi-home
docker compose up -d

# Install MCP server
cd ~/.openclaw/skills/openclaw-xiaomi-home/scripts/ha-mcp-server
npm install && cp .env.example .env
# Edit .env with your HA_URL and HA_TOKEN

# Start MCP server
launchctl load ~/.openclaw/skills/openclaw-xiaomi-home/scripts/ha-mcp-server/ai.openclaw.ha-mcp.plist
```

## Usage

Control devices via natural language after setup. See README.md for full tool list and troubleshooting.

## Environment

- HA at `http://localhost:8123`
- MCP server at `http://localhost:3002`
- Token stored in `.env` (never transmitted externally)

## Available Tools

| Tool | Description |
|------|-------------|
| `light_turn_on` / `light_turn_off` | Control lights |
| `climate_set_temperature` / `climate_set_mode` | Control AC/heaters |
| `fan_turn_on` / `fan_turn_off` / `fan_set_speed` | Control fans |
| `switch_turn_on` / `switch_turn_off` | Control switches/plugs |
| `lock_lock` / `lock_unlock` | Control door locks |
| `humidifier_turn_on` / `humidifier_turn_off` | Control humidifiers |
| `cover_open` / `cover_close` | Control blinds/curtains |
| `vacuum_start` / `vacuum_stop` / `vacuum_return_to_base` | Control robot vacuums |
| `get_sensor_reading` / `list_sensors` | Read sensor values |
| `list_all_devices` / `get_device_state` | Discover devices |
| `trigger_scene` | Trigger HA scenes |
| `ping_ha` | Check HA connection |

## Example Commands

```
"Turn on the living room light"
"Set bedroom AC to 26 degrees"
"What's the current temperature?"
"Lock the front door"
"Turn off all lights"
"Open the blinds"
"Return vacuum to base"
```
