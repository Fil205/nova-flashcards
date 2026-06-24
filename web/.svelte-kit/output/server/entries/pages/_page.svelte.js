import { c as spread_props, e as escape_html, d as attr_class, s as stringify, h as head, b as attr, a as ensure_array_like, f as derived } from "../../chunks/index.js";
import { g as goto } from "../../chunks/client.js";
import { d as deckStore } from "../../chunks/decks.svelte.js";
import { p as profileStore } from "../../chunks/profile.svelte.js";
import { t as toastStore } from "../../chunks/toast.svelte.js";
import { f as friendlyError } from "../../chunks/cache.js";
import { S as Sparkles, C as Copy, U as Upload, p as parseJson, a as aiApi, W as Wand_sparkles } from "../../chunks/parsers.js";
import { I as Icon } from "../../chunks/Icon.js";
import "clsx";
import { B as Button } from "../../chunks/Button.js";
import { M as Modal, T as Trash_2 } from "../../chunks/Modal.js";
import { S as Spinner } from "../../chunks/Spinner.js";
import { T as Triangle_alert } from "../../chunks/triangle-alert.js";
function Book_open($$renderer, $$props) {
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
      ["path", { "d": "M12 7v14" }],
      [
        "path",
        {
          "d": "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
        }
      ]
    ];
    Icon($$renderer2, spread_props([
      { name: "book-open" },
      /**
       * @component @name BookOpen
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgN3YxNCIgLz4KICA8cGF0aCBkPSJNMyAxOGExIDEgMCAwIDEtMS0xVjRhMSAxIDAgMCAxIDEtMWg1YTQgNCAwIDAgMSA0IDQgNCA0IDAgMCAxIDQtNGg1YTEgMSAwIDAgMSAxIDF2MTNhMSAxIDAgMCAxLTEgMWgtNmEzIDMgMCAwIDAtMyAzIDMgMyAwIDAgMC0zLTN6IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/book-open
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
function Ellipsis_vertical($$renderer, $$props) {
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
      ["circle", { "cx": "12", "cy": "12", "r": "1" }],
      ["circle", { "cx": "12", "cy": "5", "r": "1" }],
      ["circle", { "cx": "12", "cy": "19", "r": "1" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "ellipsis-vertical" },
      /**
       * @component @name EllipsisVertical
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxIiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iNSIgcj0iMSIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjE5IiByPSIxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/ellipsis-vertical
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
function Plus($$renderer, $$props) {
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
    const iconNode = [["path", { "d": "M5 12h14" }], ["path", { "d": "M12 5v14" }]];
    Icon($$renderer2, spread_props([
      { name: "plus" },
      /**
       * @component @name Plus
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNNSAxMmgxNCIgLz4KICA8cGF0aCBkPSJNMTIgNXYxNCIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/plus
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
function Search($$renderer, $$props) {
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
      ["path", { "d": "m21 21-4.34-4.34" }],
      ["circle", { "cx": "11", "cy": "11", "r": "8" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "search" },
      /**
       * @component @name Search
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMjEgMjEtNC4zNC00LjM0IiAvPgogIDxjaXJjbGUgY3g9IjExIiBjeT0iMTEiIHI9IjgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/search
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
function DeckCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { deck, onStudy } = $$props;
    function masteryPercent() {
      if (deck.mastery === null) return "—";
      return Math.round(deck.mastery * 100) + "%";
    }
    function masteryColor() {
      if (deck.mastery === null) return "text-fc-faint";
      if (deck.mastery >= 0.8) return "text-fc-success";
      if (deck.mastery >= 0.5) return "text-fc-warning";
      return "text-fc-danger";
    }
    function lastStudied() {
      if (!deck.last_studied_at) return "Mai studiato";
      const d = new Date(deck.last_studied_at);
      return d.toLocaleDateString("it-IT", { day: "numeric", month: "short" });
    }
    $$renderer2.push(`<div class="glass glass-hover p-5 flex flex-col gap-4 cursor-pointer group relative" role="button" tabindex="0"><button class="absolute top-3 right-3 p-1.5 rounded-lg text-fc-faint opacity-0 group-hover:opacity-100 hover:text-fc-text hover:bg-white/8 transition-all z-10" aria-label="Opzioni mazzo">`);
    Ellipsis_vertical($$renderer2, { size: 15 });
    $$renderer2.push(`<!----></button> <div class="flex items-start gap-3 pr-6"><div class="w-10 h-10 rounded-xl bg-fc-gradient flex items-center justify-center shrink-0 shadow-glow-sm">`);
    Book_open($$renderer2, { size: 16, class: "text-white" });
    $$renderer2.push(`<!----></div> <div class="flex-1 min-w-0"><h3 class="font-semibold text-fc-text leading-tight truncate font-display">${escape_html(deck.name)}</h3> `);
    if (deck.description) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-xs text-fc-muted mt-0.5 line-clamp-1">${escape_html(deck.description)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div class="grid grid-cols-3 gap-2 text-center"><div class="bg-white/4 rounded-lg px-2 py-1.5"><p class="text-lg font-bold text-fc-text leading-none">${escape_html(deck.card_count)}</p> <p class="text-[10px] text-fc-faint mt-0.5">carte</p></div> <div class="bg-white/4 rounded-lg px-2 py-1.5"><p class="text-lg font-bold text-fc-text leading-none">${escape_html(deck.times_studied)}</p> <p class="text-[10px] text-fc-faint mt-0.5">sessioni</p></div> <div class="bg-white/4 rounded-lg px-2 py-1.5"><p${attr_class(`text-lg font-bold ${stringify(masteryColor())} leading-none`)}>${escape_html(masteryPercent())}</p> <p class="text-[10px] text-fc-faint mt-0.5">mastery</p></div></div> <div class="flex items-center justify-between pt-1 border-t border-fc-border"><span class="text-[11px] text-fc-faint">${escape_html(lastStudied())}</span> `);
    if (onStudy) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button class="text-xs font-medium text-fc-accent-light hover:text-white bg-fc-accent/15 hover:bg-fc-accent/30 px-3 py-1 rounded-lg transition-all">Studia</button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function EmptyState($$renderer, $$props) {
  let { icon = "📭", title, description, action } = $$props;
  $$renderer.push(`<div class="flex flex-col items-center justify-center text-center py-16 gap-4"><div class="text-5xl opacity-40 select-none">${escape_html(icon)}</div> <div><h3 class="text-base font-semibold text-fc-text mb-1">${escape_html(title)}</h3> `);
  {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<p class="text-sm text-fc-muted max-w-xs">${escape_html(description)}</p>`);
  }
  $$renderer.push(`<!--]--></div> `);
  if (action) {
    $$renderer.push("<!--[0-->");
    $$renderer.push(`<div class="mt-2">`);
    action($$renderer);
    $$renderer.push(`<!----></div>`);
  } else {
    $$renderer.push("<!--[-1-->");
  }
  $$renderer.push(`<!--]--></div>`);
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let searchQ = "";
    let showCreate = false;
    let createTab = "empty";
    let deckName = "";
    let deckDesc = "";
    let creating = false;
    let jsonText = "";
    let jsonErrors = [];
    let jsonImporting = false;
    let jsonFixing = false;
    const hasApiKey = derived(() => profileStore.settings?.has_api_key ?? false);
    function resetCreate() {
      createTab = "empty";
      deckName = "";
      deckDesc = "";
      jsonText = "";
      jsonErrors = [];
    }
    let showDelete = false;
    let deckToDelete = null;
    let deleting = false;
    const filteredDecks = derived(() => deckStore.decks.filter((d) => !searchQ));
    async function createDeck() {
      const name = deckName.trim();
      if (!name) return;
      const profileId = profileStore.active?.id;
      if (!profileId) return;
      creating = true;
      try {
        const deck = await deckStore.create(profileId, { name, description: deckDesc.trim() || void 0 });
        toastStore.success(`Mazzo "${name}" creato.`);
        showCreate = false;
        resetCreate();
        goto(`/deck/${deck.id}`);
      } catch (e) {
        toastStore.error(friendlyError(e));
      } finally {
        creating = false;
      }
    }
    async function createFromJson() {
      const profileId = profileStore.active?.id;
      if (!profileId || !jsonText.trim()) return;
      const result = parseJson(jsonText);
      jsonErrors = result.errors;
      if (result.cards.length === 0) return;
      const name = result.name && result.name.trim() || "Nuovo mazzo";
      jsonImporting = true;
      try {
        const deck = await deckStore.create(profileId, {
          name,
          description: result.description || void 0,
          source: "import-json"
        });
        await deckStore.bulkAddCards(deck.id, result.cards);
        toastStore.success(`Mazzo "${name}" creato con ${result.cards.length} carte.`);
        showCreate = false;
        resetCreate();
        goto(`/deck/${deck.id}`);
      } catch (e) {
        toastStore.error(friendlyError(e));
      } finally {
        jsonImporting = false;
      }
    }
    async function fixJsonWithAi() {
      const profileId = profileStore.active?.id;
      if (!profileId || !jsonText.trim()) return;
      jsonFixing = true;
      try {
        const { fixed } = await aiApi.fixImport(profileId, jsonText);
        jsonText = fixed;
        jsonErrors = parseJson(jsonText).errors;
      } catch (e) {
        toastStore.error(friendlyError(e));
      } finally {
        jsonFixing = false;
      }
    }
    async function deleteDeck() {
      return;
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1uha8ag", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Falschcard — I miei mazzi</title>`);
        });
      });
      $$renderer3.push(`<div class="flex flex-col gap-6"><div class="flex items-center justify-between gap-4 flex-wrap"><div><h1 class="text-xl font-bold font-display text-fc-text">Ciao, <span class="gradient-text">${escape_html(profileStore.active?.name)}</span> 👋</h1> <p class="text-sm text-fc-muted mt-0.5">${escape_html(deckStore.decks.length)} ${escape_html(deckStore.decks.length === 1 ? "mazzo" : "mazzi")}</p></div> `);
      {
        let iconLeft = function($$renderer4) {
          Plus($$renderer4, { size: 14 });
        };
        Button($$renderer3, {
          variant: "primary",
          size: "sm",
          onclick: () => showCreate = true,
          iconLeft,
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Nuovo mazzo`);
          }
        });
      }
      $$renderer3.push(`<!----></div> `);
      if (deckStore.decks.length > 3) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="relative">`);
        Search($$renderer3, {
          size: 15,
          class: "absolute left-3 top-1/2 -translate-y-1/2 text-fc-faint"
        });
        $$renderer3.push(`<!----> <input type="search" class="input-base pl-9" placeholder="Cerca mazzo..."${attr("value", searchQ)}/></div>`);
      } else {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      if (deckStore.loading) {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="flex justify-center py-16">`);
        Spinner($$renderer3, { size: 28, class: "text-fc-muted" });
        $$renderer3.push(`<!----></div>`);
      } else if (filteredDecks().length === 0) {
        $$renderer3.push("<!--[1-->");
        {
          let action = function($$renderer4) {
            {
              $$renderer4.push("<!--[0-->");
              {
                let iconLeft = function($$renderer5) {
                  Plus($$renderer5, { size: 14 });
                };
                Button($$renderer4, {
                  variant: "primary",
                  size: "sm",
                  onclick: () => showCreate = true,
                  iconLeft,
                  children: ($$renderer5) => {
                    $$renderer5.push(`<!---->Crea mazzo`);
                  }
                });
              }
            }
            $$renderer4.push(`<!--]-->`);
          };
          EmptyState($$renderer3, {
            icon: "📦",
            title: "Nessun mazzo ancora",
            description: "Crea il tuo primo mazzo per iniziare a studiare.",
            action
          });
        }
      } else {
        $$renderer3.push("<!--[-1-->");
        $$renderer3.push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"><!--[-->`);
        const each_array = ensure_array_like(filteredDecks());
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let deck = each_array[$$index];
          DeckCard($$renderer3, {
            deck,
            onStudy: (d) => goto(`/study/${d.id}`)
          });
        }
        $$renderer3.push(`<!--]--></div>`);
      }
      $$renderer3.push(`<!--]--></div> `);
      {
        let children = function($$renderer4) {
          $$renderer4.push(`<div class="flex gap-1 p-1 mb-4 rounded-xl bg-white/5 border border-fc-border"><button type="button"${attr_class(`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${createTab === "empty" ? "bg-fc-accent/20 text-fc-accent-light" : "text-fc-muted hover:text-fc-text"}`)}>Vuoto</button> <button type="button"${attr_class(`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${createTab === "json" ? "bg-fc-accent/20 text-fc-accent-light" : "text-fc-muted hover:text-fc-text"}`)}>Da JSON</button></div> `);
          if (createTab === "empty") {
            $$renderer4.push("<!--[0-->");
            $$renderer4.push(`<div class="flex flex-col gap-4"><input type="text" class="input-base" placeholder="Nome del mazzo"${attr("value", deckName)}/> <textarea class="input-base min-h-[60px]" placeholder="Descrizione (opzionale)">`);
            const $$body = escape_html(deckDesc);
            if ($$body) {
              $$renderer4.push(`${$$body}`);
            }
            $$renderer4.push(`</textarea></div>`);
          } else {
            $$renderer4.push("<!--[-1-->");
            $$renderer4.push(`<div class="flex flex-col gap-4"><div class="rounded-xl border border-fc-border bg-white/3 px-4 py-3 flex flex-col gap-2"><div class="flex items-center justify-between gap-3"><div class="flex items-center gap-2 text-sm font-medium text-fc-text">`);
            Sparkles($$renderer4, { size: 14, class: "text-fc-accent-light" });
            $$renderer4.push(`<!----> Genera un mazzo con AI</div> <button type="button"${attr_class(`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${"border-fc-border text-fc-muted hover:text-fc-text hover:border-fc-border-hover"}`)}>`);
            {
              $$renderer4.push("<!--[-1-->");
              Copy($$renderer4, { size: 12 });
              $$renderer4.push(`<!----> Copia prompt`);
            }
            $$renderer4.push(`<!--]--></button></div> <p class="text-xs text-fc-muted leading-relaxed">Copia il prompt, aprilo in Claude / ChatGPT / Gemini, allega i tuoi documenti e incolla
						qui il JSON. Includerà nome, descrizione e carte del mazzo.</p></div> <textarea class="input-base font-mono text-xs min-h-[140px]" placeholder="Incolla qui il JSON: { &quot;name&quot;: &quot;...&quot;, &quot;description&quot;: &quot;...&quot;, &quot;cards&quot;: [...] }">`);
            const $$body_1 = escape_html(jsonText);
            if ($$body_1) {
              $$renderer4.push(`${$$body_1}`);
            }
            $$renderer4.push(`</textarea> <label class="border-2 border-dashed border-fc-border hover:border-fc-border-hover rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-colors group">`);
            Upload($$renderer4, {
              size: 18,
              class: "text-fc-muted group-hover:text-fc-text transition-colors shrink-0"
            });
            $$renderer4.push(`<!----> <span class="text-sm text-fc-muted">oppure carica un file <span class="font-mono text-fc-accent-light">.json</span></span> <input type="file" class="hidden" accept=".json"/></label> `);
            if (jsonErrors.length > 0) {
              $$renderer4.push("<!--[0-->");
              $$renderer4.push(`<div class="flex flex-col gap-2"><div class="flex flex-col gap-1"><!--[-->`);
              const each_array_1 = ensure_array_like(jsonErrors.slice(0, 3));
              for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                let err = each_array_1[$$index_1];
                $$renderer4.push(`<p class="text-xs text-fc-warning flex items-center gap-1.5">`);
                Triangle_alert($$renderer4, { size: 12 });
                $$renderer4.push(`<!----> ${escape_html(err)}</p>`);
              }
              $$renderer4.push(`<!--]--></div> `);
              if (hasApiKey()) {
                $$renderer4.push("<!--[0-->");
                {
                  let iconLeft = function($$renderer5) {
                    Wand_sparkles($$renderer5, { size: 14 });
                  };
                  Button($$renderer4, {
                    variant: "secondary",
                    size: "sm",
                    loading: jsonFixing,
                    onclick: fixJsonWithAi,
                    class: "self-start",
                    iconLeft,
                    children: ($$renderer5) => {
                      $$renderer5.push(`<!---->Correggi con AI`);
                    }
                  });
                }
              } else {
                $$renderer4.push("<!--[-1-->");
              }
              $$renderer4.push(`<!--]--></div>`);
            } else {
              $$renderer4.push("<!--[-1-->");
            }
            $$renderer4.push(`<!--]--></div>`);
          }
          $$renderer4.push(`<!--]-->`);
        }, footer = function($$renderer4) {
          Button($$renderer4, {
            variant: "ghost",
            size: "sm",
            onclick: () => {
              showCreate = false;
              resetCreate();
            },
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Annulla`);
            }
          });
          $$renderer4.push(`<!----> `);
          if (createTab === "empty") {
            $$renderer4.push("<!--[0-->");
            {
              let iconLeft = function($$renderer5) {
                Plus($$renderer5, { size: 14 });
              };
              Button($$renderer4, {
                variant: "primary",
                size: "sm",
                loading: creating,
                onclick: createDeck,
                iconLeft,
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Crea`);
                }
              });
            }
          } else {
            $$renderer4.push("<!--[-1-->");
            {
              let iconLeft = function($$renderer5) {
                Upload($$renderer5, { size: 14 });
              };
              Button($$renderer4, {
                variant: "primary",
                size: "sm",
                loading: jsonImporting,
                disabled: !jsonText.trim(),
                onclick: createFromJson,
                iconLeft,
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Crea da JSON`);
                }
              });
            }
          }
          $$renderer4.push(`<!--]-->`);
        };
        Modal($$renderer3, {
          title: "Nuovo mazzo",
          width: createTab === "json" ? "lg" : "sm",
          onclose: resetCreate,
          get open() {
            return showCreate;
          },
          set open($$value) {
            showCreate = $$value;
            $$settled = false;
          },
          children,
          footer,
          $$slots: { default: true, footer: true }
        });
      }
      $$renderer3.push(`<!----> `);
      {
        let children = function($$renderer4) {
          $$renderer4.push(`<p class="text-sm text-fc-muted">Vuoi eliminare il mazzo <strong class="text-fc-text">${escape_html(deckToDelete?.name)}</strong> con tutte le sue ${escape_html(0)} carte? L'operazione è irreversibile.</p>`);
        }, footer = function($$renderer4) {
          Button($$renderer4, {
            variant: "ghost",
            size: "sm",
            onclick: () => showDelete = false,
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Annulla`);
            }
          });
          $$renderer4.push(`<!----> `);
          {
            let iconLeft = function($$renderer5) {
              Trash_2($$renderer5, { size: 14 });
            };
            Button($$renderer4, {
              variant: "danger",
              size: "sm",
              loading: deleting,
              onclick: deleteDeck,
              iconLeft,
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Elimina`);
              }
            });
          }
          $$renderer4.push(`<!---->`);
        };
        Modal($$renderer3, {
          title: "Elimina mazzo",
          width: "sm",
          get open() {
            return showDelete;
          },
          set open($$value) {
            showDelete = $$value;
            $$settled = false;
          },
          children,
          footer,
          $$slots: { default: true, footer: true }
        });
      }
      $$renderer3.push(`<!---->`);
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
