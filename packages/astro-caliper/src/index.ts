import type { AstroIntegration } from "astro";
import { AppConfig } from "./app";
import { ToolbarIcon } from "./assets/icons.js";

export default function caliperIntegration(
  config: Partial<AppConfig> = {},
): AstroIntegration {
  return {
    name: "caliper-integration",
    hooks: {
      "astro:config:setup": ({ addDevToolbarApp }) => {
        addDevToolbarApp({
          id: "caliper",
          name: "Caliper",
          icon: ToolbarIcon,
          entrypoint: new URL("./app.js", import.meta.url).href,
        });
      },
      "astro:server:setup": ({ toolbar }) => {
        toolbar.onAppInitialized("caliper", () => {
          toolbar.send("caliper:init-config", config);
        });
      },
    },
  };
}
