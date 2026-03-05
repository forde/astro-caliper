import { SettingsState, SettingsInterface } from "./state/SettingsState";

interface Setting<K extends keyof SettingsInterface> {
  title?: string;
  description?: string;
  name: K;
  value: SettingsInterface[K];
}

export default class SettingsManager {
  private window: HTMLElement;

  private readonly STYLES = `
    h1 {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      color: #fff;
      margin: 0;
      font-size: 22px;
      div {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        span {
          width: 1em;
          display: flex;
          align-items: initial;
        }
      }
    }

    hr {
      display: block;
      color: gray;
      unicode-bidi: isolate;
      overflow: hidden;
      border: 1px solid rgba(27, 30, 36, 1);
      margin: 1em 0;
    }

    label {
      font-size: 14px;
      line-height: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      section {
        max-width: 67%;
        color: rgba(191, 193, 201, 1);
        h3 {
          font-size: 16px;
          font-weight: 400;
          color: white;
          margin: 0 0 4px;
        }
      }
    }
  `;
  constructor(canvas: ShadowRoot) {
    const style = document.createElement("style");
    style.textContent = this.STYLES;
    canvas.appendChild(style);

    this.window = document.createElement("astro-dev-toolbar-window");

    this.renderTitle();
    this.renderHr();
    this.renderToggle({
      title: "Preserve state",
      description: "Preserve Caliper ON state between page reloads.",
      name: "preserveEnabled",
      value: true,
    } as Setting<"preserveEnabled">);
    this.renderHr();
    this.renderToggle({
      title: "Show tag info",
      name: "showTagInfo",
      value: true,
    } as Setting<"showTagInfo">);
    this.renderBr();
    this.renderToggle({
      title: "Show dimensions",
      name: "showDimensions",
      value: true,
    } as Setting<"showDimensions">);
    this.renderBr();
    this.renderToggle({
      title: "Show font info",
      name: "showFontInfo",
      value: true,
    } as Setting<"showFontInfo">);
    this.renderHr();

    this.window.style.display = "none"; // start hidden
    canvas.appendChild(this.window);

    SettingsState.subscribe((state) => {
      if (state.settingsWindowVisible && this.window.style.display === "none") {
        this.window.style.display = "block";
      } else if (
        !state.settingsWindowVisible &&
        this.window.style.display === "block"
      ) {
        this.window.style.display = "none";
      }
    });
  }

  private renderTitle() {
    const title = document.createElement("h1");
    title.innerHTML = `
      <div>
        <span>
          <astro-dev-toolbar-icon icon="gear"></astro-dev-toolbar-icon>
        </span>
        Caliper settings
      </div>
    `;

    const closeButton = document.createElement("astro-dev-toolbar-button");
    closeButton.textContent = "Close";
    closeButton.buttonStyle = "outline";
    closeButton.size = "medium";
    closeButton.addEventListener("click", () => {
      SettingsState.update({ settingsWindowVisible: false });
    });

    title.appendChild(closeButton);

    this.window.appendChild(title);
  }

  private renderHr() {
    const hr = document.createElement("hr");
    this.window.appendChild(hr);
  }

  private renderBr() {
    const br = document.createElement("br");
    this.window.appendChild(br);
  }

  private renderToggle<K extends keyof SettingsInterface>({
    title,
    description,
    name,
    value,
  }: Setting<K>) {
    const label = document.createElement("label");
    label.innerHTML = `
      <section>
        ${title ? `<h3>${title}</h3>` : ""}
        ${description || ""}
      </section>
    `;

    const toggle = document.createElement("astro-dev-toolbar-toggle");
    toggle.input.checked = SettingsState.settings[name] as boolean;
    label.appendChild(toggle);

    toggle.input.addEventListener("change", (evt) => {
      const target = evt.currentTarget as HTMLInputElement;
      SettingsState.update({
        [name]: target.checked,
      } as Partial<SettingsInterface>);
    });

    this.window.appendChild(label);
  }

  static init(canvas: ShadowRoot): SettingsManager {
    const manager = new SettingsManager(canvas);
    return manager;
  }
}
