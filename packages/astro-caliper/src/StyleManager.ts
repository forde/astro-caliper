import { IDS, CLASS_NAMES } from "./constants";
import { SettingsState } from "./state/SettingsState";

const background =
  "linear-gradient(180deg, #13151A 0%, rgba(19, 21, 26, 0.88) 100%)";
const shadow =
  "0px 0px 0px 0px rgba(19, 21, 26, 0.30), 0px 1px 2px 0px rgba(19, 21, 26, 0.29), 0px 4px 4px 0px rgba(19, 21, 26, 0.26), 0px 10px 6px 0px rgba(19, 21, 26, 0.15), 0px 17px 7px 0px rgba(19, 21, 26, 0.04), 0px 26px 7px 0px rgba(19, 21, 26, 0.01)";

export default class StyleManager {
  // breakpoints must be listed from smallest to largest
  private readonly BREAKPOINTS = [
    { name: "XS", minWidth: 0 },
    { name: "SM", minWidth: 640 },
    { name: "MD", minWidth: 768 },
    { name: "LG", minWidth: 1024 },
    { name: "XL", minWidth: 1280 },
    { name: "2XL", minWidth: 1536 },
  ];

  private readonly OUTLINE_STYLES = `
    * { outline: 1px solid rgba(255, 0, 0, 0.2) !important; }

    .${CLASS_NAMES.highlight} {
      outline: 2px solid red !important;
      outline-offset: -1px!important;
    }
  `;

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
    }
  `;

  private readonly TOOLTIP_STYLES = `
    #${IDS.tooltip}, #${IDS.breakpointIndicator} {
      color: #fff;
      font-family: monospace;
      position: fixed;
      z-index: 99999;
      padding: 8px 16px;
      color: white;
      font-size: 14px;
      font-weight: 500;
      outline: none !important;
      background: ${background};
      border-radius: 20px;
      box-shadow: ${shadow};
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

    ${this.BREAKPOINTS.map(
      (bp) => `
      @media (min-width: ${bp.minWidth}px) {
        #${IDS.breakpointIndicator}::before {
          content: '${bp.name}';
        }
      }
    `,
    ).join("\n")}

    #${IDS.settingsToggleButton} {
      cursor: pointer;
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
      outline: none !important;
    }
    #${IDS.rulerStaticEnd}, #${IDS.rulerDynamicEnd} {
      position: fixed;
      width: 12px;
      height: 12px;
      transform: translate(-50%, -50%);
      outline: none !important;
      background: ${background};
      box-shadow: ${shadow};
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
      outline: none !important;
      z-index: 99998;
    }
  `;

  private _highlightElements: boolean;

  private unsubscribeFromSettingsState: (() => void) | null = null;

  constructor() {
    this._highlightElements = SettingsState.settings.highlightElements;

    this.unsubscribeFromSettingsState = SettingsState.subscribe((state) => {
      if (this._highlightElements !== state.highlightElements) {
        this._highlightElements = state.highlightElements;
        document.getElementById(IDS.styles)?.remove();
        this.injectStyles();
      }
    });
  }

  injectStyles(): void {
    if (document.getElementById(IDS.styles)) return;

    const style = document.createElement("style");
    style.id = IDS.styles;
    style.textContent = `
      ${this.RESET_STYLES}
      ${this._highlightElements ? this.OUTLINE_STYLES : ""}
      ${this.TOOLTIP_STYLES}
      ${this.BREAKPOINT_INDICATOR_STYLES}
      ${this.RULER_STYLES}
    `;
    document.head.appendChild(style);
  }

  removeStyles(): void {
    document.getElementById(IDS.styles)?.remove();

    this.unsubscribeFromSettingsState?.();
  }
}
