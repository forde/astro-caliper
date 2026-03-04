import { IDS } from "./constants";
import { createContainer } from "./utils/dom";
import { RulerState } from "./state/RulerState";
import { TooltipState } from "./state/TooltopState";

export interface RullerElement extends HTMLElement {
  eventHandlers?: {
    mouseMove: (e: MouseEvent) => void;
    keyUp: (e: KeyboardEvent) => void;
    keyDown: (e: KeyboardEvent) => void;
  };
}

export interface RulerElement extends HTMLElement {
  rulerManager?: RulerManager;
}

export default class RulerManager {
  private isActive: boolean = false;
  private staticX: number = 0;
  private staticY: number = 0;
  private currentMouseX: number = 0;
  private currentMouseY: number = 0;

  // Element references
  private container: RulerElement | null = null;
  private staticEnd: HTMLElement | null = null;
  private dynamicEnd: HTMLElement | null = null;
  private line: HTMLElement | null = null;

  // Bound handlers (for proper removal)
  private boundMouseMove: (e: MouseEvent) => void;
  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;

  constructor() {
    // Bind handlers to this instance
    this.boundMouseMove = this.handleMouseMove.bind(this);
    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.boundKeyUp = this.handleKeyUp.bind(this);
  }

  create(): void {
    // Prevent duplicate creation
    if (document.getElementById(IDS.rulerContainer)) return;

    this.container = createContainer<RulerElement>({ id: IDS.rulerContainer });
    this.staticEnd = createContainer({ id: IDS.rulerStaticEnd });
    this.dynamicEnd = createContainer({ id: IDS.rulerDynamicEnd });
    this.line = createContainer({ id: IDS.rulerLine });

    if (!this.container || !this.staticEnd || !this.dynamicEnd || !this.line)
      return;

    this.container.appendChild(this.line);
    this.container.appendChild(this.staticEnd);
    this.container.appendChild(this.dynamicEnd);

    // Store reference to manager on element for cleanup
    this.container.rulerManager = this;

    // Attach event listeners
    document.addEventListener("mousemove", this.boundMouseMove);
    document.addEventListener("keydown", this.boundKeyDown);
    document.addEventListener("keyup", this.boundKeyUp);
  }

  remove(): void {
    // Remove event listeners
    document.removeEventListener("mousemove", this.boundMouseMove);
    document.removeEventListener("keydown", this.boundKeyDown);
    document.removeEventListener("keyup", this.boundKeyUp);

    // Remove element
    this.container?.remove();

    // Clear references
    this.container = null;
    this.staticEnd = null;
    this.dynamicEnd = null;
    this.line = null;
  }

  private updateLine(): void {
    if (!this.line) return;

    const dx = this.currentMouseX - this.staticX;
    const dy = this.currentMouseY - this.staticY;
    const length = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    this.line.style.left = `${this.staticX}px`;
    this.line.style.top = `${this.staticY}px`;
    this.line.style.width = `${length}px`;
    this.line.style.transform = `rotate(${angle}deg)`;
  }

  private updateDynamicEnd(): void {
    if (!this.dynamicEnd) return;

    this.dynamicEnd.style.left = `${this.currentMouseX}px`;
    this.dynamicEnd.style.top = `${this.currentMouseY}px`;
  }

  private handleMouseMove(e: MouseEvent): void {
    this.currentMouseX = e.clientX;
    this.currentMouseY = e.clientY;

    if (this.isActive) {
      const dx = Math.abs(this.currentMouseX - this.staticX);
      const dy = Math.abs(this.currentMouseY - this.staticY);

      RulerState.update(dx, dy, true);
      TooltipState.update(`X ${dx} Y ${dy}`);

      this.updateDynamicEnd();
      this.updateLine();
    }
  }

  private handleKeyDown(e: KeyboardEvent): void {
    if (e.key === "Alt" && !this.isActive) {
      e.preventDefault();
      this.isActive = true;

      this.staticX = this.currentMouseX;
      this.staticY = this.currentMouseY;

      if (this.staticEnd) {
        this.staticEnd.style.left = `${this.staticX}px`;
        this.staticEnd.style.top = `${this.staticY}px`;
      }

      this.updateDynamicEnd();
      this.updateLine();
      this.container?.style.setProperty("display", "block");

      RulerState.update(0, 0, true);
      TooltipState.update(`X 0 Y 0`);
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    if (e.key === "Alt" && this.isActive) {
      this.isActive = false;
      RulerState.reset();
      this.container?.style.setProperty("display", "none");
    }
  }

  // Static factory method if you need it
  static init(): RulerManager {
    const manager = new RulerManager();
    manager.create();
    return manager;
  }
}
