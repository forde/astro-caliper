import { IDS, CLASS_NAMES } from "./constants";
import { createContainer } from "./utils/dom";
import { RulerState } from "./state/RulerState";
import { TooltipState } from "./state/TooltopState";

export interface TooltipElement extends HTMLElement {
  eventHandlers?: {
    mouseMove: (e: MouseEvent) => void;
    mouseLeave: () => void;
    removeHighlight: () => void;
  };
}

export default class TooltipManager {
  private static readonly OFFSET = 15; // Distance from cursor
  private static readonly EDGE_PADDING = 10; // Padding from screen edges

  static create(): void {
    const tooltip = createContainer<TooltipElement>({
      id: IDS.tooltip,
    });

    if (!tooltip) return;

    let currentElement: Element | null = null;

    const removeHighlight = (): void => {
      if (currentElement) {
        currentElement.classList.remove(CLASS_NAMES.highlight);
      }
    };

    const hasTextContent = (element: Element): boolean => {
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

    const getFontInfo = (element: Element): string => {
      if (!hasTextContent(element)) return "";

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

    const positionTooltip = (e: MouseEvent, tooltip: HTMLElement): void => {
      // Get tooltip dimensions
      const tooltipRect = tooltip.getBoundingClientRect();
      const tooltipWidth = tooltipRect.width;
      const tooltipHeight = tooltipRect.height;

      // Get viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Default position (right and below cursor)
      let left = e.clientX + this.OFFSET;
      let top = e.clientY + this.OFFSET;

      // Check if tooltip would overflow right edge
      if (left + tooltipWidth + this.EDGE_PADDING > viewportWidth) {
        // Position to the left of cursor
        left = e.clientX - tooltipWidth - this.OFFSET;
      }

      // Check if tooltip would overflow bottom edge
      if (top + tooltipHeight + this.EDGE_PADDING > viewportHeight) {
        // Position above cursor
        top = e.clientY - tooltipHeight - this.OFFSET;
      }

      // Check if tooltip would overflow left edge (after repositioning)
      if (left < this.EDGE_PADDING) {
        left = this.EDGE_PADDING;
      }

      // Check if tooltip would overflow top edge (after repositioning)
      if (top < this.EDGE_PADDING) {
        top = this.EDGE_PADDING;
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    };

    const handleMouseMove = (e: MouseEvent): void => {
      const target = e.target as Element;

      // Skip if hovering the tooltip itself or indicators
      if (target.id === IDS.tooltip || target.id === IDS.breakpointIndicator) {
        tooltip.style.opacity = "0";
        removeHighlight();
        return;
      }

      // Only update dimensions if element changed
      if (!RulerState.isActive && currentElement !== target) {
        removeHighlight();
        currentElement = target;

        // Add highlight to current element
        target.classList.add(CLASS_NAMES.highlight);

        const rect = target.getBoundingClientRect();
        const width = Math.round(rect.width);
        const height = Math.round(rect.height);
        const dimensionInfo = `${width} × ${height}px`;
        const fontInfo = getFontInfo(target);

        tooltip.innerHTML = `${dimensionInfo} ${fontInfo}`;
        tooltip.style.opacity = "1";
      }

      if (RulerState.isActive) {
        tooltip.innerHTML = `X ${RulerState.dx} Y ${RulerState.dy}`;
        tooltip.style.opacity = "1";
      }

      // Always update position on mouse move
      positionTooltip(e, tooltip);
    };

    const handleMouseLeave = (): void => {
      tooltip.style.opacity = "0";
      removeHighlight();
      currentElement = null;
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Store event handlers for cleanup
    tooltip.eventHandlers = {
      mouseMove: handleMouseMove,
      mouseLeave: handleMouseLeave,
      removeHighlight,
    };
  }

  static remove(): void {
    const tooltip = document.getElementById(
      IDS.tooltip,
    ) as TooltipElement | null;
    if (!tooltip) return;

    const handlers = tooltip.eventHandlers;
    if (handlers) {
      handlers.removeHighlight();
      document.removeEventListener("mousemove", handlers.mouseMove);
      document.removeEventListener("mouseleave", handlers.mouseLeave);
    }

    tooltip.remove();
  }
}
