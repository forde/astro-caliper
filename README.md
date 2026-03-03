# Astro Caliper

Caliper is a Astro toolbar app designed to assist developers in converting designs to code. It provides visual aids and inspection tools directly within the browser.

## Features

When enabled via the Astro Developer Toolbar, this app activates the following features:

### 1. Breakpoint Indicator

Displays a fixed indicator at the top of the screen showing the current Tailwind CSS breakpoint and window width.

- **Visuals**: A pill-shaped badge at the top center.
- **Info**: Shows `XS`, `SM`, `MD`, `LG`, or `XL` based on current Tailwind CSS breakpoints, along with the exact pixel width (e.g., `(1024px)`).
- **Updates**: Updates in real-time as you resize the window.

### 2. Tooltip Inspector

Provides detailed information about elements when you hover over them.

- **Dimensions**: Shows the width and height of the hovered element.
- **Font Info**: Displays font family, size, line height, and font weight for elements with text content.
- **Highlight**: Adds a red outline to the element currently being inspected.
- **Smart Positioning**: The tooltip automatically positions itself to stay within the viewport.

### 3. Debug Styles

Injects global debug styles to help visualize element boundaries.

- **Outlines**: Adds a subtle red outline to _all_ elements to help see layout structure.
- **Highlight**: Provides a stronger outline for the currently inspected element.

## Installation & Integration

Install with ...

To use it in your Astro config:

```typescript
//astro.config.mjs
import caliper from "astro-caliper";

export default defineConfig({
  integrations: [caliper()],
});
```

## Usage

1.  Run your Astro dev server (`npm run dev`).
2.  Open the Astro Developer Toolbar (usually at the bottom of the screen).
3.  Click on the "Dev Tools" ruler icon to oggle the tools.

> **Note**: The app persists its enabled/disabled state using `localStorage`. This means the tools will remain active between page reloads if they were previously enabled.
