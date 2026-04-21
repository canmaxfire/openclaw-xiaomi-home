---
name: openclaw-xiaomi-home
description: Control your Xiaomi smart home devices with plain English — no apps, no switching, just tell your AI assistant what to do. Ask things like "turn on the living room light", "set AC to 26 degrees", "is the front door locked?", or "what's the temperature in the bedroom?" and it handles it instantly. Great for hands-free control when your phone isn't nearby, voice control through your AI assistant, or automating your home with plain text commands. Triggers: "turn on the light", "set AC temperature", "is the door locked?", "check the temperature", "lock all doors", "turn everything off".

NOTE: Requires Home Assistant running locally (free, runs on Docker) and Xiaomi devices paired with Mi Home. All control stays on your local network — no cloud, no subscription, no data collection.
---

# Xiaomi Home Control

**Control your Xiaomi devices with plain English.** No apps. No switching. Just tell your AI assistant what you want.

## What It Does

Instead of opening the Mi Home app, finding the right device, and tapping buttons — just say:

```
"Turn on the living room light"
"Set bedroom AC to 26 degrees"
"Is the front door locked?"
"What's the temperature?"
"Turn off all lights"
"Lock the door"
```

Your AI assistant handles it instantly.

## What You Can Control

| Category | Examples |
|----------|---------|
| **Lights** | Turn on/off, adjust brightness |
| **Air Conditioning** | Set temperature, change mode |
| **Door Locks** | Lock/unlock doors remotely |
| **Sensors** | Check temperature, humidity, motion |
| **Fans & Humidifiers** | Turn on/off, set speed |
| **Blinds & Curtains** | Open/close |
| **Robot Vacuums** | Start cleaning, return to charger |

Works with 1837+ Xiaomi/Mijia devices via the Xiaomi Home integration.

## How It Works

```
You: "Turn on the living room light"
  ↓
OpenClaw AI → Your Home Assistant → Xiaomi Device
```

Everything stays **on your home network** — no cloud, no Xiaomi servers involved after setup.

## Setup

```bash
# 1. Start Home Assistant (free, one-time setup)
docker compose up -d

# 2. Install the control server
cd scripts/ha-mcp-server && npm install

# 3. Connect to your Xiaomi devices
# (open Home Assistant at localhost:8123, add Xiaomi Home integration)

# 4. Done — control with your AI assistant
```

Full step-by-step in README.md.

## Why This Is Better

| Traditional Way | With This Skill |
|----------------|-----------------|
| Open Mi Home app | Just speak/text your AI |
| Find the right device | AI finds it automatically |
| Tap multiple buttons | One sentence does it all |
| Can't control when away | Works through AI assistant |
| One device at a time | Control everything at once |

## Privacy

- **Local only** — all traffic stays in your home
- **No cloud** — Xiaomi cloud only used for initial device pairing
- **No data collection** — nothing is tracked or transmitted
- **You own everything** — Home Assistant runs on your own hardware

## Example Commands

```
"Turn on the living room light"
"Dim the bedroom to 30%"
"Set AC to cool mode at 24 degrees"
"Is the door locked?"
"Lock the front door"
"What's the living room temperature?"
"Turn off all lights"
"Close the bedroom blinds"
"Start the vacuum"
"Return the vacuum to base"
```
