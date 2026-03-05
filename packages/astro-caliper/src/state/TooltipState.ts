export type TooltipMode = "default" | "click-prevention" | "ruller";

export interface TooltipStateInterface {
  content: string;
  mode: TooltipMode;
}

export type TooltipStateListener = (state: TooltipStateInterface) => void;

class TooltipStateManager {
  private _content: string = "";
  private _mode: TooltipMode = "default";

  private listeners: Set<TooltipStateListener> = new Set();

  get content(): string {
    return this._content;
  }

  get mode(): TooltipMode {
    return this._mode;
  }

  update({ content, mode }: Partial<TooltipStateInterface>): void {
    this._content = content ?? this._content;
    this._mode = mode ?? this._mode;
    this.notify();
  }

  reset(): void {
    this._content = "";
    this._mode = "default";
    this.notify();
  }

  subscribe(listener: TooltipStateListener): () => void {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const state = { content: this._content, mode: this._mode };
    this.listeners.forEach((listener) => listener(state));
  }
}

export const TooltipState = new TooltipStateManager();
