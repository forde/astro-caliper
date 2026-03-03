import type { AstroIntegration } from "astro";

const icon = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="13.7363" y="1.41421" width="6.85783" height="17.4264" transform="rotate(45 13.7363 1.41421)" stroke="white" stroke-width="2" stroke-linejoin="round"/>
<path d="M5.39795 13.3541L8.4402 16.4044" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
<line x1="8.41754" y1="12.4788" x2="10.3916" y2="14.4528" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M9.37646 9.37659L12.3588 12.4857" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
<line x1="12.3658" y1="8.53077" x2="14.3398" y2="10.5048" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>
<circle cx="13.8093" cy="6.10011" r="0.987011" fill="white"/>
</svg>`;

export default function caliperIntegration(): AstroIntegration {
  return {
    name: "caliper-integration",
    hooks: {
      "astro:config:setup": ({ addDevToolbarApp }) => {
        addDevToolbarApp({
          id: "caliper",
          name: "Caliper",
          icon: icon,
          entrypoint: new URL("./app.js", import.meta.url).href,
        });
      },
    },
  };
}
