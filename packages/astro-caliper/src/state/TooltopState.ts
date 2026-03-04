type TooltipStateListener = (state: { content: string }) => void;

class TooltipStateManager {
  private _content: string = "";
  private listeners: Set<TooltipStateListener> = new Set();

  get content(): string {
    return this._content;
  }

  update(content: string): void {
    this._content = content;
    this.notify();
  }

  reset(): void {
    this._content = "";
    this.notify();
  }

  subscribe(listener: TooltipStateListener): () => void {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const state = { content: this._content };
    this.listeners.forEach((listener) => listener(state));
  }
}

export const TooltipState = new TooltipStateManager();
