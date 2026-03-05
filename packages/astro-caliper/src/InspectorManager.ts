import { IDS, CLASS_NAMES } from "./constants";
import { RulerState } from "./state/RulerState";
import { TooltipState } from "./state/TooltipState";

export default class InspectorManager {
  // Element references
  private inspectedElement: HTMLElement | null = null;
  private rulerActive: boolean = false;

  private unsubscribeFromRulerState: (() => void) | null = null;

  // Bound handlers (for proper removal)
  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseLeave: (e: MouseEvent) => void;

  constructor() {
    // Bind handlers to this instance
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseLeave = this.handleMouseLeave.bind(this);
  }

  create(): void {
    this.unsubscribeFromRulerState = RulerState.subscribe((state) => {
      this.rulerActive = state.isActive;
      if (!state.isActive) {
        // When ruler deactivates, update tooltip with current element info if available
        const target = this.getElementUnderMouse();

        if (!target) return;

        TooltipState.update({ content: this.formatTooltipContent(target) });
      }
    });

    document.addEventListener("mousemove", this.boundMouseMove);
    document.addEventListener("mouseleave", this.boundMouseLeave);
  }

  private getElementUnderMouse = () => {
    // Get all elements currently in a hover state
    const hoveredElements = document.querySelectorAll(":hover");
    // The last element in the list is the most specific (innermost) child
    return hoveredElements[hoveredElements.length - 1];
  };

  private getFontInfo = (element: Element): string => {
    if (!this.hasTextContent(element)) return "";

    const styles = window.getComputedStyle(element);

    // Get font family (clean up the string)
    let fontFamily = styles.fontFamily;
    // Take first font in the stack and remove quotes
    fontFamily = fontFamily.split(",")[0].replace(/['"]/g, "").trim();

    // Get font size
    const fontSize = styles.fontSize;

    // Get line height
    let lineHeight = styles.lineHeight;
    // Convert line-height to a ratio if it's in pixels
    if (lineHeight.endsWith("px")) {
      const lineHeightPx = parseFloat(lineHeight);
      const fontSizePx = parseFloat(fontSize);
      const ratio = (lineHeightPx / fontSizePx).toFixed(1);
      lineHeight = `${lineHeight}(${ratio})`;
    }

    // Get font weight
    const fontWeight = styles.fontWeight;

    return `${fontFamily} ${fontSize}/${lineHeight} ${fontWeight}`;
  };

  private getDimensionInfo = (element: Element): string => {
    const rect = element.getBoundingClientRect();
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    return `${width} × ${height}px`;
  };

  private formatTooltipContent = (element: Element): string => {
    const dimensionInfo = `<span id="${IDS.dimensions}">${this.getDimensionInfo(element)}</span>`;
    const fontInfo = `<span id="${IDS.font}">${this.getFontInfo(element)}</span>`;
    const tag = `<span id="${IDS.tagName}">&lt;<span>${element.tagName.toLowerCase()}</span>/&gt;</span>`;
    return `${tag} ${dimensionInfo} ${fontInfo}`;
  };

  private hasTextContent = (element: Element): boolean => {
    // Only show font info if element has direct text nodes
    for (const node of element.childNodes) {
      if (
        node.nodeType === Node.TEXT_NODE &&
        (node.textContent?.trim().length || 0) > 0
      ) {
        return true;
      }
    }
    return false;
  };

  private removeHighlight = (): void => {
    if (this.inspectedElement) {
      this.inspectedElement.classList.remove(CLASS_NAMES.highlight);
    }
  };

  private handleMouseMove = (e: MouseEvent): void => {
    if (this.rulerActive) return;

    const target = e.target as HTMLElement;

    // Skip if hovering the tooltip itself or indicators
    if (target.id === IDS.tooltip || target.id === IDS.breakpointIndicator) {
      this.removeHighlight();
      return;
    }

    // Only update dimensions if element changed
    if (this.inspectedElement !== target) {
      this.removeHighlight();
      this.inspectedElement = target;

      // Add highlight to current element
      target.classList.add(CLASS_NAMES.highlight);

      TooltipState.update({ content: this.formatTooltipContent(target) });
    }
  };

  private handleMouseLeave = (): void => {
    this.removeHighlight();
    this.inspectedElement = null;
  };

  remove(): void {
    // Remove event listeners
    document.removeEventListener("mousemove", this.boundMouseMove);
    document.removeEventListener("mouseleave", this.boundMouseLeave);

    // Clear references
    this.inspectedElement = null;

    // Unsubscribe from tooltip state updates
    this.unsubscribeFromRulerState?.();
  }

  // Static factory method if needed
  static init(): InspectorManager {
    const manager = new InspectorManager();
    manager.create();
    return manager;
  }
}
