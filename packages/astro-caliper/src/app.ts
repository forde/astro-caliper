import { defineToolbarApp } from "astro/toolbar";
import type { DevToolbarApp } from "astro";
import AppState from "./state/AppState";
import BreakpointManager from "./BreakpointManager";
import TooltipManager from "./TooltipManager";
import StyleManager from "./StyleManager";
import RulerManager from "./RulerManager";
import InspectorManager from "./InspectorManager";

export default defineToolbarApp({
  init(canvas, app) {
    const styleManager = new StyleManager();
    const breakpointManager = new BreakpointManager();
    const appState = new AppState();
    const ruller = new RulerManager();
    const tooltip = new TooltipManager();
    const inspector = new InspectorManager();

    const enableFeatures = (): void => {
      styleManager.inject();
      breakpointManager.create();
      tooltip.create();
      ruller.create();
      inspector.create();
      appState.enable();
    };

    const disableFeatures = (): void => {
      styleManager.remove();
      breakpointManager.remove();
      tooltip.remove();
      ruller.remove();
      inspector.remove();
      appState.disable();
    };

    app.onToggled((data) => {
      if (data.state === true) {
        enableFeatures();
      } else {
        disableFeatures();
      }
    });

    // Auto-enable if was previously enabled
    if (appState.isEnabled()) {
      app.toggleState({ state: true });
    }
  },
}) satisfies DevToolbarApp;
