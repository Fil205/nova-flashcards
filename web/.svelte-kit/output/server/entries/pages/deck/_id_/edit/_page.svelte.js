import { h as head, b as attr, s as stringify, f as derived, e as escape_html } from "../../../../../chunks/index.js";
import { g as goto } from "../../../../../chunks/client.js";
import { p as page } from "../../../../../chunks/index2.js";
import { d as deckStore } from "../../../../../chunks/decks.svelte.js";
import { t as toastStore } from "../../../../../chunks/toast.svelte.js";
import { f as friendlyError } from "../../../../../chunks/cache.js";
import { B as Button } from "../../../../../chunks/Button.js";
import { M as Modal, T as Trash_2 } from "../../../../../chunks/Modal.js";
import { S as Spinner } from "../../../../../chunks/Spinner.js";
import { p as parseId } from "../../../../../chunks/utils3.js";
import { C as Chevron_left } from "../../../../../chunks/chevron-left.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const deckId = derived(() => parseId(page.params.id));
    let name = "";
    let showDelete = false;
    let deleting = false;
    async function deleteDeck() {
      deleting = true;
      try {
        await deckStore.delete(deckId());
        toastStore.success("Mazzo eliminato.");
        goto("/");
      } catch (e) {
        toastStore.error(friendlyError(e));
      } finally {
        deleting = false;
        showDelete = false;
      }
    }
    let $$settled = true;
    let $$inner_renderer;
    function $$render_inner($$renderer3) {
      head("1pwytpv", $$renderer3, ($$renderer4) => {
        $$renderer4.title(($$renderer5) => {
          $$renderer5.push(`<title>Modifica mazzo — Falschcard</title>`);
        });
      });
      $$renderer3.push(`<div class="max-w-lg mx-auto flex flex-col gap-6"><div class="flex items-center gap-3"><a${attr("href", `/deck/${stringify(deckId())}`)} class="p-2 rounded-lg text-fc-muted hover:text-fc-text hover:bg-white/8 transition-colors" aria-label="Torna al mazzo">`);
      Chevron_left($$renderer3, { size: 18 });
      $$renderer3.push(`<!----></a> <h1 class="text-xl font-bold font-display text-fc-text">Modifica mazzo</h1></div> `);
      {
        $$renderer3.push("<!--[0-->");
        $$renderer3.push(`<div class="flex justify-center py-12">`);
        Spinner($$renderer3, { size: 28, class: "text-fc-muted" });
        $$renderer3.push(`<!----></div>`);
      }
      $$renderer3.push(`<!--]--></div> `);
      {
        let children = function($$renderer4) {
          $$renderer4.push(`<p class="text-sm text-fc-muted">Vuoi eliminare il mazzo <strong class="text-fc-text">"${escape_html(name)}"</strong> con tutte le sue carte? L'operazione non è reversibile.</p>`);
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
