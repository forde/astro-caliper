import { STORAGE_KEY } from "./constants";

export default class StateManager {
  private enabled = false;

  constructor() {
    this.enabled = localStorage.getItem(STORAGE_KEY) === "true";
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    localStorage.setItem(STORAGE_KEY, this.enabled.toString());
    return this.enabled;
  }

  enable(): boolean {
    this.enabled = true;
    localStorage.setItem(STORAGE_KEY, this.enabled.toString());
    return this.enabled;
  }

  disable(): boolean {
    this.enabled = false;
    localStorage.setItem(STORAGE_KEY, this.enabled.toString());
    return this.enabled;
  }
}
