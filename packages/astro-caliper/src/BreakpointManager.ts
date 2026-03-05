import { IDS } from "./constants";
import { createContainer } from "./utils/dom";
import { CogIcon } from "./assets/icons";
import { SettingsState } from "./state/SettingsState";

interface BreakpointIndicatorInt extends HTMLElement {
  resizeObserver?: ResizeObserver;
}

export default class BreakpointIndicator {
  private readonly POSITION_STYLES = `
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
  `;

  create(): void {
    const indicator = createContainer<BreakpointIndicatorInt>({
      id: IDS.breakpointIndicator,
      styles: this.POSITION_STYLES,
    });

    if (!indicator) return;

    this.updateText(indicator);

    // Setup resize observer
    const resizeObserver = new ResizeObserver(() => {
      this.updateText(indicator);
    });
    resizeObserver.observe(document.body);

    // Store observer for cleanup
    indicator.resizeObserver = resizeObserver;
  }

  private updateText(indicator: HTMLElement): void {
    const width = window.innerWidth;
    indicator.innerHTML = ` (${width}px) `;
    indicator.appendChild(this.settingsToggle());
  }

  private settingsToggle(): HTMLElement {
    const button = document.createElement("button");
    button.id = IDS.settingsToggleButton;
    button.addEventListener("click", () => {
      SettingsState.update({
        settingsWindowVisible: !SettingsState.settings.settingsWindowVisible,
      });
    });
    button.innerHTML = CogIcon;
    return button;
  }

  remove(): void {
    const indicator = document.getElementById(
      IDS.breakpointIndicator,
    ) as BreakpointIndicatorInt | null;
    if (!indicator) return;

    indicator.resizeObserver?.disconnect();
    indicator.remove();
  }
}
