import "clsx";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/root.js";
import "../../chunks/client.js";
import "../../chunks/client2.js";
import { a as ensure_array_like, b as attr, s as stringify, c as spread_props, d as attr_class, e as escape_html } from "../../chunks/index.js";
import { S as Spinner } from "../../chunks/Spinner.js";
import { t as toastStore } from "../../chunks/toast.svelte.js";
import { I as Icon } from "../../chunks/Icon.js";
import { T as Triangle_alert } from "../../chunks/triangle-alert.js";
import { C as Circle_check_big } from "../../chunks/circle-check-big.js";
import { X } from "../../chunks/x.js";
function CosmicBackground($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const STAR_COUNT = 80;
    const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
      x: (i * 1234567 + 987654) % 1e4 / 100,
      // 0–100%
      y: (i * 7654321 + 123456) % 1e4 / 100,
      r: (i * 314159 + 265358) % 100 / 100 * 1.5 + 0.5,
      opacity: (i * 271828 + 182845) % 100 / 100 * 0.5 + 0.2,
      delay: i % 7 * 0.5,
      dur: 3 + i % 4,
      // Drift: very subtle ±3px movement over 25-44s
      dx: ((i * 2718281 + 828459) % 100 / 100 - 0.5) * 6,
      dy: ((i * 1618033 + 988749) % 100 / 100 - 0.5) * 6,
      driftDur: 25 + i % 20,
      driftDelay: i % 13 * 1.8
    }));
    const orbs = [
      { cx: 15, cy: 20, r: 280, color: "#4F1DD1", opacity: 0.08 },
      { cx: 80, cy: 70, r: 320, color: "#1D4ED8", opacity: 0.06 },
      { cx: 50, cy: 50, r: 220, color: "#7C3AED", opacity: 0.05 }
    ];
    $$renderer2.push(`<div class="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none" aria-hidden="true"><svg class="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg"><defs><!--[-->`);
    const each_array = ensure_array_like(orbs);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let orb = each_array[i];
      $$renderer2.push(`<radialGradient${attr("id", `nebula-${stringify(i)}`)} cx="50%" cy="50%" r="50%"><stop offset="0%"${attr("stop-color", orb.color)}${attr("stop-opacity", orb.opacity * 1.5)}></stop><stop offset="100%"${attr("stop-color", orb.color)} stop-opacity="0"></stop></radialGradient>`);
    }
    $$renderer2.push(`<!--]--></defs><!--[-->`);
    const each_array_1 = ensure_array_like(orbs);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let orb = each_array_1[i];
      $$renderer2.push(`<ellipse${attr("cx", `${stringify(orb.cx)}%`)}${attr("cy", `${stringify(orb.cy)}%`)}${attr("rx", orb.r)}${attr("ry", orb.r * 0.8)}${attr("fill", `url(#nebula-${stringify(i)})`)}></ellipse>`);
    }
    $$renderer2.push(`<!--]--><!--[-->`);
    const each_array_2 = ensure_array_like(stars);
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let s = each_array_2[$$index_2];
      $$renderer2.push(`<circle${attr("cx", `${stringify(s.x)}%`)}${attr("cy", `${stringify(s.y)}%`)}${attr("r", s.r)} fill="white"${attr("opacity", s.opacity)}><animate attributeName="opacity"${attr("values", `${stringify(s.opacity)};${stringify(s.opacity * 2)};${stringify(s.opacity)}`)}${attr("dur", `${stringify(s.dur)}s`)}${attr("begin", `${stringify(s.delay)}s`)} repeatCount="indefinite"></animate>`);
      {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<animateTransform attributeName="transform" type="translate"${attr("values", `0 0; ${stringify(s.dx)} ${stringify(s.dy)}; 0 0`)}${attr("dur", `${stringify(s.driftDur)}s`)}${attr("begin", `${stringify(s.driftDelay)}s`)} repeatCount="indefinite" additive="sum"></animateTransform>`);
      }
      $$renderer2.push(`<!--]--></circle>`);
    }
    $$renderer2.push(`<!--]--></svg> <div class="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-fc-bg to-transparent"></div></div>`);
  });
}
function Circle_x($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    /**
     * @license @lucide/svelte v0.511.0 - ISC
     *
     * ISC License
     *
     * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
     *
     * Permission to use, copy, modify, and/or distribute this software for any
     * purpose with or without fee is hereby granted, provided that the above
     * copyright notice and this permission notice appear in all copies.
     *
     * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
     * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
     * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
     * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
     * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
     * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
     * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
     *
     */
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["circle", { "cx": "12", "cy": "12", "r": "10" }],
      ["path", { "d": "m15 9-6 6" }],
      ["path", { "d": "m9 9 6 6" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "circle-x" },
      /**
       * @component @name CircleX
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJtMTUgOS02IDYiIC8+CiAgPHBhdGggZD0ibTkgOSA2IDYiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/circle-x
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function Info($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    /**
     * @license @lucide/svelte v0.511.0 - ISC
     *
     * ISC License
     *
     * Copyright (c) for portions of Lucide are held by Cole Bemis 2013-2022 as part of Feather (MIT). All other copyright (c) for Lucide are held by Lucide Contributors 2022.
     *
     * Permission to use, copy, modify, and/or distribute this software for any
     * purpose with or without fee is hereby granted, provided that the above
     * copyright notice and this permission notice appear in all copies.
     *
     * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
     * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
     * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
     * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
     * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
     * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
     * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
     *
     */
    let { $$slots, $$events, ...props } = $$props;
    const iconNode = [
      ["circle", { "cx": "12", "cy": "12", "r": "10" }],
      ["path", { "d": "M12 16v-4" }],
      ["path", { "d": "M12 8h.01" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "info" },
      /**
       * @component @name Info
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgLz4KICA8cGF0aCBkPSJNMTIgMTZ2LTQiIC8+CiAgPHBhdGggZD0iTTEyIDhoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/info
       * @see https://lucide.dev/guide/packages/lucide-svelte - Documentation
       *
       * @param {Object} props - Lucide icons props and any valid SVG attribute
       * @returns {FunctionalComponent} Svelte component
       *
       */
      props,
      {
        iconNode,
        children: ($$renderer3) => {
          props.children?.($$renderer3);
          $$renderer3.push(`<!---->`);
        },
        $$slots: { default: true }
      }
    ]));
  });
}
function ToastContainer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const icons = {
      success: Circle_check_big,
      error: Circle_x,
      warning: Triangle_alert,
      info: Info
    };
    const colors = {
      success: "border-fc-success/30 border-l-fc-success text-fc-success",
      error: "border-fc-danger/30  border-l-fc-danger  text-fc-danger",
      warning: "border-fc-warning/30 border-l-fc-warning text-fc-warning",
      info: "border-fc-accent/30  border-l-fc-accent  text-fc-accent-light"
    };
    $$renderer2.push(`<div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end pointer-events-none" aria-live="polite" aria-label="Notifiche"><!--[-->`);
    const each_array = ensure_array_like(toastStore.toasts);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let toast = each_array[$$index];
      const Icon2 = icons[toast.variant];
      $$renderer2.push(`<div${attr_class(`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border-l-4 popover max-w-sm w-full shadow-glass-lg text-sm ${stringify(colors[toast.variant])}`)} role="alert">`);
      Icon2($$renderer2, { size: 16, class: "mt-0.5 shrink-0" });
      $$renderer2.push(`<!----> <span class="flex-1 text-fc-text leading-snug">${escape_html(toast.message)}</span> <button class="shrink-0 text-fc-muted hover:text-fc-text transition-colors p-0.5 rounded" aria-label="Chiudi notifica">`);
      X($$renderer2, { size: 14 });
      $$renderer2.push(`<!----></button></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function InstallPrompt($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    CosmicBackground($$renderer2);
    $$renderer2.push(`<!----> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="min-h-dvh flex items-center justify-center"><div class="flex flex-col items-center gap-4">`);
      Spinner($$renderer2, { size: 32, class: "text-fc-accent-light" });
      $$renderer2.push(`<!----> <p class="text-fc-muted text-sm">Caricamento...</p></div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    ToastContainer($$renderer2);
    $$renderer2.push(`<!----> `);
    InstallPrompt($$renderer2);
    $$renderer2.push(`<!---->`);
  });
}
export {
  _layout as default
};
