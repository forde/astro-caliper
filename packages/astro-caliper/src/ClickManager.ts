import { TooltipState } from "./state/TooltipState";
import { isInputFocused } from "./utils/dom";

export default class ClickManager {
  private preventDefault: boolean = false;

  // Bound handlers (for proper removal)
  private boundClick: (e: MouseEvent) => void;
  private boundKeyDown: (e: KeyboardEvent) => void;
  private boundKeyUp: (e: KeyboardEvent) => void;

  constructor() {
    this.boundClick = this.handleClick.bind(this);
    this.boundKeyDown = this.handleKeyDown.bind(this);
    this.boundKeyUp = this.handleKeyUp.bind(this);
  }

  create(): void {
    document.addEventListener("click", this.boundClick);
    document.addEventListener("keydown", this.boundKeyDown);
    document.addEventListener("keyup", this.boundKeyUp);
  }

  remove(): void {
    document.removeEventListener("click", this.boundClick);
    document.removeEventListener("keydown", this.boundKeyDown);
    document.removeEventListener("keyup", this.boundKeyUp);
  }

  private handleClick(e: MouseEvent): void {
    if (this.preventDefault) {
      e.preventDefault();
    }
  }

  private handleKeyDown(e: KeyboardEvent): void {
    const inputFocused = isInputFocused();

    if (e.key === "p" && !this.preventDefault && !inputFocused) {
      this.preventDefault = true;
      TooltipState.update({ mode: "click-prevention" });
    }
  }

  private handleKeyUp(e: KeyboardEvent): void {
    if (e.key === "p" && this.preventDefault) {
      this.preventDefault = false;
      TooltipState.update({ mode: "default" });
    }
  }

  // Static factory method if needed
  static init(): ClickManager {
    const manager = new ClickManager();
    manager.create();
    return manager;
  }
}
