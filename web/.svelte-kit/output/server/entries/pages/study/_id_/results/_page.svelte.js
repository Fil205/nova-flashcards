import { c as spread_props, h as head, e as escape_html, a as ensure_array_like, d as attr_class, s as stringify, f as derived } from "../../../../../chunks/index.js";
import { g as goto } from "../../../../../chunks/client.js";
import { p as page } from "../../../../../chunks/index2.js";
import { s as studyStore, v as verdictColor, a as verdictLabel } from "../../../../../chunks/study.svelte.js";
import { d as deckStore } from "../../../../../chunks/decks.svelte.js";
import { p as parseId } from "../../../../../chunks/utils3.js";
import { B as Button } from "../../../../../chunks/Button.js";
import { G as GlassCard } from "../../../../../chunks/GlassCard.js";
import { M as MathText } from "../../../../../chunks/MathText.js";
import { I as Icon } from "../../../../../chunks/Icon.js";
function House($$renderer, $$props) {
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
        { "d": "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }
      ],
      [
        "path",
        {
          "d": "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
        }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "house" },
      /**
       * @component @name House
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUgMjF2LThhMSAxIDAgMCAwLTEtMWgtNGExIDEgMCAwIDAtMSAxdjgiIC8+CiAgPHBhdGggZD0iTTMgMTBhMiAyIDAgMCAxIC43MDktMS41MjhsNy01Ljk5OWEyIDIgMCAwIDEgMi41ODIgMGw3IDUuOTk5QTIgMiAwIDAgMSAyMSAxMHY5YTIgMiAwIDAgMS0yIDJINWEyIDIgMCAwIDEtMi0yeiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/house
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
function Rotate_ccw($$renderer, $$props) {
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
        { "d": "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }
      ],
      ["path", { "d": "M3 3v5h5" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "rotate-ccw" },
      /**
       * @component @name RotateCcw
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMyAxMmE5IDkgMCAxIDAgOS05IDkuNzUgOS43NSAwIDAgMC02Ljc0IDIuNzRMMyA4IiAvPgogIDxwYXRoIGQ9Ik0zIDN2NWg1IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/rotate-ccw
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
function Trophy($$renderer, $$props) {
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
      ["path", { "d": "M6 9H4.5a2.5 2.5 0 0 1 0-5H6" }],
      ["path", { "d": "M18 9h1.5a2.5 2.5 0 0 0 0-5H18" }],
      ["path", { "d": "M4 22h16" }],
      [
        "path",
        {
          "d": "M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"
        }
      ],
      [
        "path",
        {
          "d": "M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"
        }
      ],
      ["path", { "d": "M18 2H6v7a6 6 0 0 0 12 0V2Z" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "trophy" },
      /**
       * @component @name Trophy
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNiA5SDQuNWEyLjUgMi41IDAgMCAxIDAtNUg2IiAvPgogIDxwYXRoIGQ9Ik0xOCA5aDEuNWEyLjUgMi41IDAgMCAwIDAtNUgxOCIgLz4KICA8cGF0aCBkPSJNNCAyMmgxNiIgLz4KICA8cGF0aCBkPSJNMTAgMTQuNjZWMTdjMCAuNTUtLjQ3Ljk4LS45NyAxLjIxQzcuODUgMTguNzUgNyAyMC4yNCA3IDIyIiAvPgogIDxwYXRoIGQ9Ik0xNCAxNC42NlYxN2MwIC41NS40Ny45OC45NyAxLjIxQzE2LjE1IDE4Ljc1IDE3IDIwLjI0IDE3IDIyIiAvPgogIDxwYXRoIGQ9Ik0xOCAySDZ2N2E2IDYgMCAwIDAgMTIgMFYyWiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/trophy
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
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const deckId = derived(() => parseId(page.params.id));
    const summary = derived(() => studyStore.computeSummary());
    const results = derived(() => studyStore.session?.results ?? []);
    const deck = derived(() => deckStore.currentDeck);
    const wrongCards = derived(() => studyStore.getWrongCards());
    function masteryColor(score) {
      if (score >= 0.8) return "text-fc-success";
      if (score >= 0.5) return "text-fc-warning";
      return "text-fc-danger";
    }
    function restart() {
      goto(`/study/${deckId()}`);
    }
    function home() {
      studyStore.endSession();
      goto();
    }
    function cardQuestion(cardId) {
      return deck()?.cards.find((c) => c.id === cardId)?.question ?? `Carta #${cardId}`;
    }
    head("8y3wix", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Risultati — Falschcard</title>`);
      });
    });
    if (studyStore.session) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="max-w-2xl mx-auto flex flex-col gap-6"><div class="text-center pt-4"><div class="w-16 h-16 rounded-2xl bg-fc-gradient flex items-center justify-center mx-auto mb-4 shadow-glow">`);
      Trophy($$renderer2, { size: 28, class: "text-white" });
      $$renderer2.push(`<!----></div> <h1 class="text-2xl font-bold font-display gradient-text">Sessione completata!</h1> `);
      if (deck()) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="text-fc-muted text-sm mt-1">${escape_html(deck().name)}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">`);
      GlassCard($$renderer2, {
        pad: "sm",
        class: "text-center col-span-2 sm:col-span-1",
        children: ($$renderer3) => {
          $$renderer3.push(`<p${attr_class(`text-3xl font-bold ${stringify(masteryColor(summary().score))}`)}>${escape_html(Math.round(summary().score * 100))}%</p> <p class="text-xs text-fc-faint mt-1">Punteggio</p>`);
        }
      });
      $$renderer2.push(`<!----> <!--[-->`);
      const each_array = ensure_array_like([
        {
          label: "Corretti",
          value: summary().correct,
          color: "text-fc-success"
        },
        {
          label: "Parziali",
          value: summary().partial,
          color: "text-fc-warning"
        },
        {
          label: "Errati",
          value: summary().wrong,
          color: "text-fc-danger"
        }
      ]);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let s = each_array[$$index];
        GlassCard($$renderer2, {
          pad: "sm",
          class: "text-center",
          children: ($$renderer3) => {
            $$renderer3.push(`<p${attr_class(`text-2xl font-bold ${stringify(s.color)}`)}>${escape_html(s.value)}</p> <p class="text-xs text-fc-faint mt-1">${escape_html(s.label)}</p>`);
          }
        });
      }
      $$renderer2.push(`<!--]--></div> `);
      if (results().length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="flex flex-col gap-2"><h2 class="text-sm font-semibold text-fc-muted uppercase tracking-wide">Dettaglio carte</h2> <div class="flex flex-col gap-2"><!--[-->`);
        const each_array_1 = ensure_array_like(results());
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let r = each_array_1[$$index_1];
          $$renderer2.push(`<div class="glass px-4 py-3 flex items-start gap-3"><span${attr_class(`text-xs w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${r.verdict === "correct" ? "bg-fc-success/20 text-fc-success" : r.verdict === "partial" ? "bg-fc-warning/20 text-fc-warning" : "bg-fc-danger/20 text-fc-danger"}`)}>${escape_html(r.verdict === "correct" ? "✓" : r.verdict === "partial" ? "~" : "✗")}</span> <div class="flex-1 min-w-0">`);
          MathText($$renderer2, {
            text: cardQuestion(r.cardId),
            class: "text-sm text-fc-text truncate block"
          });
          $$renderer2.push(`<!----> `);
          if (r.userAnswer && !r.skipped) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="text-xs text-fc-muted mt-0.5 truncate block">Risposta: `);
            MathText($$renderer2, { text: r.userAnswer });
            $$renderer2.push(`<!----></span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> `);
          if (r.aiFeedback) {
            $$renderer2.push("<!--[0-->");
            MathText($$renderer2, {
              text: r.aiFeedback,
              class: "text-xs text-fc-faint mt-1 block"
            });
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div> <span${attr_class(`text-xs text-fc-muted shrink-0 ${stringify(verdictColor(r.verdict))}`)}>${escape_html(verdictLabel(r.verdict))}</span></div>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="flex flex-wrap gap-3 justify-center">`);
      {
        let iconLeft = function($$renderer3) {
          House($$renderer3, { size: 13 });
        };
        Button($$renderer2, {
          variant: "ghost",
          size: "sm",
          onclick: home,
          iconLeft,
          children: ($$renderer3) => {
            $$renderer3.push(`<!---->Mazzi`);
          }
        });
      }
      $$renderer2.push(`<!----> `);
      {
        let iconLeft = function($$renderer3) {
          Rotate_ccw($$renderer3, { size: 13 });
        };
        Button($$renderer2, {
          variant: "secondary",
          size: "sm",
          onclick: restart,
          iconLeft,
          children: ($$renderer3) => {
            $$renderer3.push(`<!---->Ripeti sessione`);
          }
        });
      }
      $$renderer2.push(`<!----> `);
      if (wrongCards().length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button type="button" class="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-fc-danger/40 bg-fc-danger/10 text-fc-danger hover:bg-fc-danger/20 hover:border-fc-danger/60 transition-all">`);
        Rotate_ccw($$renderer2, { size: 13 });
        $$renderer2.push(`<!----> Ripeti sbagliate (${escape_html(wrongCards().length)})</button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
