# Playwright MCP Configuration Reference

Complete configuration options for the Playwright MCP server.

## Command Line Arguments

### Browser Options

| Argument | Description | Example |
|----------|-------------|---------|
| `--browser <browser>` | Browser to use: chrome, firefox, webkit, msedge | `--browser firefox` |
| `--headless` | Run browser without visible window | `--headless` |
| `--executable-path <path>` | Custom browser executable path | `--executable-path /path/to/chrome` |
| `--device <device>` | Emulate device (e.g., "iPhone 15") | `--device "iPhone 15"` |
| `--viewport-size <size>` | Viewport dimensions | `--viewport-size 1280x720` |
| `--user-agent <ua>` | Custom user agent string | `--user-agent "Custom UA"` |

### Profile & State

| Argument | Description | Example |
|----------|-------------|---------|
| `--user-data-dir <path>` | Browser profile directory | `--user-data-dir /path/to/profile` |
| `--isolated` | In-memory profile, no disk persistence | `--isolated` |
| `--storage-state <path>` | Load cookies/storage from file | `--storage-state auth.json` |

### Capabilities

| Argument | Description | Example |
|----------|-------------|---------|
| `--caps vision` | Enable coordinate-based mouse tools | `--caps vision` |
| `--caps pdf` | Enable PDF generation | `--caps pdf` |
| `--caps vision,pdf` | Enable multiple capabilities | `--caps vision,pdf` |

### Network

| Argument | Description | Example |
|----------|-------------|---------|
| `--proxy-server <proxy>` | Proxy server URL | `--proxy-server http://proxy:3128` |
| `--proxy-bypass <domains>` | Domains to bypass proxy | `--proxy-bypass .local,internal.com` |
| `--ignore-https-errors` | Ignore SSL certificate errors | `--ignore-https-errors` |
| `--allowed-origins <origins>` | Allowed request origins | `--allowed-origins https://api.example.com` |
| `--block-service-workers` | Block service workers | `--block-service-workers` |

### Timeouts

| Argument | Description | Example |
|----------|-------------|---------|
| `--timeout-action <ms>` | Action timeout (default: 5000ms) | `--timeout-action 10000` |
| `--timeout-navigation <ms>` | Navigation timeout (default: 60000ms) | `--timeout-navigation 120000` |

### Output

| Argument | Description | Example |
|----------|-------------|---------|
| `--output-dir <path>` | Directory for output files | `--output-dir ./output` |
| `--save-trace` | Save Playwright trace | `--save-trace` |
| `--save-video <size>` | Save video recording | `--save-video 800x600` |
| `--save-session` | Save MCP session data | `--save-session` |

### Server Mode

| Argument | Description | Example |
|----------|-------------|---------|
| `--port <port>` | SSE transport port | `--port 8931` |
| `--host <host>` | Server host (default: localhost) | `--host 0.0.0.0` |
| `--allowed-hosts <hosts>` | Allowed hosts ('*' for all) | `--allowed-hosts *` |

### Security

| Argument | Description | Example |
|----------|-------------|---------|
| `--no-sandbox` | Disable browser sandbox | `--no-sandbox` |
| `--allow-unrestricted-file-access` | Allow file:// access | `--allow-unrestricted-file-access` |
| `--grant-permissions <perms>` | Grant browser permissions | `--grant-permissions geolocation,clipboard-read` |

### Other

| Argument | Description | Example |
|----------|-------------|---------|
| `--config <path>` | JSON configuration file | `--config config.json` |
| `--cdp-endpoint <endpoint>` | Connect to existing CDP | `--cdp-endpoint ws://localhost:9222` |
| `--extension` | Use browser extension mode | `--extension` |
| `--init-script <path>` | JavaScript to inject on pages | `--init-script inject.js` |
| `--init-page <path>` | TypeScript for page setup | `--init-page setup.ts` |
| `--test-id-attribute <attr>` | Custom test ID attribute | `--test-id-attribute data-cy` |
| `--console-level <level>` | Console log level to capture | `--console-level error` |

## JSON Configuration File

Create a JSON config file and use `--config path/to/config.json`:

```json
{
  "browser": {
    "browserName": "chromium",
    "isolated": false,
    "userDataDir": "/path/to/profile",
    "launchOptions": {
      "channel": "chrome",
      "headless": false,
      "executablePath": "/path/to/browser"
    },
    "contextOptions": {
      "viewport": { "width": 1280, "height": 720 },
      "userAgent": "Custom UA"
    },
    "cdpEndpoint": "ws://localhost:9222",
    "remoteEndpoint": "ws://remote-server:9222"
  },
  "server": {
    "port": 8931,
    "host": "localhost"
  },
  "capabilities": ["tabs", "install", "pdf", "vision"],
  "outputDir": "./output",
  "network": {
    "allowedOrigins": ["https://api.example.com"],
    "blockedOrigins": ["https://ads.example.com"]
  },
  "imageResponses": "allow"
}
```

## MCP Configuration Examples

### Basic Chrome (Headed)

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

### Headless Firefox

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--browser", "firefox", "--headless"]
    }
  }
}
```

### With Vision Capabilities

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--caps", "vision"]
    }
  }
}
```

### With Persistent Profile

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--user-data-dir", "C:/Users/user/playwright-profile"
      ]
    }
  }
}
```

### Mobile Device Emulation

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest", "--device", "iPhone 15"]
    }
  }
}
```

### With Proxy

```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": [
        "@playwright/mcp@latest",
        "--proxy-server", "http://proxy.example.com:8080",
        "--proxy-bypass", ".internal.com"
      ]
    }
  }
}
```

### SSE Server Mode (for remote access)

```json
{
  "mcpServers": {
    "playwright": {
      "url": "http://localhost:8931/mcp"
    }
  }
}
```

Start the server separately:
```bash
npx @playwright/mcp@latest --port 8931
```

### Docker Configuration

```json
{
  "mcpServers": {
    "playwright": {
      "command": "docker",
      "args": [
        "run", "-i", "--rm", "--init", "--pull=always",
        "mcr.microsoft.com/playwright/mcp"
      ]
    }
  }
}
```

## Profile Locations

Default persistent profile locations:

**Windows:**
```
%USERPROFILE%\AppData\Local\ms-playwright\mcp-{channel}-profile
```

**macOS:**
```
~/Library/Caches/ms-playwright/mcp-{channel}-profile
```

**Linux:**
```
~/.cache/ms-playwright/mcp-{channel}-profile
```

## Storage State

Save and restore authentication state:

```bash
# Use existing storage state
npx @playwright/mcp@latest --isolated --storage-state auth.json
```

Storage state JSON format:
```json
{
  "cookies": [...],
  "origins": [
    {
      "origin": "https://example.com",
      "localStorage": [...]
    }
  ]
}
```

## Init Scripts

### init-script.js (Injected into every page)

```javascript
// Override browser APIs
window.isAutomated = true;

// Mock geolocation
navigator.geolocation.getCurrentPosition = (success) => {
  success({ coords: { latitude: 40.7128, longitude: -74.0060 } });
};
```

### init-page.ts (Playwright page setup)

```typescript
export default async ({ page }) => {
  await page.context().grantPermissions(['geolocation']);
  await page.context().setGeolocation({ latitude: 37.7749, longitude: -122.4194 });
  await page.setViewportSize({ width: 1280, height: 720 });
};
```

## Browser Extension Mode

For connecting to existing Chrome/Edge instances:

1. Install "Playwright MCP Bridge" browser extension
2. Run with `--extension` flag:
   ```bash
   npx @playwright/mcp@latest --extension
   ```

This allows automation of existing browser sessions with logged-in state.
