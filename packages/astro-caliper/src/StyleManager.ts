import { IDS, CLASS_NAMES } from "./constants";

export default class StyleManager {
  private static readonly BREAKPOINTS = [
    { name: "2XL", minWidth: 1536 },
    { name: "XL", minWidth: 1280 },
    { name: "LG", minWidth: 1024 },
    { name: "MD", minWidth: 768 },
    { name: "SM", minWidth: 640 },
    { name: "XS", minWidth: 0 },
  ];
  private static readonly STYLES = `
    
    * { outline: 1px solid rgba(255, 0, 0, 0.2) !important; }
    
    .${CLASS_NAMES.highlight} {
      outline: 2px solid red !important;
      outline-offset: -1px;
    }

    ${this.BREAKPOINTS.map(
      (bp) => `
      @media (min-width: ${bp.minWidth}px) {
        #${IDS.indicator}::before {
          content: '${bp.name}';
        }
      }
    `,
    ).join("\n")}
  `;

  static inject(): void {
    if (document.getElementById(IDS.styles)) return;

    const style = document.createElement("style");
    style.id = IDS.styles;
    style.textContent = this.STYLES;
    document.head.appendChild(style);
  }

  static remove(): void {
    document.getElementById(IDS.styles)?.remove();
  }
}
