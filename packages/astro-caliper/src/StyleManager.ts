import { IDS, CLASS_NAMES } from './constants';

export default class StyleManager {
  private static readonly DEBUG_STYLES = `
    * { outline: 1px solid rgba(255, 0, 0, 0.2) !important; }
    
    .${CLASS_NAMES.highlight} {
      outline: 2px solid red !important;
      outline-offset: -1px;
    }
  `;

  static inject(): void {
    if (document.getElementById(IDS.styles)) return;

    const style = document.createElement('style');
    style.id = IDS.styles;
    style.textContent = this.DEBUG_STYLES;
    document.head.appendChild(style);
  }

  static remove(): void {
    document.getElementById(IDS.styles)?.remove();
  }
}
