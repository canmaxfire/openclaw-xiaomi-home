---
name: openclaw-xiaomi-home
description: Control Xiaomi/Mijia smart home devices via Home Assistant. Use when user wants to control lights, air conditioning, sensors, locks, or other Xiaomi IoT devices using natural language or voice commands. Also use when user wants to query device status, set up automations, or receive proactive alerts about their smart home. Triggers: "turn on the living room light", "set AC to 26 degrees", "is the door locked?", "what's the temperature?", "automate the fan to turn on when temperature exceeds 30°C".
---

# Xiaomi Home Skill

Control Xiaomi smart home devices through Home Assistant using natural conversations.

## Overview

This skill enables OpenClaw to act as a smart home assistant, connecting to Xiaomi devices via Home Assistant and the official `ha_xiaomi_home` integration. Users can control devices via text or voice, query status, and set up intelligent automations.

## Architecture

```
OpenClaw → mcporter → MCP Server → Home Assistant → Xiaomi Devices
                                  ↑
                         ha_xiaomi_home
```

## Quick Start

### Prerequisites

1. Docker Desktop installed and running on macOS/Linux
2. Xiaomi account with linked devices in Mi Home app
3. (Optional) Xiaomi Central Hub Gateway for local control

### Installation

1. Clone the skill:
```bash
git clone https://github.com/YOUR_USERNAME/openclaw-xiaomi-home.git
cd openclaw-xiaomi-home
```

2. Start Home Assistant:
```bash
docker compose up -d
```

3. Open Home Assistant at http://localhost:8123 and complete initial setup

4. Install `ha_xiaomi_home` integration:
   - Settings → Devices & Services → Add Integration
   - Search "Xiaomi Home" → Login with Xiaomi account

5. Configure MCP Server:
```bash
cd scripts/ha-mcp-server
npm install
npm run build
```

6. Add to mcporter config (see references/installation.md)

## Device Control

### Supported Device Types

| Type | Examples | Status |
|------|----------|--------|
| Lights | Ceiling lights, floor lamps, table lamps | ✅ Full support |
| Climate | Air conditioners, heaters, fans | ✅ Full support |
| Sensors | Temperature, humidity, door/window, motion | ✅ Full support |
| Locks | Smart door locks | ✅ Full support |
| Plugs/Switches | Smart plugs, wall switches | ✅ Full support |
| Projectors | Laser projectors | ⚠️ Model dependent |
| Appliances | Refrigerators, washers | ⚠️ Model dependent |

**Not supported:** Bluetooth devices, IR devices, virtual devices

### Example Commands

**Lights:**
- "Turn on the living room light"
- "Set bedroom ceiling light to 50% brightness"
- "Turn off all lights"

**Climate:**
- "Set AC to 26 degrees"
- "Turn on the heater in the bedroom"

**Sensors:**
- "What's the current temperature?"
- "Is the front door locked?"
- "Any motion detected in the hallway?"

**Automations:**
- "Turn on the fan when temperature exceeds 30°C"
- "Lock all doors at 10 PM"
- "Turn off everything when I leave home"

## Natural Language Mapping

OpenClaw interprets user intent and maps to HA service calls:

| User says | HA Service Call |
|-----------|-----------------|
| "turn on/off" | `switch.turn_on`, `switch.turn_off` |
| "set to X degrees" | `climate.set_temperature` |
| "set brightness to X%" | `light.turn_on` with brightness |
| "lock/unlock" | `lock.lock`, `lock.unlock` |
| "status" | `sensor` state query |
| "is [device] on/off" | Entity state query |

## Proactive Alerts

Configure HA automations to push events to OpenClaw via webhook:

```yaml
automation:
  - alias: "Temperature Alert"
    trigger:
      - platform: numeric_state
        entity_id: sensor.living_room_temperature
        above: 30
    action:
      - service: rest_command.notify_openclaw
        data:
          message: "🌡️ Living room temperature exceeded 30°C"
```

See `references/automations.md` for full automation examples.

## Files Reference

- `references/installation.md` - Detailed installation guide
- `references/device-support.md` - Complete device compatibility list
- `references/automations.md` - Automation templates and examples
- `references/api-notes.md` - Home Assistant API notes
