---
name: openclaw-xiaomi-home
description: Control Xiaomi/Mijia smart home devices via Home Assistant using natural language. Use when user wants to control lights, air conditioning, sensors, locks, or other Xiaomi IoT devices using text or voice commands. Also use when user wants to query device status, set up automations, or receive proactive alerts. Triggers: "turn on the living room light", "set AC to 26 degrees", "is the door locked?", "what's the temperature?", "turn off all lights when I leave".
---

# Xiaomi Home Skill

Control Xiaomi smart home devices through Home Assistant using natural conversations.

## Architecture

```
OpenClaw (Nana) → exec (node call-tool.mjs) → HA MCP HTTP Server → Home Assistant → Xiaomi Devices
                                                           ↑
                                                  ha_xiaomi_home
```

## Quick Start

### 1. Install Home Assistant (Docker)

```bash
docker run -d \
  --name homeassistant \
  --privileged \
  -p 8123:8123 \
  -v ~/homeassistant/config:/config \
  --dns=8.8.8.8 --dns=223.5.5.5 \
  -e TZ=Asia/Shanghai \
  ghcr.io/home-assistant/home-assistant:stable
```

### 2. Configure Home Assistant

1. Open http://localhost:8123 → create account
2. Add to `configuration.yaml`:
   ```yaml
   homeassistant:
     external_url: http://localhost:8123
   ```
3. Restart HA: `docker restart homeassistant`
4. Settings → Devices & Services → Add Integration → **Xiaomi Home** → login with Xiaomi account

### 3. Create HA Access Token

Profile → Security → Long-Lived Access Tokens → Create Token

### 4. Install MCP Server

```bash
cd scripts/ha-mcp-server
npm install
```

Create `.env` file:
```
HA_URL=http://localhost:8123
HA_TOKEN=your_token_here
PORT=3002
```

### 5. Start MCP Server

```bash
# As background service (recommended)
launchctl load scripts/ha-mcp-server/ai.openclaw.ha-mcp.plist

# Or run manually
node src/http-server.mjs
```

### 6. Test

```bash
node src/call-tool.mjs ping_ha
node src/call-tool.mjs list_all_devices '{"domain":"light"}'
node src/call-tool.mjs light_turn_on '{"entity_id":"light.your_light_id"}'
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
| `fan_turn_on` | Turn on fan |
| `fan_turn_off` | Turn off fan |
| `fan_set_speed` | Set fan speed (0-100%) |
| `get_fan_state` | Get fan state |
| `switch_turn_on` | Turn on switch/plug |
| `switch_turn_off` | Turn off switch/plug |
| `get_switch_state` | Get switch state |
| `lock_lock` | Lock door |
| `lock_unlock` | Unlock door |
| `get_lock_state` | Get lock state |
| `humidifier_turn_on` | Turn on humidifier |
| `humidifier_turn_off` | Turn off humidifier |
| `get_humidifier_state` | Get humidifier state |
| `cover_open` | Open blinds/curtains |
| `cover_close` | Close blinds/curtains |
| `get_cover_state` | Get cover state |
| `vacuum_start` | Start robot vacuum |
| `vacuum_stop` | Stop robot vacuum |
| `vacuum_return_to_base` | Return vacuum to charging base |
| `get_sensor_reading` | Get sensor value |
| `list_sensors` | List all sensors |
| `list_all_devices` | List all devices (optional: domain filter) |
| `get_device_state` | Get any device state |
| `trigger_scene` | Trigger a scene |
| `ping_ha` | Check HA connection |
| `get_ha_config` | Get HA version info |

## Example Commands

```
User: "Turn on the living room light"
→ light_turn_on: entity_id=light.yeelink_cn_248418335_lamp15_s_2

User: "Set bedroom AC to 26 degrees"
→ climate_set_temperature: entity_id=climate.xiaomi_cn_xxx, temperature=26

User: "What's the current temperature?"
→ list_sensors → find temperature sensor → get_sensor_reading

User: "Lock the front door"
→ lock_lock: entity_id=lock.xiaomi_cn_xxx
```

## Device Discovery

After Xiaomi Home is configured, list your devices:

```bash
node src/call-tool.mjs list_all_devices
node src/call-tool.mjs list_all_devices '{"domain":"light"}'
node src/call-tool.mjs list_all_devices '{"domain":"climate"}'
node src/call-tool.mjs list_all_devices '{"domain":"sensor"}'
```

## Notes

- HA must be running at `http://localhost:8123`
- MCP HTTP server runs at `http://localhost:3002`
- All Xiaomi devices must be paired in Mi Home app first
- Some devices may not be supported (Bluetooth/IR/virtual)
