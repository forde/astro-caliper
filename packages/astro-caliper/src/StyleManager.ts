import { IDS, CLASS_NAMES } from "./constants";

export default class StyleManager {
  // breakpoints must be listed from smallest to largest
  private static readonly BREAKPOINTS = [
    { name: "XS", minWidth: 0 },
    { name: "SM", minWidth: 640 },
    { name: "MD", minWidth: 768 },
    { name: "LG", minWidth: 1024 },
    { name: "XL", minWidth: 1280 },
    { name: "2XL", minWidth: 1536 },
  ];

  private static readonly OUTLINE_STYLES = `
    * { outline: 1px solid rgba(255, 0, 0, 0.2) !important; }

    .${CLASS_NAMES.highlight} {
      outline: 2px solid red !important;
      outline-offset: -1px;
    }
  `;

  private static readonly TOOLTIP_STYLES = `
    #${IDS.tooltip}, #${IDS.breakpointIndicator} {
      position: fixed;
      z-index: 99999;
      padding: 8px 16px;
      color: white;
      font-family: monospace;
      font-size: 14px;
      font-weight: medium;
      pointer-events: none;
      outline: none !important;
      background: linear-gradient(180deg, #13151A 0%, rgba(19, 21, 26, 0.88) 100%);
      border-radius: 20px;
      box-shadow: 0px 0px 0px 0px rgba(19, 21, 26, 0.30), 0px 1px 2px 0px rgba(19, 21, 26, 0.29), 0px 4px 4px 0px rgba(19, 21, 26, 0.26), 0px 10px 6px 0px rgba(19, 21, 26, 0.15), 0px 17px 7px 0px rgba(19, 21, 26, 0.04), 0px 26px 7px 0px rgba(19, 21, 26, 0.01);
      white-space: nowrap;
    }
  `;

  private static readonly BREAKPOINT_INDICATOR_STYLES = `
    ${this.BREAKPOINTS.map(
      (bp) => `
      @media (min-width: ${bp.minWidth}px) {
        #${IDS.breakpointIndicator}::before {
          content: '${bp.name}';
        }
      }
    `,
    ).join("\n")}
  `;

  private static readonly RULLER_STYLES = `
    #${IDS.rulerContainer} {
      position: fixed;
      pointer-events: none;
      z-index: 99997;
      display: none;
      outline: none !important;
    }
    #${IDS.rulerStaticEnd}, #${IDS.rulerDynamicEnd} {
      position: fixed;
      width: 24px;
      height: 24px;
      transform: translate(-50%, -50%);
      outline: none !important;
      background: rgba(255,255,255, .6);
      border-radius: 50%;
    }
    #${IDS.rulerStaticEnd}::before, #${IDS.rulerDynamicEnd}::before,
    #${IDS.rulerStaticEnd}::after, #${IDS.rulerDynamicEnd}::after {
      content: '';
      position: absolute;
      background: #13151A;
    }
    #${IDS.rulerStaticEnd}::before, #${IDS.rulerDynamicEnd}::before {
      width: 2px;
      height: 80%;
      top: 10%;
      left: 50%;
      transform: translateX(-50%);
    }
    #${IDS.rulerStaticEnd}::after, #${IDS.rulerDynamicEnd}::after {
      height: 2px;
      width: 80%;
      left: 10%;
      top: 50%;
      transform: translateY(-50%);
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

  static inject(): void {
    if (document.getElementById(IDS.styles)) return;

    const style = document.createElement("style");
    style.id = IDS.styles;
    style.textContent = `
      ${this.OUTLINE_STYLES}
      ${this.TOOLTIP_STYLES}
      ${this.BREAKPOINT_INDICATOR_STYLES}
      ${this.RULLER_STYLES}
    `;
    document.head.appendChild(style);
  }

  static remove(): void {
    document.getElementById(IDS.styles)?.remove();
  }
}
