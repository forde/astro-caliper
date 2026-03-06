import { defineToolbarApp } from "astro/toolbar";
import type { DevToolbarApp } from "astro";
import BreakpointManager from "./BreakpointManager";
import TooltipManager from "./TooltipManager";
import StyleManager from "./StyleManager";
import RulerManager from "./RulerManager";
import InspectorManager from "./InspectorManager";
import { ToolbarAppEventTarget } from "astro/runtime/client/dev-toolbar/helpers.js";
import ClickManager from "./ClickManager";
import Settingsmanager from "./SettingsManager";
import { SettingsState } from "./state/SettingsState";

export interface AppConfig {}

const bootstrap = (
  canvas: ShadowRoot,
  app: ToolbarAppEventTarget,
  config: AppConfig,
) => {
  const styleManager = new StyleManager();
  const breakpointManager = new BreakpointManager();
  const ruler = new RulerManager();
  const tooltip = new TooltipManager();
  const inspector = new InspectorManager();
  const clickManager = new ClickManager();

  Settingsmanager.init(canvas);

  const enableFeatures = (): void => {
    SettingsState.update({ enabled: true, settingsWindowVisible: false });
    styleManager.inject();
    breakpointManager.create();
    tooltip.create();
    ruler.create();
    inspector.create();
    clickManager.create();
  };

  const disableFeatures = (): void => {
    SettingsState.update({ enabled: false, settingsWindowVisible: false });
    styleManager.remove();
    breakpointManager.remove();
    tooltip.remove();
    ruler.remove();
    inspector.remove();
    clickManager.remove();
  };

  app.onToggled((data) => {
    if (data.state === true) {
      enableFeatures();
    } else {
      disableFeatures();
    }
  });

  if (
    SettingsState.settings.preserveEnabled &&
    SettingsState.settings.enabled
  ) {
    app.toggleState({ state: true });
  }
};

export default defineToolbarApp({
  init(canvas, app, server) {
    server.on("caliper:init-config", (config: AppConfig) => {
      bootstrap(canvas, app, config);
    });
  },
}) satisfies DevToolbarApp;
