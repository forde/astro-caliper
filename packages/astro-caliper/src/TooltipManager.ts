import { IDS } from "./constants";
import { createContainer } from "./utils/dom";
import { TooltipState } from "./state/TooltopState";

export default class TooltipManager {
  private readonly OFFSET = 15; // Distance from cursor
  private readonly EDGE_PADDING = 10; // Padding from screen edges

  private unsubscribeFromTooltipState: (() => void) | null = null;

  // Element references
  private tooltip: HTMLElement | null = null;

  // Bound handlers (for proper removal)
  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseLeave: (e: MouseEvent) => void;

  constructor() {
    // Bind handlers to this instance
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundMouseLeave = this.handleMouseLeave.bind(this);
  }

  create(): void {
    // Prevent duplicate creation
    if (document.getElementById(IDS.tooltip)) return;

    this.tooltip = createContainer<HTMLElement>({
      id: IDS.tooltip,
    });

    if (!this.tooltip) return;

    this.unsubscribeFromTooltipState = TooltipState.subscribe((state) => {
      if (!this.tooltip) return;
      this.tooltip.innerHTML = state.content;
    });

    document.addEventListener("mousemove", this.boundMouseMove);
    document.addEventListener("mouseleave", this.boundMouseLeave);
  }

  private positionTooltip = (e: MouseEvent): void => {
    if (!this.tooltip) return;
    // Get tooltip dimensions
    const tooltipRect = this.tooltip.getBoundingClientRect();
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

    this.tooltip.style.left = `${left}px`;
    this.tooltip.style.top = `${top}px`;
  };

  private handleMouseMove = (e: MouseEvent): void => {
    if (!this.tooltip) return;

    const target = e.target as HTMLElement;

    // Skip if hovering the tooltip itself or indicators
    if (
      target.id === IDS.tooltip ||
      target.id === IDS.breakpointIndicator ||
      target.closest("astro-dev-toolbar") !== null
    ) {
      this.tooltip.style.opacity = "0";
      return;
    }

    this.tooltip.style.opacity = "1";
    this.positionTooltip(e);
  };

  private handleMouseLeave = (): void => {
    if (!this.tooltip) return;
    this.tooltip.style.opacity = "0";
  };

  remove(): void {
    // Remove event listeners
    document.removeEventListener("mousemove", this.boundMouseMove);
    document.removeEventListener("mouseleave", this.boundMouseLeave);

    // Remove element
    this.tooltip?.remove();

    this.unsubscribeFromTooltipState?.();

    // Clear references
    this.tooltip = null;
  }

  // Static factory method if needed
  static init(): TooltipManager {
    const manager = new TooltipManager();
    manager.create();
    return manager;
  }
}
