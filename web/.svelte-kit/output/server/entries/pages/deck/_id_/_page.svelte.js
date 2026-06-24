import { c as spread_props, a as ensure_array_like, b as attr, e as escape_html, g as bind_props, f as derived, d as attr_class, h as head } from "../../../../chunks/index.js";
import "@sveltejs/kit/internal";
import "../../../../chunks/exports.js";
import "../../../../chunks/utils2.js";
import "@sveltejs/kit/internal/server";
import "../../../../chunks/root.js";
import "../../../../chunks/client.js";
import { p as page } from "../../../../chunks/index2.js";
import { d as deckStore } from "../../../../chunks/decks.svelte.js";
import { B as Button } from "../../../../chunks/Button.js";
import "../../../../chunks/katex.min.js";
import { S as Spinner } from "../../../../chunks/Spinner.js";
import { t as toastStore } from "../../../../chunks/toast.svelte.js";
import { A as ApiError, f as friendlyError } from "../../../../chunks/cache.js";
import { M as Modal, T as Trash_2 } from "../../../../chunks/Modal.js";
import { X } from "../../../../chunks/x.js";
import { I as Icon } from "../../../../chunks/Icon.js";
import { p as profileStore } from "../../../../chunks/profile.svelte.js";
import { S as Sparkles, C as Copy, U as Upload, W as Wand_sparkles, a as aiApi, p as parseJson } from "../../../../chunks/parsers.js";
import { M as MathText } from "../../../../chunks/MathText.js";
import { T as Triangle_alert } from "../../../../chunks/triangle-alert.js";
import { p as parseId } from "../../../../chunks/utils3.js";
function flashSuccess(el) {
  return;
}
function Image_plus($$renderer, $$props) {
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
      ["path", { "d": "M16 5h6" }],
      ["path", { "d": "M19 2v6" }],
      [
        "path",
        {
          "d": "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5"
        }
      ],
      ["path", { "d": "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }],
      ["circle", { "cx": "9", "cy": "9", "r": "2" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "image-plus" },
      /**
       * @component @name ImagePlus
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTYgNWg2IiAvPgogIDxwYXRoIGQ9Ik0xOSAydjYiIC8+CiAgPHBhdGggZD0iTTIxIDExLjVWMTlhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yaDcuNSIgLz4KICA8cGF0aCBkPSJtMjEgMTUtMy4wODYtMy4wODZhMiAyIDAgMCAwLTIuODI4IDBMNiAyMSIgLz4KICA8Y2lyY2xlIGN4PSI5IiBjeT0iOSIgcj0iMiIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/image-plus
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
function Save($$renderer, $$props) {
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
          "d": "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
        }
      ],
      ["path", { "d": "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" }],
      ["path", { "d": "M7 3v4a1 1 0 0 0 1 1h7" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "save" },
      /**
       * @component @name Save
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTUuMiAzYTIgMiAwIDAgMSAxLjQuNmwzLjggMy44YTIgMiAwIDAgMSAuNiAxLjRWMTlhMiAyIDAgMCAxLTIgMkg1YTIgMiAwIDAgMS0yLTJWNWEyIDIgMCAwIDEgMi0yeiIgLz4KICA8cGF0aCBkPSJNMTcgMjF2LTdhMSAxIDAgMCAwLTEtMUg4YTEgMSAwIDAgMC0xIDF2NyIgLz4KICA8cGF0aCBkPSJNNyAzdjRhMSAxIDAgMCAwIDEgMWg3IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/save
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
const BASE = "/api";
const imagesApi = {
  /** Upload one (already compressed) image blob to a card section. */
  async upload(cardId, blob, section, filename, alt) {
    const form = new FormData();
    form.append("file", blob, filename);
    form.append("section", section);
    if (alt) form.append("alt", alt);
    const res = await fetch(`${BASE}/cards/${cardId}/images`, { method: "POST", body: form });
    const data = await res.json().catch(() => ({ error: { code: "PARSE_ERROR", message: "Risposta non valida dal server." } }));
    if (!res.ok) {
      const err = data?.error ?? {};
      throw new ApiError(err.code ?? "UNKNOWN", err.message ?? `HTTP ${res.status}`, res.status);
    }
    return data;
  },
  /** Delete an image (row + file). */
  async remove(imageId) {
    const res = await fetch(`${BASE}/images/${imageId}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) {
      const data = await res.json().catch(() => ({}));
      const err = data?.error ?? {};
      throw new ApiError(err.code ?? "UNKNOWN", err.message ?? `HTTP ${res.status}`, res.status);
    }
  }
};
function ImageUploader($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const MAX = 3;
    let { section, cardId, initial = [] } = $$props;
    let committed = [...initial];
    let pending = [];
    let busy = false;
    const total = derived(() => committed.length + pending.length);
    function count() {
      return total();
    }
    async function flush(newCardId) {
      for (const p of pending.slice()) {
        try {
          const { image } = await imagesApi.upload(newCardId, p.blob, section, `image.${p.ext}`);
          committed = [...committed, image];
        } catch (e) {
          toastStore.error(friendlyError(e));
        } finally {
          URL.revokeObjectURL(p.previewUrl);
        }
      }
      pending = [];
    }
    $$renderer2.push(`<div class="flex items-center gap-2 flex-wrap"><!--[-->`);
    const each_array = ensure_array_like(committed);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let img = each_array[$$index];
      $$renderer2.push(`<div class="iu-thumb svelte-12ed5d3"><img${attr("src", img.url)}${attr("alt", img.alt ?? "")} class="svelte-12ed5d3"/> <button type="button" class="iu-del svelte-12ed5d3" aria-label="Rimuovi immagine">`);
      X($$renderer2, { size: 12 });
      $$renderer2.push(`<!----></button></div>`);
    }
    $$renderer2.push(`<!--]--> <!--[-->`);
    const each_array_1 = ensure_array_like(pending);
    for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
      let p = each_array_1[i];
      $$renderer2.push(`<div class="iu-thumb svelte-12ed5d3"><img${attr("src", p.previewUrl)} alt="" class="svelte-12ed5d3"/> <button type="button" class="iu-del svelte-12ed5d3" aria-label="Rimuovi immagine">`);
      X($$renderer2, { size: 12 });
      $$renderer2.push(`<!----></button></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (total() < MAX) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button type="button" class="iu-add svelte-12ed5d3"${attr("disabled", busy, true)} title="Aggiungi immagine">`);
      {
        $$renderer2.push("<!--[-1-->");
        Image_plus($$renderer2, { size: 16 });
        $$renderer2.push(`<!----> <span class="text-[10px] mt-0.5">${escape_html(total())}/3</span>`);
      }
      $$renderer2.push(`<!--]--></button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <input type="file" accept="image/*" multiple="" class="hidden"/></div>`);
    bind_props($$props, { count, flush });
  });
}
function CardEditor($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { open = void 0, deckId, card = null, onclose, onsaved } = $$props;
    let question = "";
    let answer = "";
    let explanation = "";
    let saving = false;
    let errorMsg = "";
    let formEl = null;
    let createCount = 0;
    let qUploader = null;
    let aUploader = null;
    let eUploader = null;
    const initialImages = (s) => (card?.images ?? []).filter((i) => i.section === s);
    async function save() {
      errorMsg = "";
      if (!question.trim() || !answer.trim()) {
        errorMsg = "Domanda e risposta sono obbligatorie.";
        return;
      }
      saving = true;
      try {
        const draft = {
          question: question.trim(),
          answer: answer.trim(),
          explanation: explanation.trim() || void 0
        };
        if (card) {
          await deckStore.updateCard(card.id, draft);
          toastStore.success("Carta aggiornata.");
        } else {
          const pendingImages = (qUploader?.count() ?? 0) + (aUploader?.count() ?? 0) + (eUploader?.count() ?? 0) > 0;
          const newCard = await deckStore.addCard(deckId, draft);
          await Promise.all([
            qUploader?.flush(newCard.id),
            aUploader?.flush(newCard.id),
            eUploader?.flush(newCard.id)
          ]);
          if (pendingImages) ;
          toastStore.success("Carta aggiunta.");
          question = "";
          answer = "";
          explanation = "";
          createCount++;
        }
        if (formEl) ;
        onsaved?.();
      } catch (e) {
        errorMsg = friendlyError(e);
      } finally {
        saving = false;
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      {
        let children = function($$renderer4) {
          $$renderer4.push(`<div class="flex flex-col gap-4"><div><label for="ce-question" class="text-xs font-medium text-fc-muted uppercase tracking-wide block mb-1.5">Domanda <span class="text-fc-danger normal-case">*</span></label> <textarea id="ce-question" class="input-base min-h-[80px]" placeholder="Scrivi la domanda..." autofocus="">`);
          const $$body = escape_html(question);
          if ($$body) {
            $$renderer4.push(`${$$body}`);
          }
          $$renderer4.push(`</textarea> <div class="mt-2"><!---->`);
          {
            ImageUploader($$renderer4, {
              section: "question",
              cardId: card?.id ?? null,
              initial: initialImages("question")
            });
          }
          $$renderer4.push(`<!----></div></div> <div><label for="ce-answer" class="text-xs font-medium text-fc-muted uppercase tracking-wide block mb-1.5">Risposta <span class="text-fc-danger normal-case">*</span></label> <textarea id="ce-answer" class="input-base min-h-[80px]" placeholder="Scrivi la risposta...">`);
          const $$body_1 = escape_html(answer);
          if ($$body_1) {
            $$renderer4.push(`${$$body_1}`);
          }
          $$renderer4.push(`</textarea> <div class="mt-2"><!---->`);
          {
            ImageUploader($$renderer4, {
              section: "answer",
              cardId: card?.id ?? null,
              initial: initialImages("answer")
            });
          }
          $$renderer4.push(`<!----></div></div> <div><label for="ce-explanation" class="text-xs font-medium text-fc-muted uppercase tracking-wide block mb-1.5">Spiegazione <span class="text-fc-faint normal-case">(opzionale)</span></label> <textarea id="ce-explanation" class="input-base min-h-[60px]" placeholder="Aggiungi una spiegazione per il tutor AI...">`);
          const $$body_2 = escape_html(explanation);
          if ($$body_2) {
            $$renderer4.push(`${$$body_2}`);
          }
          $$renderer4.push(`</textarea> <div class="mt-2"><!---->`);
          {
            ImageUploader($$renderer4, {
              section: "explanation",
              cardId: card?.id ?? null,
              initial: initialImages("explanation")
            });
          }
          $$renderer4.push(`<!----></div></div> `);
          if (errorMsg) {
            $$renderer4.push("<!--[0-->");
            $$renderer4.push(`<p class="text-xs text-fc-danger">${escape_html(errorMsg)}</p>`);
          } else {
            $$renderer4.push("<!--[-1-->");
          }
          $$renderer4.push(`<!--]--></div>`);
        }, footer = function($$renderer4) {
          Button($$renderer4, {
            variant: "ghost",
            size: "sm",
            onclick: () => {
              open = false;
              onclose?.();
            },
            children: ($$renderer5) => {
              $$renderer5.push(`<!---->Annulla`);
            }
          });
          $$renderer4.push(`<!----> `);
          {
            let iconLeft = function($$renderer5) {
              Save($$renderer5, { size: 14 });
            };
            Button($$renderer4, {
              variant: "primary",
              size: "sm",
              loading: saving,
              onclick: save,
              iconLeft,
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->${escape_html(card ? "Salva" : "Aggiungi")}`);
              }
            });
          }
          $$renderer4.push(`<!---->`);
        };
        Modal($$renderer3, {
          title: card ? "Modifica carta" : "Nuova carta",
          onclose,
          get open() {
            return open;
          },
          set open($$value) {
            open = $$value;
            $$settled = false;
          },
          children,
          footer,
          $$slots: { default: true, footer: true }
        });
      }
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { open });
  });
}
function ImportDialog($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { open = void 0, deckId, onclose, onimported } = $$props;
    let rawText = "";
    let errors = [];
    let preview = [];
    let importing = false;
    let fixing = false;
    let step = "input";
    let parseResult = { cards: [], errors: [] };
    const hasApiKey = derived(() => profileStore.settings?.has_api_key ?? false);
    function parse() {
      if (!rawText.trim()) return;
      const result = parseJson(rawText);
      parseResult = result;
      errors = result.errors;
      preview = result.cards.slice(0, 5);
      if (result.cards.length > 0) {
        step = "preview";
      }
    }
    async function fixWithAi() {
      const profileId = profileStore.active?.id;
      if (!profileId || !rawText.trim()) return;
      fixing = true;
      try {
        const { fixed } = await aiApi.fixImport(profileId, rawText);
        rawText = fixed;
        parse();
      } catch (e) {
        toastStore.error(friendlyError(e));
      } finally {
        fixing = false;
      }
    }
    async function doImport() {
      const result = parseResult;
      if (result.cards.length === 0) return;
      importing = true;
      try {
        const count = await deckStore.bulkAddCards(deckId, result.cards);
        toastStore.success(`${count} carte importate.`);
        onimported?.(count);
        rawText = "";
        step = "input";
        open = false;
      } catch (e) {
        toastStore.error(friendlyError(e));
      } finally {
        importing = false;
      }
    }
    function reset() {
      rawText = "";
      errors = [];
      preview = [];
      step = "input";
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      {
        let children = function($$renderer4) {
          if (step === "input") {
            $$renderer4.push("<!--[0-->");
            $$renderer4.push(`<div class="flex flex-col gap-4"><div class="rounded-xl border border-fc-border bg-white/3 px-4 py-3 flex flex-col gap-2"><div class="flex items-center justify-between gap-3"><div class="flex items-center gap-2 text-sm font-medium text-fc-text">`);
            Sparkles($$renderer4, { size: 14, class: "text-fc-accent-light" });
            $$renderer4.push(`<!----> Genera flashcard con AI</div> <button type="button"${attr_class(`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${"border-fc-border text-fc-muted hover:text-fc-text hover:border-fc-border-hover"}`)}>`);
            {
              $$renderer4.push("<!--[-1-->");
              Copy($$renderer4, { size: 12 });
              $$renderer4.push(`<!----> Copia prompt`);
            }
            $$renderer4.push(`<!--]--></button></div> <p class="text-xs text-fc-muted leading-relaxed">Copia il prompt, aprilo in Claude / ChatGPT / Gemini, allega i tuoi documenti
						(PDF, appunti, slide) e incolla la risposta JSON qui sotto.</p></div> <textarea class="input-base font-mono text-xs min-h-[140px]" placeholder="Incolla qui il JSON generato dall'AI o il tuo export Falschcard…">`);
            const $$body = escape_html(rawText);
            if ($$body) {
              $$renderer4.push(`${$$body}`);
            }
            $$renderer4.push(`</textarea> <label class="border-2 border-dashed border-fc-border hover:border-fc-border-hover rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-colors group">`);
            Upload($$renderer4, {
              size: 18,
              class: "text-fc-muted group-hover:text-fc-text transition-colors shrink-0"
            });
            $$renderer4.push(`<!----> <span class="text-sm text-fc-muted">oppure carica un file <span class="font-mono text-fc-accent-light">.json</span></span> <input type="file" class="hidden" accept=".json"/></label> <div class="rounded-lg border border-fc-border bg-white/3 px-4 py-3 text-xs text-fc-text"><p class="font-medium mb-1">Formato JSON atteso</p> <p class="font-mono text-fc-accent-light leading-relaxed">[{"question":"...","answer":"...","explanation":"..."}]</p> <p class="text-fc-muted mt-1 text-xs">Oppure export Falschcard: <span class="font-mono">{ "decks": [...] }</span></p></div> `);
            if (errors.length > 0) {
              $$renderer4.push("<!--[0-->");
              $$renderer4.push(`<div class="flex flex-col gap-2"><div class="flex flex-col gap-1"><!--[-->`);
              const each_array = ensure_array_like(errors.slice(0, 3));
              for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                let err = each_array[$$index];
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
                    loading: fixing,
                    onclick: fixWithAi,
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
          } else {
            $$renderer4.push("<!--[-1-->");
            $$renderer4.push(`<div class="flex flex-col gap-3"><p class="text-sm text-fc-muted"><strong class="text-fc-text">${escape_html(parseResult.cards.length)}</strong> carte pronte per l'importazione.
					Anteprima delle prime 5:</p> <div class="flex flex-col gap-2 max-h-64 overflow-y-auto"><!--[-->`);
            const each_array_1 = ensure_array_like(preview);
            for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
              let card = each_array_1[i];
              $$renderer4.push(`<div class="bg-white/4 rounded-lg px-3 py-2.5 text-sm"><span class="font-medium text-fc-text">${escape_html(i + 1)}. `);
              MathText($$renderer4, { text: card.question });
              $$renderer4.push(`<!----></span> `);
              MathText($$renderer4, {
                text: card.answer,
                class: "text-fc-muted text-xs mt-0.5 block"
              });
              $$renderer4.push(`<!----></div>`);
            }
            $$renderer4.push(`<!--]--></div></div>`);
          }
          $$renderer4.push(`<!--]-->`);
        }, footer = function($$renderer4) {
          if (step === "input") {
            $$renderer4.push("<!--[0-->");
            Button($$renderer4, {
              variant: "ghost",
              size: "sm",
              onclick: () => {
                reset();
                open = false;
                onclose?.();
              },
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Annulla`);
              }
            });
            $$renderer4.push(`<!----> `);
            Button($$renderer4, {
              variant: "primary",
              size: "sm",
              disabled: !rawText.trim(),
              onclick: parse,
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Anteprima`);
              }
            });
            $$renderer4.push(`<!---->`);
          } else {
            $$renderer4.push("<!--[-1-->");
            Button($$renderer4, {
              variant: "ghost",
              size: "sm",
              onclick: () => step = "input",
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Indietro`);
              }
            });
            $$renderer4.push(`<!----> `);
            {
              let iconLeft = function($$renderer5) {
                Upload($$renderer5, { size: 14 });
              };
              Button($$renderer4, {
                variant: "primary",
                size: "sm",
                loading: importing,
                onclick: doImport,
                iconLeft,
                children: ($$renderer5) => {
                  $$renderer5.push(`<!---->Importa`);
                }
              });
            }
            $$renderer4.push(`<!---->`);
          }
          $$renderer4.push(`<!--]-->`);
        };
        Modal($$renderer3, {
          title: "Importa carte",
          width: "lg",
          onclose: () => {
            reset();
            onclose?.();
          },
          get open() {
            return open;
          },
          set open($$value) {
            open = $$value;
            $$settled = false;
          },
          children,
          footer,
          $$slots: { default: true, footer: true }
        });
      }
    }
    do {
      $$settled = true;
      $$inner_renderer = $$renderer2.copy();
      $$render_inner($$inner_renderer);
    } while (!$$settled);
    $$renderer2.subsume($$inner_renderer);
    bind_props($$props, { open });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const deckId = derived(() => parseId(page.params.id));
    let showAddCard = false;
    let showImport = false;
    let showDeleteCard = false;
    let cardToDelete = null;
    let deleting = false;
    async function deleteCard() {
      return;
    }
    const deck = derived(() => deckStore.currentDeck);
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("3mkrmy", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>${escape_html(deck()?.name ?? "Mazzo")} — Falschcard</title>`);
        });
      });
      $$renderer3.push(`<div class="flex flex-col gap-6">`);
      {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="flex justify-center py-24">`);
        Spinner($$renderer3, { size: 28, class: "text-fc-muted" });
        $$renderer3.push(`<!----></div>`);
      }
      $$renderer3.push(`<!--]--></div> `);
      CardEditor($$renderer3, {
        deckId: deckId(),
        get open() {
          return showAddCard;
        },
        set open($$value) {
          showAddCard = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      {
        $$renderer3.push("<!--[-1-->");
      }
      $$renderer3.push(`<!--]--> `);
      ImportDialog($$renderer3, {
        deckId: deckId(),
        get open() {
          return showImport;
        },
        set open($$value) {
          showImport = $$value;
          $$settled = false;
        }
      });
      $$renderer3.push(`<!----> `);
      {
        let children = function($$renderer4) {
          $$renderer4.push(`<p class="text-sm text-fc-muted">Vuoi eliminare la carta: <em class="text-fc-text not-italic font-medium">"${escape_html(cardToDelete?.question)}"</em>?</p>`);
        }, footer = function($$renderer4) {
          Button($$renderer4, {
            variant: "ghost",
            size: "sm",
            onclick: () => showDeleteCard = false,
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
              onclick: deleteCard,
              iconLeft,
              children: ($$renderer5) => {
                $$renderer5.push(`<!---->Elimina`);
              }
            });
          }
          $$renderer4.push(`<!---->`);
        };
        Modal($$renderer3, {
          title: "Elimina carta",
          width: "sm",
          get open() {
            return showDeleteCard;
          },
          set open($$value) {
            showDeleteCard = $$value;
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
