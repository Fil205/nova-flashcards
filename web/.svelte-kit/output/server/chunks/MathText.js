import { d as attr_class, i as clsx, f as derived, s as stringify } from "./index.js";
import { r as renderRich } from "./katex.min.js";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function MathText($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { text, class: cls = "", block = false } = $$props;
    const html$1 = derived(() => renderRich(text, { inline: !block }));
    if (block) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class(`md ${stringify(cls)}`)}>${html(html$1())}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<span${attr_class(clsx(cls))}>${html(html$1())}</span>`);
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  MathText as M
};
