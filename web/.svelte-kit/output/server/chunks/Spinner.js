import { b as attr, d as attr_class, s as stringify } from "./index.js";
function Spinner($$renderer, $$props) {
  let { size = 24, class: cls = "" } = $$props;
  $$renderer.push(`<svg${attr("width", size)}${attr("height", size)} viewBox="0 0 24 24" fill="none"${attr_class(`animate-spin ${stringify(cls)}`)} aria-hidden="true"><circle class="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle><path class="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z"></path></svg>`);
}
export {
  Spinner as S
};
