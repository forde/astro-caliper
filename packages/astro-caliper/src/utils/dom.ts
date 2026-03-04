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
