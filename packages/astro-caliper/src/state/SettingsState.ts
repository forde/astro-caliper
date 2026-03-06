import { STORAGE_KEY } from "../constants";
import { isLocalStorageAvailable } from "../utils/dom";

export interface SettingsInterface {
  enabled: boolean;
  preserveEnabled: boolean;
  settingsWindowVisible: boolean;
  showTagInfo: boolean;
  showDimensions: boolean;
  showFontInfo: boolean;
  highlightElements: boolean;
}

export type SettingsStateListener = (state: SettingsInterface) => void;

const defaults: SettingsInterface = {
  enabled: false,
  preserveEnabled: true,
  settingsWindowVisible: false,
  showTagInfo: true,
  showDimensions: true,
  showFontInfo: true,
  highlightElements: true,
};

class SettingsStateManager {
  private _settings: SettingsInterface = defaults;

  private localStorageAvailable: boolean;

  private listeners: Set<SettingsStateListener> = new Set();

  get settings(): SettingsInterface {
    return this._settings;
  }

  constructor() {
    this.localStorageAvailable = isLocalStorageAvailable();
    if (this.localStorageAvailable) {
      const settings = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || JSON.stringify(defaults),
      );
      this._settings = { ...this._settings, ...settings };
    } else {
      console.warn(
        "LocalStorage is not available. Settings will not persist across sessions.",
      );
    }
  }

  update(settings: Partial<SettingsInterface>): void {
    this._settings = { ...this._settings, ...settings };
    if (this.localStorageAvailable) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._settings));
    }
    this.notify();
  }

  subscribe(listener: SettingsStateListener): () => void {
    this.listeners.add(listener);
    // Return unsubscribe function
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const state = this._settings;
    this.listeners.forEach((listener) => listener(state));
  }
}

export const SettingsState = new SettingsStateManager();
