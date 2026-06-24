import { j as ssr_context, c as spread_props, d as attr_class, k as attr_style, s as stringify, e as escape_html, f as derived, h as head, b as attr } from "../../../../chunks/index.js";
import "clsx";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/client.js";
import { p as page } from "../../../../chunks/index2.js";
import { s as studyStore } from "../../../../chunks/study.svelte.js";
import { p as profileStore } from "../../../../chunks/profile.svelte.js";
import { i as isTtsSupported, a as stopTts } from "../../../../chunks/tts.js";
import { p as parseId } from "../../../../chunks/utils3.js";
import "../../../../chunks/katex.min.js";
import { S as Spinner } from "../../../../chunks/Spinner.js";
import { C as Chevron_left } from "../../../../chunks/chevron-left.js";
import { I as Icon } from "../../../../chunks/Icon.js";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
function Bot($$renderer, $$props) {
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
      ["path", { "d": "M12 8V4H8" }],
      [
        "rect",
        { "width": "16", "height": "12", "x": "4", "y": "8", "rx": "2" }
      ],
      ["path", { "d": "M2 14h2" }],
      ["path", { "d": "M20 14h2" }],
      ["path", { "d": "M15 13v2" }],
      ["path", { "d": "M9 13v2" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "bot" },
      /**
       * @component @name Bot
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgOFY0SDgiIC8+CiAgPHJlY3Qgd2lkdGg9IjE2IiBoZWlnaHQ9IjEyIiB4PSI0IiB5PSI4IiByeD0iMiIgLz4KICA8cGF0aCBkPSJNMiAxNGgyIiAvPgogIDxwYXRoIGQ9Ik0yMCAxNGgyIiAvPgogIDxwYXRoIGQ9Ik0xNSAxM3YyIiAvPgogIDxwYXRoIGQ9Ik05IDEzdjIiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/bot
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
function Volume_x($$renderer, $$props) {
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
      [
        "path",
        {
          "d": "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
        }
      ],
      ["line", { "x1": "22", "x2": "16", "y1": "9", "y2": "15" }],
      ["line", { "x1": "16", "x2": "22", "y1": "9", "y2": "15" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "volume-x" },
      /**
       * @component @name VolumeX
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgNC43MDJhLjcwNS43MDUgMCAwIDAtMS4yMDMtLjQ5OEw2LjQxMyA3LjU4N0ExLjQgMS40IDAgMCAxIDUuNDE2IDhIM2ExIDEgMCAwIDAtMSAxdjZhMSAxIDAgMCAwIDEgMWgyLjQxNmExLjQgMS40IDAgMCAxIC45OTcuNDEzbDMuMzgzIDMuMzg0QS43MDUuNzA1IDAgMCAwIDExIDE5LjI5OHoiIC8+CiAgPGxpbmUgeDE9IjIyIiB4Mj0iMTYiIHkxPSI5IiB5Mj0iMTUiIC8+CiAgPGxpbmUgeDE9IjE2IiB4Mj0iMjIiIHkxPSI5IiB5Mj0iMTUiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/volume-x
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
function SessionProgress($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { class: cls = "" } = $$props;
    const pct = derived(() => Math.round(studyStore.progress * 100));
    $$renderer2.push(`<div${attr_class(`flex items-center gap-3 ${stringify(cls)}`)} aria-label="Progresso sessione"><div class="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden"><div class="h-full bg-fc-gradient rounded-full transition-all duration-300"${attr_style(`width: ${stringify(pct())}%`)}></div></div> <span class="text-xs text-fc-muted tabular-nums shrink-0">${escape_html(studyStore.session?.currentIndex ?? 0)} / ${escape_html(studyStore.totalCards)}</span></div>`);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const deckId = derived(() => parseId(page.params.id));
    let localAutoRead = false;
    onDestroy(() => {
      stopTts();
    });
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("elvtci", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Studio — Falschcard</title>`);
        });
      });
      $$renderer3.push(`<div class="w-full max-w-5xl mx-auto flex flex-col gap-5 px-2 sm:px-4"><div class="flex items-center gap-2 sm:gap-3"><a${attr("href", `/deck/${stringify(deckId())}`)} class="p-2 rounded-lg text-fc-muted hover:text-fc-text hover:bg-white/8 transition-colors shrink-0" aria-label="Esci dalla sessione">`);
      Chevron_left($$renderer3, { size: 18 });
      $$renderer3.push(`<!----></a> `);
      SessionProgress($$renderer3, { class: "flex-1" });
      $$renderer3.push(`<!----> `);
      if (isTtsSupported()) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<button type="button"${attr_class(`p-2 rounded-lg transition-colors shrink-0 ${"text-fc-muted hover:text-fc-text hover:bg-white/8"}`)}${attr("aria-label", "Abilita lettura automatica")}${attr("aria-pressed", localAutoRead)}${attr("title", "Lettura automatica disabilitata")}>`);
        {
          $$renderer3.push("<!--[-1-->");
          Volume_x($$renderer3, { size: 16 });
        }
        $$renderer3.push(`<!--]--></button>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (profileStore.settings?.has_api_key) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<button type="button"${attr_class(`p-2 rounded-lg transition-colors shrink-0 ${studyStore.tutorOpen ? "bg-fc-accent/20 text-fc-accent-light" : "text-fc-muted hover:text-fc-text hover:bg-white/8"}`)}${attr("aria-label", studyStore.tutorOpen ? "Chiudi tutor AI" : "Apri tutor AI")}${attr("aria-pressed", studyStore.tutorOpen)} title="Tutor AI">`);
        Bot($$renderer3, { size: 16 });
        $$renderer3.push(`<!----></button>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--></div> `);
      {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="flex justify-center py-16">`);
        Spinner($$renderer3, { size: 28, class: "text-fc-muted" });
        $$renderer3.push(`<!----></div>`);
      }
      $$renderer3.push(`<!--]--></div>`);
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
  });
}
export {
  _page as default
};
