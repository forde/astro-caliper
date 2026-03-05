import { defineToolbarApp } from "astro/toolbar";
import type { DevToolbarApp } from "astro";
import AppState from "./state/AppState";
import BreakpointManager from "./BreakpointManager";
import TooltipManager from "./TooltipManager";
import StyleManager from "./StyleManager";
import RulerManager from "./RulerManager";
import InspectorManager from "./InspectorManager";
import { ToolbarAppEventTarget } from "astro/runtime/client/dev-toolbar/helpers.js";
import ClickManager from "./ClickManager";

export interface AppConfig {}

const bootstrap = (app: ToolbarAppEventTarget, config: AppConfig) => {
  const styleManager = new StyleManager();
  const breakpointManager = new BreakpointManager();
  const appState = new AppState();
  const ruller = new RulerManager();
  const tooltip = new TooltipManager();
  const inspector = new InspectorManager();
  const clickManager = new ClickManager();

  const enableFeatures = (): void => {
    styleManager.inject();
    breakpointManager.create();
    tooltip.create();
    ruller.create();
    inspector.create();
    appState.enable();
    clickManager.create();
  };

  const disableFeatures = (): void => {
    styleManager.remove();
    breakpointManager.remove();
    tooltip.remove();
    ruller.remove();
    inspector.remove();
    appState.disable();
    clickManager.remove();
  };

  app.onToggled((data) => {
    if (data.state === true) {
      enableFeatures();
    } else {
      disableFeatures();
    }
  });

  if (appState.isEnabled()) {
    app.toggleState({ state: true });
  }
};

export default defineToolbarApp({
  init(canvas, app, server) {
    server.on("caliper:init-config", (config: AppConfig) => {
      bootstrap(app, config);
    });
  },
}) satisfies DevToolbarApp;
