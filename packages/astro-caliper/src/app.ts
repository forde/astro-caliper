import { defineToolbarApp } from 'astro/toolbar';
import type { DevToolbarApp } from 'astro';
import StateManager from './StateManager';
import BreakpointIndicator from './BreakpointIndicator';
import TooltipManager from './TooltipManager';
import StyleManager from './StyleManager';

export default defineToolbarApp({
  init(canvas, app) {
    const state = new StateManager();

    const enableFeatures = (): void => {
      StyleManager.inject();
      BreakpointIndicator.create();
      TooltipManager.create();
      state.enable();
    };

    const disableFeatures = (): void => {
      StyleManager.remove();
      BreakpointIndicator.remove();
      TooltipManager.remove();
      state.disable();
    };

    app.onToggled(data => {
      if (data.state === true) {
        enableFeatures();
      } else {
        disableFeatures();
      }
    });

    // Auto-enable if was previously enabled
    if (state.isEnabled()) {
      app.toggleState({ state: true });
    }
  },
}) satisfies DevToolbarApp;
