import { b as attr, d as attr_class, i as clsx, f as derived } from "./index.js";
function Button($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      variant = "primary",
      size = "md",
      disabled = false,
      loading = false,
      type = "button",
      class: extraClass = "",
      onclick,
      iconLeft,
      children
    } = $$props;
    const base = "inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fc-accent-light/60 select-none whitespace-nowrap";
    const sizes = {
      sm: "px-3 py-1.5 text-sm h-8",
      md: "px-4 py-2   text-sm h-9",
      lg: "px-5 py-2.5 text-base h-11"
    };
    const variants = {
      primary: "bg-fc-gradient text-white hover:opacity-90 active:scale-[0.98] shadow-glow-sm",
      secondary: "bg-white/8 text-fc-text border border-white/10 hover:bg-white/12 hover:border-white/18 active:scale-[0.98]",
      ghost: "text-fc-muted hover:text-fc-text hover:bg-white/6 active:scale-[0.98]",
      danger: "bg-fc-danger/15 text-fc-danger border border-fc-danger/25 hover:bg-fc-danger/25 active:scale-[0.98]",
      success: "bg-fc-success/15 text-fc-success border border-fc-success/25 hover:bg-fc-success/25 active:scale-[0.98]"
    };
    const cls = derived(() => [base, sizes[size], variants[variant], extraClass].join(" "));
    $$renderer2.push(`<button${attr("type", type)}${attr_class(clsx(cls()))}${attr("disabled", disabled || loading, true)}${attr("aria-busy", loading)}>`);
    if (loading) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<svg class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>`);
    } else if (iconLeft) {
      $$renderer2.push("<!--[1-->");
      iconLeft($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (children) {
      $$renderer2.push("<!--[0-->");
      children($$renderer2);
      $$renderer2.push(`<!---->`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></button>`);
  });
}
export {
  Button as B
};
