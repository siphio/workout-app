---
name: Playwright MCP Browser Automation
description: This skill should be used when the user asks to "automate browser", "browse website", "take screenshot", "fill form", "click button", "navigate to URL", "scrape webpage", "test website", "interact with webpage", "capture page snapshot", "automate web interaction", "use playwright", "open browser", "browser automation", or mentions browser testing, web scraping, or UI automation. Provides comprehensive guidance for using the Microsoft Playwright MCP server for browser automation via accessibility snapshots.
version: 1.0.0
---

# Playwright MCP Browser Automation

## Overview

The Playwright MCP server enables browser automation through structured accessibility snapshots rather than screenshots. This approach is fast, lightweight, and deterministic - perfect for LLM-driven browser interactions without requiring vision models.

**Key Benefits:**
- Uses Playwright's accessibility tree, not pixel-based input
- LLM-friendly: operates purely on structured data
- Deterministic tool application avoiding screenshot ambiguity
- Supports Chrome, Firefox, WebKit, and Edge browsers

## Core Workflow

### 1. Navigate to Page

```
browser_navigate({ url: "https://example.com" })
```

### 2. Capture Page State

```
browser_snapshot()
```

The snapshot returns an accessibility tree with element references like:
```
- button "Submit" [ref=e3]
- textbox "Email" [ref=e7]
- link "Sign up" [ref=e12]
```

### 3. Interact Using References

Always extract the `ref` value from the snapshot to interact:

```
browser_click({ element: "Submit button", ref: "e3" })
browser_type({ element: "Email field", ref: "e7", text: "user@example.com" })
```

## Essential Tools Quick Reference

### Navigation
- `browser_navigate` - Go to URL
- `browser_navigate_back` - Go back in history
- `browser_tabs` - List/create/close/select tabs

### Interaction
- `browser_click` - Click elements (use `ref` from snapshot)
- `browser_type` - Type text into inputs
- `browser_fill_form` - Fill multiple form fields at once
- `browser_select_option` - Select dropdown options
- `browser_hover` - Hover over elements
- `browser_drag` - Drag and drop between elements
- `browser_press_key` - Press keyboard keys

### Observation
- `browser_snapshot` - Get accessibility tree (primary tool for understanding page)
- `browser_take_screenshot` - Capture visual screenshot
- `browser_console_messages` - Get console logs
- `browser_network_requests` - List network activity

### Waiting
- `browser_wait_for` - Wait for text, text disappearance, or time delay

### Evaluation
- `browser_evaluate` - Run JavaScript on page
- `browser_run_code` - Execute Playwright code snippets

### Session Management
- `browser_close` - Close the browser
- `browser_resize` - Change viewport size
- `browser_file_upload` - Upload files to file inputs
- `browser_handle_dialog` - Accept/dismiss dialogs

## Critical Best Practices

### Always Use Snapshots First

Before any interaction, call `browser_snapshot()` to understand the current page state. The snapshot provides the `ref` values needed for precise element targeting.

### Provide Both `element` and `ref`

Most interaction tools require:
- `element`: Human-readable description (for logging/permission)
- `ref`: Exact reference from snapshot (for targeting)

```
// Correct
browser_click({ element: "Login button", ref: "e15" })

// Incorrect - missing ref
browser_click({ element: "Login button" })
```

### Handle Dynamic Content

After actions that change page content (clicks, form submissions, navigation):
1. Use `browser_wait_for` to wait for expected content
2. Call `browser_snapshot()` again to get updated references

### Form Filling Strategy

For forms, prefer `browser_fill_form` for efficiency:

```
browser_fill_form({
  fields: [
    { element: "Email field", ref: "e5", value: "user@example.com" },
    { element: "Password field", ref: "e8", value: "secret123" }
  ]
})
```

### Wait Strategically

Use `browser_wait_for` before interactions when:
- Page is loading dynamic content
- Waiting for API responses
- Elements may not be immediately visible

```
browser_wait_for({ text: "Welcome" })  // Wait for text
browser_wait_for({ textGone: "Loading..." })  // Wait for text to disappear
browser_wait_for({ time: 2 })  // Wait 2 seconds
```

## Common Workflows

### Login Flow

```
1. browser_navigate({ url: "https://app.example.com/login" })
2. browser_snapshot()
3. browser_fill_form({ fields: [
     { element: "Username", ref: "e5", value: "user" },
     { element: "Password", ref: "e8", value: "pass" }
   ]})
4. browser_click({ element: "Login button", ref: "e12" })
5. browser_wait_for({ text: "Dashboard" })
6. browser_snapshot()
```

### Data Extraction

```
1. browser_navigate({ url: "https://example.com/data" })
2. browser_snapshot()  // Inspect structure
3. browser_evaluate({ function: "() => { /* extract data */ }" })
```

### Screenshot Capture

```
1. browser_navigate({ url: "https://example.com" })
2. browser_wait_for({ text: "Expected content" })
3. browser_take_screenshot({ filename: "page.png" })

// For full page:
browser_take_screenshot({ filename: "full.png", fullPage: true })

// For specific element:
browser_take_screenshot({ element: "Product card", ref: "e25", filename: "product.png" })
```

## Advanced Features

### Tab Management

```
browser_tabs({ action: "list" })  // List all tabs
browser_tabs({ action: "new" })   // Create new tab
browser_tabs({ action: "select", index: 1 })  // Switch to tab
browser_tabs({ action: "close", index: 2 })   // Close specific tab
```

### Execute Custom Code

For complex scenarios, use `browser_run_code`:

```
browser_run_code({
  code: `
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForURL('**/success');
  `
})
```

### JavaScript Evaluation

```
browser_evaluate({
  function: "() => document.title"
})

// On specific element:
browser_evaluate({
  element: "Price display",
  ref: "e15",
  function: "(element) => element.textContent"
})
```

## Troubleshooting

### Element Not Found
- Call `browser_snapshot()` to get current state
- Verify the `ref` value matches current snapshot
- Use `browser_wait_for` if element loads dynamically

### Stale References
- References change when page updates
- Always re-snapshot after navigation or significant interactions
- Don't cache `ref` values across multiple actions

### Dialogs Blocking Interaction
- Use `browser_handle_dialog({ accept: true })` or `{ accept: false }`
- For prompts: `browser_handle_dialog({ accept: true, promptText: "input" })`

### Slow Loading Pages
- Use `browser_wait_for({ text: "expected content" })` before snapshots
- Increase wait time: `browser_wait_for({ time: 5 })`

## Configuration Options

The Playwright MCP supports these launch arguments:
- `--browser <chrome|firefox|webkit|msedge>` - Browser choice
- `--headless` - Run without visible window
- `--viewport-size <width>x<height>` - Set viewport
- `--user-data-dir <path>` - Persistent profile location
- `--caps vision` - Enable coordinate-based tools
- `--caps pdf` - Enable PDF generation

## Additional Resources

### Reference Files

For complete tool documentation:
- **`references/tools-reference.md`** - Full tool parameters and descriptions
- **`references/configuration.md`** - Detailed configuration options

### External Documentation
- Microsoft Playwright MCP: https://github.com/microsoft/playwright-mcp
- Playwright Docs: https://playwright.dev
