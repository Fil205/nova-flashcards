import { d as attr_class, i as clsx, b as attr, f as derived } from "./index.js";
function GlassCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      pad = "md",
      hoverable = false,
      class: extraClass = "",
      onclick,
      children
    } = $$props;
    const pads = { none: "", sm: "p-4", md: "p-5", lg: "p-6" };
    const cls = derived(() => [
      "glass",
      pads[pad],
      hoverable ? "glass-hover cursor-pointer" : "",
      extraClass
    ].filter(Boolean).join(" "));
    $$renderer2.push(`<div${attr_class(clsx(cls()))}${attr("role", onclick ? "button" : void 0)}${attr("tabindex", onclick ? 0 : void 0)}>`);
    if (children) {
      $$renderer2.push("<!--[0-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  GlassCard as G
};
