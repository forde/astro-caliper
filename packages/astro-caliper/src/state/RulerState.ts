type RulerStateListener = (state: {
  dx: number;
  dy: number;
  isActive: boolean;
}) => void;

class RulerStateManager {
  private _dx: number = 0;
  private _dy: number = 0;
  private _isActive: boolean = false;
  private listeners: Set<RulerStateListener> = new Set();

  get dx(): number {
    return this._dx;
  }
  get dy(): number {
    return this._dy;
  }
  get isActive(): boolean {
    return this._isActive;
  }

  update(dx: number, dy: number, isActive: boolean): void {
    this._dx = dx;
    this._dy = dy;
    this._isActive = isActive;
    this.notify();
  }

  reset(): void {
    this._dx = 0;
    this._dy = 0;
    this._isActive = false;
    this.notify();
  }

  subscribe(listener: RulerStateListener): () => void {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const state = { dx: this._dx, dy: this._dy, isActive: this._isActive };
    this.listeners.forEach((listener) => listener(state));
  }
}

export const RulerState = new RulerStateManager();
