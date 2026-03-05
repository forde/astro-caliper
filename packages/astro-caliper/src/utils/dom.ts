export interface ContainerOptions {
  id: string;
  styles?: string;
  className?: string;
}

export function createContainer<T extends HTMLElement = HTMLDivElement>(
  options: ContainerOptions,
): T | null {
  if (document.getElementById(options.id)) {
    return null;
  }

  const container = document.createElement("div") as unknown as T;
  container.id = options.id;
  if (options.styles) {
    container.style.cssText = options.styles;
  }
  if (options.className) {
    container.className = options.className;
  }

  document.body.appendChild(container);
  return container;
}

export function removeContainer(id: string): boolean {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
    return true;
  }
  return false;
}

export function isInputFocused(): boolean {
  const active = document.activeElement;
  if (!active) return false;

  const tag = active.tagName.toLowerCase();
  const isEditable =
    active.hasAttribute("contenteditable") &&
    active.getAttribute("contenteditable") !== "false";

  return ["input", "textarea", "select"].includes(tag) || isEditable;
}

export function isLocalStorageAvailable(): boolean {
  try {
    const testKey = "__storage_test__";
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // Everything was fine, but the storage is full
      (e.name === "QuotaExceededError" ||
        // Older Firefox name for the same thing
        e.name === "NS_ERROR_DOM_QUOTA_REACHED" ||
        // User has blocked cookies/storage (SecurityError)
        e.name === "NotAllowedError" ||
        e.name === "SecurityError")
    );
  }
}
