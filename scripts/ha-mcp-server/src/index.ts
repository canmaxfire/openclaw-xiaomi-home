/**
 * Home Assistant MCP Server for OpenClaw Xiaomi Home Skill
 * 
 * This MCP server exposes Home Assistant entities and services as tools
 * that OpenClaw can call via natural language commands.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const HA_URL = process.env.HA_URL || "http://localhost:8123";
const HA_TOKEN = process.env.HA_TOKEN || "";
const PORT = parseInt(process.env.PORT || "3002", 10);

// ============================================================================
// HA API Helpers
// ============================================================================

interface HAEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
  last_changed: string;
  last_updated: string;
  context: unknown;
}

interface HAServiceCallResponse {
  success: boolean;
  result: unknown;
}

async function haFetch<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${HA_URL}/api${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${HA_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HA API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function getEntity(entityId: string): Promise<HAEntity> {
  return haFetch<HAEntity>(`/states/${entityId}`);
}

async function callService(
  domain: string,
  service: string,
  data: Record<string, unknown> = {}
): Promise<HAServiceCallResponse> {
  return haFetch("/services/" + domain + "/" + service, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

async function getAllEntities(): Promise<HAEntity[]> {
  return haFetch("/states");
}

async function getConfig(): Promise<unknown> {
  return haFetch("/config");
}

// ============================================================================
// Tool Definitions
// ============================================================================

const tools = [
  // --------------------------------------------------------------------------
  // Light Control
  // --------------------------------------------------------------------------
  {
    name: "light_turn_on",
    description: "Turn on a light and optionally set brightness or color",
    inputSchema: {
      type: "object",
      properties: {
        entity_id: { type: "string", description: "Light entity ID (e.g., light.living_room)" },
        brightness: { type: "number", description: "Brightness 0-255 (optional)" },
        color_temp: { type: "number", description: "Color temperature in Kelvin (optional)" },
      },
      required: ["entity_id"],
    },
  },
  {
    name: "light_turn_off",
    description: "Turn off a light",
    inputSchema: {
      type: "object",
      properties: {
        entity_id: { type: "string", description: "Light entity ID to turn off" },
      },
      required: ["entity_id"],
    },
  },
  {
    name: "get_light_state",
    description: "Get the current state of a light",
    inputSchema: {
      type: "object",
      properties: {
        entity_id: { type: "string", description: "Light entity ID" },
      },
      required: ["entity_id"],
    },
  },

  // --------------------------------------------------------------------------
  // Climate Control (AC, Heater)
  // --------------------------------------------------------------------------
  {
    name: "climate_set_temperature",
    description: "Set the target temperature for a climate device (AC, heater)",
    inputSchema: {
      type: "object",
      properties: {
        entity_id: { type: "string", description: "Climate entity ID (e.g., climate.living_room_ac)" },
        temperature: { type: "number", description: "Target temperature in Celsius" },
      },
      required: ["entity_id", "temperature"],
    },
  },
  {
    name: "climate_set_mode",
    description: "Set the operation mode for a climate device",
    inputSchema: {
      type: "object",
      properties: {
        entity_id: { type: "string", description: "Climate entity ID" },
        mode: { 
          type: "string", 
          enum: ["off", "heat", "cool", "dry", "fan_only", "auto"],
          description: "Operation mode" 
        },
      },
      required: ["entity_id", "mode"],
    },
  },
  {
    name: "get_climate_state",
    description: "Get current climate device state",
    inputSchema: {
      type: "object",
      properties: {
        entity_id: { type: "string", description: "Climate entity ID" },
      },
      required: ["entity_id"],
    },
  },

  // --------------------------------------------------------------------------
  // Switch & Plug Control
  // --------------------------------------------------------------------------
  {
    name: "switch_turn_on",
    description: "Turn on a switch or smart plug",
    inputSchema: {
      type: "object",
      properties: {
        entity_id: { type: "string", description: "Switch entity ID" },
      },
      required: ["entity_id"],
    },
  },
  {
    name: "switch_turn_off",
    description: "Turn off a switch or smart plug",
    inputSchema: {
      type: "object",
      properties: {
        entity_id: { type: "string", description: "Switch entity ID" },
      },
      required: ["entity_id"],
    },
  },
  {
    name: "get_switch_state",
    description: "Get switch or plug state",
    inputSchema: {
      type: "object",
      properties: {
        entity_id: { type: "string", description: "Switch entity ID" },
      },
      required: ["entity_id"],
    },
  },

  // --------------------------------------------------------------------------
  // Lock Control
  // --------------------------------------------------------------------------
  {
    name: "lock_lock",
    description: "Lock a smart door lock",
    inputSchema: {
      type: "object",
      properties: {
        entity_id: { type: "string", description: "Lock entity ID" },
      },
      required: ["entity_id"],
    },
  },
  {
    name: "lock_unlock",
    description: "Unlock a smart door lock",
    inputSchema: {
      type: "object",
      properties: {
        entity_id: { type: "string", description: "Lock entity ID" },
      },
      required: ["entity_id"],
    },
  },
  {
    name: "get_lock_state",
    description: "Get door lock state",
    inputSchema: {
      type: "object",
      properties: {
        entity_id: { type: "string", description: "Lock entity ID" },
      },
      required: ["entity_id"],
    },
  },

  // --------------------------------------------------------------------------
  // Sensor Queries
  // --------------------------------------------------------------------------
  {
    name: "get_sensor_reading",
    description: "Get current sensor reading (temperature, humidity, motion, door/window)",
    inputSchema: {
      type: "object",
      properties: {
        entity_id: { type: "string", description: "Sensor entity ID" },
      },
      required: ["entity_id"],
    },
  },
  {
    name: "list_sensors",
    description: "List all sensor entities with their current readings",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },

  // --------------------------------------------------------------------------
  // Device Discovery & Status
  // --------------------------------------------------------------------------
  {
    name: "list_all_devices",
    description: "List all Home Assistant entities",
    inputSchema: {
      type: "object",
      properties: {
        domain: { type: "string", description: "Filter by domain (light, switch, climate, sensor, lock)" },
      },
    },
  },
  {
    name: "get_device_state",
    description: "Get current state of any device by entity ID",
    inputSchema: {
      type: "object",
      properties: {
        entity_id: { type: "string", description: "Entity ID (e.g., light.living_room)" },
      },
      required: ["entity_id"],
    },
  },

  // --------------------------------------------------------------------------
  // Scenes & Scripts
  // --------------------------------------------------------------------------
  {
    name: "trigger_scene",
    description: "Trigger a Home Assistant scene",
    inputSchema: {
      type: "object",
      properties: {
        entity_id: { type: "string", description: "Scene entity ID" },
      },
      required: ["entity_id"],
    },
  },

  // --------------------------------------------------------------------------
  // HA System
  // --------------------------------------------------------------------------
  {
    name: "get_ha_config",
    description: "Get Home Assistant configuration info",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "ping_ha",
    description: "Check if Home Assistant is reachable",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
] as const;

// ============================================================================
// Tool Handlers
// ============================================================================

async function handleToolCall(name: string, args: Record<string, unknown>) {
  try {
    switch (name) {
      // Light
      case "light_turn_on": {
        const { entity_id, brightness, color_temp } = args as {
          entity_id: string;
          brightness?: number;
          color_temp?: number;
        };
        const data: Record<string, unknown> = { entity_id };
        if (brightness !== undefined) data.brightness = brightness;
        if (color_temp !== undefined) data.color_temp = color_temp;
        await callService("light", "turn_on", data);
        return { content: [{ type: "text", text: `Light ${entity_id} turned on${brightness ? ` (brightness: ${brightness})` : ""}` }] };
      }
      case "light_turn_off": {
        const { entity_id } = args as { entity_id: string };
        await callService("light", "turn_off", { entity_id });
        return { content: [{ type: "text", text: `Light ${entity_id} turned off` }] };
      }
      case "get_light_state": {
        const entity = await getEntity(args.entity_id as string);
        return { content: [{ type: "text", text: `${entity.entity_id}: ${entity.state} (brightness: ${entity.attributes.brightness ?? "N/A"}, color_temp: ${entity.attributes.color_temp ?? "N/A"})` }] };
      }

      // Climate
      case "climate_set_temperature": {
        const { entity_id, temperature } = args as { entity_id: string; temperature: number };
        await callService("climate", "set_temperature", { entity_id, temperature });
        return { content: [{ type: "text", text: `${entity_id} set to ${temperature}°C` }] };
      }
      case "climate_set_mode": {
        const { entity_id, mode } = args as { entity_id: string; mode: string };
        await callService("climate", "set_hvac_mode", { entity_id, hvac_mode: mode });
        return { content: [{ type: "text", text: `${entity_id} mode set to ${mode}` }] };
      }
      case "get_climate_state": {
        const entity = await getEntity(args.entity_id as string);
        const attrs = entity.attributes;
        return { content: [{ type: "text", text: `${entity.entity_id}: ${entity.state}, temp: ${attrs.current_temperature}°C, target: ${attrs.temperature}°C, mode: ${attrs.hvac_action}` }] };
      }

      // Switch
      case "switch_turn_on": {
        const { entity_id } = args as { entity_id: string };
        await callService("switch", "turn_on", { entity_id });
        return { content: [{ type: "text", text: `${entity_id} turned on` }] };
      }
      case "switch_turn_off": {
        const { entity_id } = args as { entity_id: string };
        await callService("switch", "turn_off", { entity_id });
        return { content: [{ type: "text", text: `${entity_id} turned off` }] };
      }
      case "get_switch_state": {
        const entity = await getEntity(args.entity_id as string);
        return { content: [{ type: "text", text: `${entity.entity_id}: ${entity.state}` }] };
      }

      // Lock
      case "lock_lock": {
        const { entity_id } = args as { entity_id: string };
        await callService("lock", "lock", { entity_id });
        return { content: [{ type: "text", text: `${entity_id} locked` }] };
      }
      case "lock_unlock": {
        const { entity_id } = args as { entity_id: string };
        await callService("lock", "unlock", { entity_id });
        return { content: [{ type: "text", text: `${entity_id} unlocked` }] };
      }
      case "get_lock_state": {
        const entity = await getEntity(args.entity_id as string);
        return { content: [{ type: "text", text: `${entity.entity_id}: ${entity.state}` }] };
      }

      // Sensors
      case "get_sensor_reading": {
        const entity = await getEntity(args.entity_id as string);
        return { content: [{ type: "text", text: `${entity.entity_id}: ${entity.state} ${entity.attributes.unit_of_measurement ?? ""}` }] };
      }
      case "list_sensors": {
        const entities = await getAllEntities();
        const sensors = entities.filter(e => e.entity_id.startsWith("sensor.") || e.entity_id.startsWith("binary_sensor."));
        const list = sensors.map(e => `  - ${e.entity_id}: ${e.state} ${e.attributes.unit_of_measurement ?? ""}`).join("\n");
        return { content: [{ type: "text", text: `Sensors:\n${list}` }] };
      }

      // Device discovery
      case "list_all_devices": {
        const domain = args.domain as string | undefined;
        const entities = await getAllEntities();
        const filtered = domain ? entities.filter(e => e.entity_id.startsWith(domain + ".")) : entities;
        const list = filtered.slice(0, 50).map(e => `  - ${e.entity_id}: ${e.state}`).join("\n");
        return { content: [{ type: "text", text: `${filtered.length} entities (showing first 50):\n${list}` }] };
      }
      case "get_device_state": {
        const entity = await getEntity(args.entity_id as string);
        const attrs = JSON.stringify(entity.attributes, null, 2);
        return { content: [{ type: "text", text: `${entity.entity_id}\nState: ${entity.state}\nAttributes:\n${attrs}` }] };
      }

      // Scene
      case "trigger_scene": {
        const { entity_id } = args as { entity_id: string };
        await callService("scene", "turn_on", { entity_id });
        return { content: [{ type: "text", text: `Scene ${entity_id} triggered` }] };
      }

      // System
      case "get_ha_config": {
        const config = await getConfig();
        return { content: [{ type: "text", text: `Home Assistant config: ${JSON.stringify(config)}` }] };
      }
      case "ping_ha": {
        await getConfig();
        return { content: [{ type: "text", text: "Home Assistant is reachable and running" }] };
      }

      default:
        return { content: [{ type: "text", text: `Unknown tool: ${name}` }], isError: true };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { content: [{ type: "text", text: `Error: ${message}` }], isError: true };
  }
}

// ============================================================================
// MCP Server Setup
// ============================================================================

const server = new McpServer({
  name: "homeassistant-mcp",
  version: "1.0.0",
}, {
  tools: tools.map(t => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema,
  })),
});

server.setRequestHandler({ method: "tools/call" }, async (request) => {
  const { name, arguments: args } = request.params;
  const result = await handleToolCall(name, args ?? {});
  return { content: result.content, isError: result.isError };
});

// ============================================================================
// Start Server
// ============================================================================

async function main() {
  console.error("Starting HA MCP Server...");
  console.error(`HA URL: ${HA_URL}`);
  
  if (!HA_TOKEN) {
    console.error("WARNING: HA_TOKEN not set. Set it in .env file or environment variable.");
  }
  
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("HA MCP Server connected");
}

main().catch(console.error);
