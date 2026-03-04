import type { AstroIntegration } from "astro";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const toolbarIcon = readFileSync(
  join(__dirname, "assets/toolbar-icon.svg"),
  "utf-8",
);

export default function caliperIntegration(): AstroIntegration {
  return {
    name: "caliper-integration",
    hooks: {
      "astro:config:setup": ({ addDevToolbarApp }) => {
        addDevToolbarApp({
          id: "caliper",
          name: "Caliper",
          icon: toolbarIcon,
          entrypoint: new URL("./app.js", import.meta.url).href,
        });
      },
    },
  };
}
