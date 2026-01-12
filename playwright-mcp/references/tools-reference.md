# Playwright MCP Tools Reference

Complete documentation for all Playwright MCP server tools.

## Core Automation Tools

### browser_navigate
Navigate to a URL.

**Parameters:**
- `url` (string, required): The URL to navigate to

**Example:**
```
browser_navigate({ url: "https://example.com" })
```

---

### browser_navigate_back
Go back to the previous page in browser history.

**Parameters:** None

**Example:**
```
browser_navigate_back()
```

---

### browser_snapshot
Capture accessibility snapshot of the current page. This is the primary tool for understanding page state and is better than screenshots for interaction planning.

**Parameters:** None

**Returns:** Accessibility tree with element references (ref values) for targeting.

**Example:**
```
browser_snapshot()
```

**Sample Output:**
```
- heading "Welcome" [ref=e1]
- button "Sign In" [ref=e2]
- textbox "Email" [ref=e3]
- link "Forgot Password" [ref=e4]
```

---

### browser_click
Click on an element.

**Parameters:**
- `element` (string, required): Human-readable element description
- `ref` (string, required): Exact target element reference from snapshot
- `doubleClick` (boolean, optional): Perform double click
- `button` (string, optional): Button to click (left/right/middle), defaults to left
- `modifiers` (array, optional): Modifier keys (Shift, Control, Alt, Meta)

**Example:**
```
browser_click({ element: "Submit button", ref: "e5" })
browser_click({ element: "Context menu target", ref: "e8", button: "right" })
browser_click({ element: "Multi-select item", ref: "e12", modifiers: ["Control"] })
```

---

### browser_type
Type text into an editable element.

**Parameters:**
- `element` (string, required): Human-readable element description
- `ref` (string, required): Exact target element reference from snapshot
- `text` (string, required): Text to type
- `submit` (boolean, optional): Press Enter after typing
- `slowly` (boolean, optional): Type one character at a time (for triggering key handlers)

**Example:**
```
browser_type({ element: "Search box", ref: "e7", text: "query" })
browser_type({ element: "Search box", ref: "e7", text: "query", submit: true })
```

---

### browser_fill_form
Fill multiple form fields at once.

**Parameters:**
- `fields` (array, required): Array of field objects, each with:
  - `element` (string): Field description
  - `ref` (string): Field reference
  - `value` (string): Value to fill

**Example:**
```
browser_fill_form({
  fields: [
    { element: "First Name", ref: "e5", value: "John" },
    { element: "Last Name", ref: "e6", value: "Doe" },
    { element: "Email", ref: "e7", value: "john@example.com" }
  ]
})
```

---

### browser_select_option
Select an option in a dropdown.

**Parameters:**
- `element` (string, required): Human-readable element description
- `ref` (string, required): Exact target element reference from snapshot
- `values` (array, required): Values to select (single or multiple)

**Example:**
```
browser_select_option({ element: "Country dropdown", ref: "e9", values: ["US"] })
browser_select_option({ element: "Multi-select", ref: "e10", values: ["opt1", "opt2"] })
```

---

### browser_hover
Hover over an element.

**Parameters:**
- `element` (string, required): Human-readable element description
- `ref` (string, required): Exact target element reference from snapshot

**Example:**
```
browser_hover({ element: "Menu item", ref: "e11" })
```

---

### browser_drag
Drag and drop between two elements.

**Parameters:**
- `startElement` (string, required): Source element description
- `startRef` (string, required): Source element reference
- `endElement` (string, required): Target element description
- `endRef` (string, required): Target element reference

**Example:**
```
browser_drag({
  startElement: "Draggable item",
  startRef: "e15",
  endElement: "Drop zone",
  endRef: "e20"
})
```

---

### browser_press_key
Press a keyboard key.

**Parameters:**
- `key` (string, required): Key name (e.g., "Enter", "ArrowDown", "Tab", "a")

**Example:**
```
browser_press_key({ key: "Enter" })
browser_press_key({ key: "ArrowDown" })
browser_press_key({ key: "Control+a" })
```

---

### browser_wait_for
Wait for a condition.

**Parameters (at least one required):**
- `time` (number, optional): Seconds to wait
- `text` (string, optional): Text to wait for to appear
- `textGone` (string, optional): Text to wait for to disappear

**Example:**
```
browser_wait_for({ text: "Loading complete" })
browser_wait_for({ textGone: "Please wait..." })
browser_wait_for({ time: 3 })
```

---

### browser_evaluate
Execute JavaScript on the page.

**Parameters:**
- `function` (string, required): JavaScript function to execute
- `element` (string, optional): Element description (if evaluating on element)
- `ref` (string, optional): Element reference (if evaluating on element)

**Example:**
```
// Page-level evaluation
browser_evaluate({ function: "() => document.title" })

// Element-level evaluation
browser_evaluate({
  element: "Price tag",
  ref: "e25",
  function: "(element) => element.textContent"
})
```

---

### browser_run_code
Run a Playwright code snippet directly.

**Parameters:**
- `code` (string, required): Playwright code accessing the `page` object

**Example:**
```
browser_run_code({
  code: `
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForURL('**/success');
    return await page.title();
  `
})
```

---

### browser_take_screenshot
Capture a screenshot.

**Parameters:**
- `type` (string, optional): Image format (png/jpeg), defaults to png
- `filename` (string, optional): Output filename
- `element` (string, optional): Element description for element screenshot
- `ref` (string, optional): Element reference for element screenshot
- `fullPage` (boolean, optional): Capture full scrollable page

**Example:**
```
browser_take_screenshot({ filename: "current-page.png" })
browser_take_screenshot({ filename: "full.png", fullPage: true })
browser_take_screenshot({ element: "Chart", ref: "e30", filename: "chart.png" })
```

---

### browser_file_upload
Upload files to a file input.

**Parameters:**
- `paths` (array, optional): Absolute file paths to upload. Omit to cancel file chooser.

**Example:**
```
browser_file_upload({ paths: ["/path/to/file.pdf"] })
browser_file_upload({ paths: ["/path/to/file1.jpg", "/path/to/file2.jpg"] })
```

---

### browser_handle_dialog
Handle browser dialogs (alert, confirm, prompt).

**Parameters:**
- `accept` (boolean, required): Accept or dismiss the dialog
- `promptText` (string, optional): Text to enter for prompt dialogs

**Example:**
```
browser_handle_dialog({ accept: true })
browser_handle_dialog({ accept: false })
browser_handle_dialog({ accept: true, promptText: "User input" })
```

---

### browser_resize
Resize the browser viewport.

**Parameters:**
- `width` (number, required): Viewport width in pixels
- `height` (number, required): Viewport height in pixels

**Example:**
```
browser_resize({ width: 1920, height: 1080 })
browser_resize({ width: 375, height: 667 })  // Mobile viewport
```

---

### browser_close
Close the browser page.

**Parameters:** None

**Example:**
```
browser_close()
```

---

### browser_console_messages
Get console messages from the page.

**Parameters:**
- `onlyErrors` (boolean, optional): Return only error messages

**Example:**
```
browser_console_messages()
browser_console_messages({ onlyErrors: true })
```

---

### browser_network_requests
List all network requests since page load.

**Parameters:** None

**Example:**
```
browser_network_requests()
```

---

## Tab Management

### browser_tabs
Manage browser tabs.

**Parameters:**
- `action` (string, required): Operation to perform
  - `"list"` - List all tabs
  - `"new"` - Create new tab
  - `"close"` - Close tab (current if no index)
  - `"select"` - Switch to tab
- `index` (number, optional): Tab index for close/select actions

**Example:**
```
browser_tabs({ action: "list" })
browser_tabs({ action: "new" })
browser_tabs({ action: "select", index: 0 })
browser_tabs({ action: "close", index: 2 })
browser_tabs({ action: "close" })  // Close current tab
```

---

## Optional Capability Tools

### Vision Tools (--caps=vision)

#### browser_mouse_click_xy
Click at specific coordinates.

**Parameters:**
- `element` (string, required): Element description
- `x` (number, required): X coordinate
- `y` (number, required): Y coordinate

#### browser_mouse_move_xy
Move mouse to coordinates.

**Parameters:**
- `element` (string, required): Element description
- `x` (number, required): X coordinate
- `y` (number, required): Y coordinate

#### browser_mouse_drag_xy
Drag from one coordinate to another.

**Parameters:**
- `element` (string, required): Element description
- `startX`, `startY` (number, required): Start coordinates
- `endX`, `endY` (number, required): End coordinates

---

### PDF Tools (--caps=pdf)

#### browser_pdf_save
Save page as PDF.

**Parameters:**
- `filename` (string, optional): Output filename

**Example:**
```
browser_pdf_save({ filename: "page.pdf" })
```

---

### Testing Tools (--caps=testing)

#### browser_generate_locator
Generate a Playwright locator for an element.

**Parameters:**
- `element` (string, required): Element description
- `ref` (string, required): Element reference

#### browser_verify_element_visible
Verify an element is visible.

**Parameters:**
- `role` (string, required): ARIA role
- `accessibleName` (string, required): Accessible name

#### browser_verify_text_visible
Verify text is visible on page.

**Parameters:**
- `text` (string, required): Text to verify

#### browser_verify_value
Verify element value.

**Parameters:**
- `type` (string, required): Element type
- `element` (string, required): Element description
- `ref` (string, required): Element reference
- `value` (string, required): Expected value

#### browser_verify_list_visible
Verify a list with specific items is visible.

**Parameters:**
- `element` (string, required): List description
- `ref` (string, required): List reference
- `items` (array, required): Expected items

---

### Tracing Tools (--caps=tracing)

#### browser_start_tracing
Start trace recording.

**Parameters:** None

#### browser_stop_tracing
Stop trace recording and save.

**Parameters:** None

---

## Browser Installation

### browser_install
Install the configured browser if not present.

**Parameters:** None

**Example:**
```
browser_install()
```

Use this if you get an error about the browser not being installed.
