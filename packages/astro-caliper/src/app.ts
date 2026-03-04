import { defineToolbarApp } from "astro/toolbar";
import type { DevToolbarApp } from "astro";
import AppState from "./state/AppState";
import BreakpointIndicator from "./BreakpointIndicator";
import TooltipManager from "./TooltipManager";
import StyleManager from "./StyleManager";
import RulerManager from "./RulerManager";

export default defineToolbarApp({
  init(canvas, app) {
    const appState = new AppState();
    const ruller = new RulerManager();

    const enableFeatures = (): void => {
      StyleManager.inject();
      BreakpointIndicator.create();
      TooltipManager.create();
      ruller.create();
      appState.enable();
    };

    const disableFeatures = (): void => {
      StyleManager.remove();
      BreakpointIndicator.remove();
      TooltipManager.remove();
      ruller.remove();
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
