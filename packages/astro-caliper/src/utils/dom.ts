/**
 * DOM utilities for creating dev tool UI elements.
 */

/**
 * Options for creating an overlay container.
 */
export interface ContainerOptions {
  /** Unique ID for the container element */
  id: string;
  /** CSS styles to apply (in cssText format) */
  styles: string;
  /** Optional CSS class names */
  className?: string;
}

/**
 * Creates a fixed-position overlay container element.
 * Returns null if an element with the same ID already exists.
 *
 * @param options - Configuration for the container
 * @returns The created element, or null if it already exists
 */
export function createContainer<T extends HTMLElement = HTMLDivElement>(options: ContainerOptions): T | null {
  // Prevent duplicate containers
  if (document.getElementById(options.id)) {
    return null;
  }

  const container = document.createElement('div') as unknown as T;
  container.id = options.id;
  container.style.cssText = options.styles;

  if (options.className) {
    container.className = options.className;
  }

  document.body.appendChild(container);
  return container;
}

/**
 * Removes an element by ID if it exists.
 *
 * @param id - The ID of the element to remove
 * @returns true if the element was found and removed, false otherwise
 */
export function removeContainer(id: string): boolean {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
    return true;
  }
  return false;
}
