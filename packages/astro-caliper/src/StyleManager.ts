import { IDS, CLASS_NAMES } from "./constants";
import { SettingsState } from "./state/SettingsState";
import { AppConfig } from "./app";
import { sanitizeBreakpointName, sanitizeWidth } from "./utils/sanitize";

export default class StyleManager {
  private APP_CONFIG: AppConfig;

  private _sanitizedBreakpointsCache: AppConfig["breakpoints"] | null = null;

  private readonly BACKGROUND =
    "linear-gradient(180deg, #13151A 0%, rgba(19, 21, 26, 0.88) 100%)";
  private readonly SHADOW =
    "0px 0px 0px 0px rgba(19, 21, 26, 0.30), 0px 1px 2px 0px rgba(19, 21, 26, 0.29), 0px 4px 4px 0px rgba(19, 21, 26, 0.26), 0px 10px 6px 0px rgba(19, 21, 26, 0.15), 0px 17px 7px 0px rgba(19, 21, 26, 0.04), 0px 26px 7px 0px rgba(19, 21, 26, 0.01)";

  private readonly RESET_STYLES = `
    #${IDS.tooltip}, 
    #${IDS.breakpointIndicator}, 
    #${IDS.tooltip} *, 
    #${IDS.breakpointIndicator} button, 
    #${IDS.breakpointIndicator} svg, 
    #${IDS.rulerContainer}, 
    #${IDS.rulerStaticEnd}, 
    #${IDS.rulerDynamicEnd}, 
    #${IDS.rulerLine} {
      all: unset;
      font-family: monospace;
      outline: none !important;
    }
  `;

  private readonly TOOLTIP_STYLES = `
    #${IDS.tooltip}, #${IDS.breakpointIndicator} {
      position: fixed;
      z-index: 99999;
      padding: 8px 16px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      background: ${this.BACKGROUND};
      border-radius: 20px;
      box-shadow: ${this.SHADOW};
      white-space: nowrap;
    }
    #${IDS.tooltip} *, #${IDS.breakpointIndicator} * {
      font-family: monospace;
      outline: none !important;
    }
    #${IDS.tooltipLabel} {
      font-size: 11px;
      padding: 4px 0;
      line-height: 1;
      display: block;
    }
    #${IDS.tagName} {
      color: #abb2bf;
      span {
        color: #e5c07b;
      }
    }
    #${IDS.dimensions} {
      color: #61afef;
    }
    #${IDS.font} {
      color: #8fb773;
    }
  `;

  private readonly BREAKPOINT_INDICATOR_STYLES = `
    #${IDS.breakpointIndicator} {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    #${IDS.settingsToggleButton} {
      cursor: pointer!important;
      svg {
        width: 15px;
        height: 15px;
        display: block;
        transition: transform 0.3s ease-in-out;
      }
    }
    #${IDS.settingsToggleButton}:hover svg {
      transform: rotate(90deg);
    }
  `;

  private readonly RULER_STYLES = `
    #${IDS.rulerContainer} {
      position: fixed;
      pointer-events: none;
      z-index: 99997;
      display: none;
    }
    #${IDS.rulerStaticEnd}, #${IDS.rulerDynamicEnd} {
      position: fixed;
      width: 12px;
      height: 12px;
      transform: translate(-50%, -50%);
      background: ${this.BACKGROUND};
      box-shadow: ${this.SHADOW};
      border-radius: 50%;
      padding:4px;
      box-sizing: border-box;
    }
    #${IDS.rulerStaticEnd}::after, #${IDS.rulerDynamicEnd}::after {
      content: '';
      background: #fff;
      z-index: 99999;
      position: relative;
      width: 100%;
      height: 100%;
      display: block;
      border-radius: 50%;
    }
    #${IDS.rulerLine} {
      position: fixed;
      height: 1px;
      border-top: 1px dashed #13151A;
      transform-origin: 0 50%;
      z-index: 99998;
    }
  `;

  private _highlightElements: boolean;

  private unsubscribeFromSettingsState: (() => void) | null = null;

  constructor(appConfig: AppConfig) {
    this.APP_CONFIG = appConfig;

    this._highlightElements = SettingsState.settings.highlightElements;

    this.unsubscribeFromSettingsState = SettingsState.subscribe((state) => {
      if (this._highlightElements !== state.highlightElements) {
        this._highlightElements = state.highlightElements;
        document.getElementById(IDS.styles)?.remove();
        this.injectStyles();
      }
    });
  }

  private outlineStyles(): string {
    return this._highlightElements
      ? `
      * { outline: 1px solid var(--caliper-outline-color) !important; }

      .${CLASS_NAMES.highlight} {
        outline: 2px solid var(--caliper-active-outline-color) !important;
        outline-offset: -1px!important;
      }
    `
      : ``;
  }

  private sanitizedBreakpoints(): AppConfig["breakpoints"] {
    if (this._sanitizedBreakpointsCache) {
      return this._sanitizedBreakpointsCache;
    }

    const sanitizedBreakpoints = [...this.APP_CONFIG.breakpoints]
      .map((bp) => ({
        name: sanitizeBreakpointName(bp.name),
        minWidth: sanitizeWidth(bp.minWidth),
      }))
      .filter((bp) => bp.name !== "")
      .sort((a, b) => a.minWidth - b.minWidth);

    this._sanitizedBreakpointsCache = sanitizedBreakpoints;
    return sanitizedBreakpoints;
  }

  private breakpointMediaQueries(): string {
    const breakpoints = this.sanitizedBreakpoints();

    if (breakpoints.length === 0) {
      return "";
    }

    const mediaQueries = breakpoints
      .map(
        (bp) => `
          @media (width >= ${bp.minWidth}px) {
            :root {
              --current-breakpoint: "${bp.name}";
            }
          }
        `,
      )
      .join("\n");

    return `
      :root { --current-breakpoint: "${breakpoints[0].name}"; }
      ${mediaQueries}
      #${IDS.breakpointIndicator}::before {
        content: var(--current-breakpoint);
      }
    `;
  }

  injectStyles(): void {
    if (document.getElementById(IDS.styles)) return;

    document.documentElement.style.setProperty(
      "--caliper-outline-color",
      this.APP_CONFIG.outlineColor,
    );
    document.documentElement.style.setProperty(
      "--caliper-active-outline-color",
      this.APP_CONFIG.activeOutlineColor,
    );

    const style = document.createElement("style");
    style.id = IDS.styles;
    style.textContent = `
      ${this.RESET_STYLES}
      ${this.outlineStyles()}
      ${this.TOOLTIP_STYLES}
      ${this.BREAKPOINT_INDICATOR_STYLES}
      ${this.RULER_STYLES}
      ${this.breakpointMediaQueries()}
    `;
    document.head.appendChild(style);
  }

  removeStyles(): void {
    document.getElementById(IDS.styles)?.remove();

    document.documentElement.style.removeProperty("--caliper-outline-color");
    document.documentElement.style.removeProperty(
      "--caliper-active-outline-color",
    );
    document.documentElement.style.removeProperty("--current-breakpoint");

    this.unsubscribeFromSettingsState?.();
  }
}
