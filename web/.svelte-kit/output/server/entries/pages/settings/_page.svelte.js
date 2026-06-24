import { c as spread_props, d as attr_class, b as attr, i as clsx, e as escape_html, g as bind_props, f as derived, h as head, a as ensure_array_like } from "../../../chunks/index.js";
import { p as profileStore } from "../../../chunks/profile.svelte.js";
import "clsx";
import { a as api, f as friendlyError } from "../../../chunks/cache.js";
import { t as toastStore } from "../../../chunks/toast.svelte.js";
import { i as isTtsSupported, s as speak, a as stopTts } from "../../../chunks/tts.js";
import { B as Button } from "../../../chunks/Button.js";
import { G as GlassCard } from "../../../chunks/GlassCard.js";
import { I as Icon } from "../../../chunks/Icon.js";
import { C as Circle_check_big } from "../../../chunks/circle-check-big.js";
import { T as Triangle_alert } from "../../../chunks/triangle-alert.js";
function Download($$renderer, $$props) {
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
      ["path", { "d": "M12 15V3" }],
      ["path", { "d": "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
      ["path", { "d": "m7 10 5 5 5-5" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "download" },
      /**
       * @component @name Download
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIgMTVWMyIgLz4KICA8cGF0aCBkPSJNMjEgMTV2NGEyIDIgMCAwIDEtMiAySDVhMiAyIDAgMCAxLTItMnYtNCIgLz4KICA8cGF0aCBkPSJtNyAxMCA1IDUgNS01IiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/download
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
function Eye($$renderer, $$props) {
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
          "d": "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
        }
      ],
      ["circle", { "cx": "12", "cy": "12", "r": "3" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "eye" },
      /**
       * @component @name Eye
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMi4wNjIgMTIuMzQ4YTEgMSAwIDAgMSAwLS42OTYgMTAuNzUgMTAuNzUgMCAwIDEgMTkuODc2IDAgMSAxIDAgMCAxIDAgLjY5NiAxMC43NSAxMC43NSAwIDAgMS0xOS44NzYgMCIgLz4KICA8Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIzIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/eye
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
function Key($$renderer, $$props) {
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
          "d": "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"
        }
      ],
      ["path", { "d": "m21 2-9.6 9.6" }],
      ["circle", { "cx": "7.5", "cy": "15.5", "r": "5.5" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "key" },
      /**
       * @component @name Key
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJtMTUuNSA3LjUgMi4zIDIuM2ExIDEgMCAwIDAgMS40IDBsMi4xLTIuMWExIDEgMCAwIDAgMC0xLjRMMTkgNCIgLz4KICA8cGF0aCBkPSJtMjEgMi05LjYgOS42IiAvPgogIDxjaXJjbGUgY3g9IjcuNSIgY3k9IjE1LjUiIHI9IjUuNSIgLz4KPC9zdmc+Cg==) - https://lucide.dev/icons/key
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
function Settings($$renderer, $$props) {
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
          "d": "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
        }
      ],
      ["circle", { "cx": "12", "cy": "12", "r": "3" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "settings" },
      /**
       * @component @name Settings
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTIuMjIgMmgtLjQ0YTIgMiAwIDAgMC0yIDJ2LjE4YTIgMiAwIDAgMS0xIDEuNzNsLS40My4yNWEyIDIgMCAwIDEtMiAwbC0uMTUtLjA4YTIgMiAwIDAgMC0yLjczLjczbC0uMjIuMzhhMiAyIDAgMCAwIC43MyAyLjczbC4xNS4xYTIgMiAwIDAgMSAxIDEuNzJ2LjUxYTIgMiAwIDAgMS0xIDEuNzRsLS4xNS4wOWEyIDIgMCAwIDAtLjczIDIuNzNsLjIyLjM4YTIgMiAwIDAgMCAyLjczLjczbC4xNS0uMDhhMiAyIDAgMCAxIDIgMGwuNDMuMjVhMiAyIDAgMCAxIDEgMS43M1YyMGEyIDIgMCAwIDAgMiAyaC40NGEyIDIgMCAwIDAgMi0ydi0uMThhMiAyIDAgMCAxIDEtMS43M2wuNDMtLjI1YTIgMiAwIDAgMSAyIDBsLjE1LjA4YTIgMiAwIDAgMCAyLjczLS43M2wuMjItLjM5YTIgMiAwIDAgMC0uNzMtMi43M2wtLjE1LS4wOGEyIDIgMCAwIDEtMS0xLjc0di0uNWEyIDIgMCAwIDEgMS0xLjc0bC4xNS0uMDlhMiAyIDAgMCAwIC43My0yLjczbC0uMjItLjM4YTIgMiAwIDAgMC0yLjczLS43M2wtLjE1LjA4YTIgMiAwIDAgMS0yIDBsLS40My0uMjVhMiAyIDAgMCAxLTEtMS43M1Y0YTIgMiAwIDAgMC0yLTJ6IiAvPgogIDxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjMiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/settings
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
function Smartphone($$renderer, $$props) {
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
        "rect",
        {
          "width": "14",
          "height": "20",
          "x": "5",
          "y": "2",
          "rx": "2",
          "ry": "2"
        }
      ],
      ["path", { "d": "M12 18h.01" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "smartphone" },
      /**
       * @component @name Smartphone
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cmVjdCB3aWR0aD0iMTQiIGhlaWdodD0iMjAiIHg9IjUiIHk9IjIiIHJ4PSIyIiByeT0iMiIgLz4KICA8cGF0aCBkPSJNMTIgMThoLjAxIiAvPgo8L3N2Zz4K) - https://lucide.dev/icons/smartphone
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
function Volume_2($$renderer, $$props) {
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
      ["path", { "d": "M16 9a5 5 0 0 1 0 6" }],
      ["path", { "d": "M19.364 18.364a9 9 0 0 0 0-12.728" }]
    ];
    Icon($$renderer2, spread_props([
      { name: "volume-2" },
      /**
       * @component @name Volume2
       * @description Lucide SVG icon component, renders SVG Element with children.
       *
       * @preview ![img](data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogIHdpZHRoPSIyNCIKICBoZWlnaHQ9IjI0IgogIHZpZXdCb3g9IjAgMCAyNCAyNCIKICBmaWxsPSJub25lIgogIHN0cm9rZT0iIzAwMCIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6ICNmZmY7IGJvcmRlci1yYWRpdXM6IDJweCIKICBzdHJva2Utd2lkdGg9IjIiCiAgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIgogIHN0cm9rZS1saW5lam9pbj0icm91bmQiCj4KICA8cGF0aCBkPSJNMTEgNC43MDJhLjcwNS43MDUgMCAwIDAtMS4yMDMtLjQ5OEw2LjQxMyA3LjU4N0ExLjQgMS40IDAgMCAxIDUuNDE2IDhIM2ExIDEgMCAwIDAtMSAxdjZhMSAxIDAgMCAwIDEgMWgyLjQxNmExLjQgMS40IDAgMCAxIC45OTcuNDEzbDMuMzgzIDMuMzg0QS43MDUuNzA1IDAgMCAwIDExIDE5LjI5OHoiIC8+CiAgPHBhdGggZD0iTTE2IDlhNSA1IDAgMCAxIDAgNiIgLz4KICA8cGF0aCBkPSJNMTkuMzY0IDE4LjM2NGE5IDkgMCAwIDAgMC0xMi43MjgiIC8+Cjwvc3ZnPgo=) - https://lucide.dev/icons/volume-2
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
const settingsApi = {
  get(profileId) {
    return api.get(`/profiles/${profileId}/settings`);
  },
  update(profileId, data) {
    return api.put(`/profiles/${profileId}/settings`, data);
  },
  setGeminiKey(profileId, apiKey) {
    return api.put(`/profiles/${profileId}/gemini-key`, { api_key: apiKey });
  },
  deleteGeminiKey(profileId) {
    return api.delete(`/profiles/${profileId}/gemini-key`);
  },
  listGeminiModels(profileId) {
    return api.get(`/profiles/${profileId}/gemini-models`);
  }
};
async function runWithState(setBusy, setError, errorMsg, fn) {
  setBusy(true);
  setError(null);
  try {
    return await fn();
  } catch (err) {
    setError(errorMsg);
    throw err;
  } finally {
    setBusy(false);
  }
}
class SettingsStore {
  saving = false;
  error = null;
  /** Current settings (proxied from profileStore). */
  get current() {
    return profileStore.settings;
  }
  /** Update settings on server and sync to store. */
  async update(data) {
    const id = profileStore.active?.id;
    if (!id) throw new Error("Nessun profilo attivo.");
    await runWithState(
      (v) => {
        this.saving = v;
      },
      (v) => {
        this.error = v;
      },
      "Impossibile salvare le impostazioni.",
      async () => {
        const { settings } = await settingsApi.update(id, data);
        profileStore.updateSettings(settings);
      }
    );
  }
  /** Save a Gemini API key for the current profile. */
  async saveGeminiKey(apiKey) {
    const id = profileStore.active?.id;
    if (!id) throw new Error("Nessun profilo attivo.");
    await runWithState(
      (v) => {
        this.saving = v;
      },
      (v) => {
        this.error = v;
      },
      "Impossibile salvare la chiave API.",
      async () => {
        const { has_api_key } = await settingsApi.setGeminiKey(id, apiKey);
        profileStore.updateSettings({ has_api_key });
      }
    );
  }
  /** Delete the Gemini API key for the current profile. */
  async deleteGeminiKey() {
    const id = profileStore.active?.id;
    if (!id) throw new Error("Nessun profilo attivo.");
    await runWithState(
      (v) => {
        this.saving = v;
      },
      (v) => {
        this.error = v;
      },
      "Impossibile eliminare la chiave API.",
      async () => {
        const { has_api_key } = await settingsApi.deleteGeminiKey(id);
        profileStore.updateSettings({ has_api_key });
      }
    );
  }
  /** Fetch available Gemini models. */
  async listModels() {
    const id = profileStore.active?.id;
    if (!id) return [];
    const { models } = await settingsApi.listGeminiModels(id);
    return models;
  }
}
const settingsStore = new SettingsStore();
function Toggle($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { checked = void 0, disabled = false, label, onchange } = $$props;
    const trackCls = derived(() => `block w-10 h-6 rounded-full transition-colors duration-200 ${checked ? "bg-fc-accent" : "bg-white/15"}`);
    $$renderer2.push(`<label${attr_class("inline-flex items-center gap-3 cursor-pointer select-none group", void 0, { "opacity-50": disabled, "cursor-not-allowed": disabled })}><span class="relative inline-block w-10 h-6"><input type="checkbox"${attr("checked", checked, true)}${attr("disabled", disabled, true)} class="sr-only"/> <span${attr_class(clsx(trackCls()))}></span> <span${attr_class("absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200", void 0, { "translate-x-4": checked })}></span></span> `);
    if (label) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-sm text-fc-text">${escape_html(label)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></label>`);
    bind_props($$props, { checked });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    const MODELS = [
      { id: "gemini-3.5-flash", label: "Gemini 3.5 Flash" },
      { id: "gemini-3.1-flash-lite", label: "Gemini 3.1 Flash-Lite" }
    ];
    let voices = [];
    let ttsSupported = isTtsSupported();
    let previewPlaying = false;
    const settings = derived(() => profileStore.settings);
    async function saveSettings(partial) {
      try {
        await settingsStore.update(partial);
        toastStore.success("Impostazioni salvate.");
      } catch (e) {
        toastStore.error(friendlyError(e));
      }
    }
    function previewTts() {
      if (previewPlaying) {
        stopTts();
        previewPlaying = false;
        return;
      }
      previewPlaying = true;
      const lang = settings()?.tts_voice_uri ? voices.find((v) => v.uri === settings().tts_voice_uri)?.lang ?? "it-IT" : "it-IT";
      const text = lang.startsWith("it") ? "Questa è un'anteprima della voce selezionata." : "This is a voice preview.";
      speak(text, lang, settings()?.tts_voice_uri, settings()?.tts_rate, settings()?.tts_pitch);
      setTimeout(() => previewPlaying = false, 4e3);
    }
    let geminiKey = "";
    let savingKey = false;
    let deletingKey = false;
    async function saveGeminiKey() {
      if (!geminiKey.trim()) return;
      savingKey = true;
      try {
        await settingsStore.saveGeminiKey(geminiKey.trim());
        toastStore.success("Chiave API salvata.");
        geminiKey = "";
      } catch (e) {
        toastStore.error(friendlyError(e));
      } finally {
        savingKey = false;
      }
    }
    async function deleteGeminiKey() {
      deletingKey = true;
      try {
        await settingsStore.deleteGeminiKey();
        toastStore.success("Chiave API rimossa.");
      } catch (e) {
        toastStore.error(friendlyError(e));
      } finally {
        deletingKey = false;
      }
    }
    let exporting = false;
    async function exportData() {
      const profileId = profileStore.active?.id;
      if (!profileId) return;
      exporting = true;
      try {
        const res = await fetch(`/api/profiles/${profileId}/export`);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `falschcard-backup-${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        toastStore.success("Backup esportato.");
      } catch (e) {
        toastStore.error(friendlyError(e));
      } finally {
        exporting = false;
      }
    }
    head("1i19ct2", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>Impostazioni — Falschcard</title>`);
      });
    });
    $$renderer2.push(`<div class="max-w-xl mx-auto flex flex-col gap-6"><h1 class="text-xl font-bold font-display text-fc-text">`);
    Settings($$renderer2, { size: 20, class: "inline mr-2 text-fc-muted" });
    $$renderer2.push(`<!---->Impostazioni</h1> <div class="settings-section flex flex-col gap-3"><h2 class="text-xs font-semibold text-fc-muted uppercase tracking-widest flex items-center gap-2">`);
    Key($$renderer2, { size: 13 });
    $$renderer2.push(`<!----> Gemini API</h2> `);
    GlassCard($$renderer2, {
      pad: "md",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex items-center justify-between mb-4"><div><p class="text-sm font-medium text-fc-text">Chiave API Gemini</p> <p class="text-xs text-fc-muted mt-0.5">Usata per valutazione e tutor AI. Salvata cifrata sul server.</p></div> <div${attr_class(`flex items-center gap-1.5 text-xs ${settings()?.has_api_key ? "text-fc-success" : "text-fc-warning"}`)}>`);
        if (settings()?.has_api_key) {
          $$renderer3.push("<!--[0-->");
          Circle_check_big($$renderer3, { size: 14 });
          $$renderer3.push(`<!----> Attiva`);
        } else {
          $$renderer3.push("<!--[-1-->");
          Triangle_alert($$renderer3, { size: 14 });
          $$renderer3.push(`<!----> Mancante`);
        }
        $$renderer3.push(`<!--]--></div></div> <div class="relative mb-3"><input${attr("type", "password")} class="input-base pr-10 font-mono text-sm" placeholder="Incolla la tua chiave API Gemini..."${attr("value", geminiKey)}/> <button class="absolute right-3 top-1/2 -translate-y-1/2 text-fc-faint hover:text-fc-muted transition-colors"${attr("aria-label", "Mostra")}>`);
        {
          $$renderer3.push("<!--[-1-->");
          Eye($$renderer3, { size: 15 });
        }
        $$renderer3.push(`<!--]--></button></div> <div class="flex gap-2">`);
        Button($$renderer3, {
          variant: "primary",
          size: "sm",
          loading: savingKey,
          onclick: saveGeminiKey,
          disabled: !geminiKey.trim(),
          children: ($$renderer4) => {
            $$renderer4.push(`<!---->Salva chiave`);
          }
        });
        $$renderer3.push(`<!----> `);
        if (settings()?.has_api_key) {
          $$renderer3.push("<!--[0-->");
          Button($$renderer3, {
            variant: "danger",
            size: "sm",
            loading: deletingKey,
            onclick: deleteGeminiKey,
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Rimuovi`);
            }
          });
        } else {
          $$renderer3.push("<!--[-1-->");
        }
        $$renderer3.push(`<!--]--></div>`);
      }
    });
    $$renderer2.push(`<!----> `);
    if (settings()?.has_api_key) {
      $$renderer2.push("<!--[0-->");
      GlassCard($$renderer2, {
        pad: "md",
        children: ($$renderer3) => {
          $$renderer3.push(`<p class="text-sm font-medium text-fc-text mb-3">Modello Gemini</p> `);
          $$renderer3.select(
            {
              class: "input-base text-sm",
              value: MODELS.some((m) => m.id === settings().gemini_model) ? settings().gemini_model : MODELS[0].id,
              onchange: (e) => saveSettings({ gemini_model: e.target.value })
            },
            ($$renderer4) => {
              $$renderer4.push(`<!--[-->`);
              const each_array = ensure_array_like(MODELS);
              for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
                let m = each_array[$$index];
                $$renderer4.option({ value: m.id }, ($$renderer5) => {
                  $$renderer5.push(`${escape_html(m.label)}`);
                });
              }
              $$renderer4.push(`<!--]-->`);
            }
          );
          $$renderer3.push(` <p class="text-xs text-fc-muted mt-2">Usato per valutazione, correzione e tutor AI.</p>`);
        }
      });
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (ttsSupported) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="settings-section flex flex-col gap-3"><h2 class="text-xs font-semibold text-fc-muted uppercase tracking-widest flex items-center gap-2">`);
      Volume_2($$renderer2, { size: 13 });
      $$renderer2.push(`<!----> Lettura vocale</h2> `);
      GlassCard($$renderer2, {
        pad: "md",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex items-center justify-between"><div><p class="text-sm font-medium text-fc-text">Leggi domanda automaticamente</p> <p class="text-xs text-fc-muted mt-0.5">La domanda viene letta ad alta voce all'apertura di ogni carta</p></div> `);
          Toggle($$renderer3, {
            checked: settings()?.auto_read_question ?? false,
            onchange: (v) => saveSettings({ auto_read_question: v })
          });
          $$renderer3.push(`<!----></div>`);
        }
      });
      $$renderer2.push(`<!----> `);
      if (voices.length > 0) {
        $$renderer2.push("<!--[0-->");
        GlassCard($$renderer2, {
          pad: "md",
          children: ($$renderer3) => {
            $$renderer3.push(`<p class="text-sm font-medium text-fc-text mb-3">Voce</p> `);
            $$renderer3.select(
              {
                class: "input-base text-sm mb-3",
                value: settings()?.tts_voice_uri ?? "",
                onchange: (e) => saveSettings({ tts_voice_uri: e.target.value || null })
              },
              ($$renderer4) => {
                $$renderer4.option({ value: "" }, ($$renderer5) => {
                  $$renderer5.push(`Predefinita del sistema`);
                });
                $$renderer4.push(`<!--[-->`);
                const each_array_1 = ensure_array_like(voices);
                for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
                  let v = each_array_1[$$index_1];
                  $$renderer4.option({ value: v.uri }, ($$renderer5) => {
                    $$renderer5.push(`${escape_html(v.name)} (${escape_html(v.lang)})`);
                  });
                }
                $$renderer4.push(`<!--]-->`);
              }
            );
            $$renderer3.push(` `);
            {
              let iconLeft = function($$renderer4) {
                Volume_2($$renderer4, { size: 13 });
              };
              Button($$renderer3, {
                variant: "secondary",
                size: "sm",
                onclick: previewTts,
                iconLeft,
                children: ($$renderer4) => {
                  $$renderer4.push(`<!---->${escape_html(previewPlaying ? "Ferma" : "Anteprima voce")}`);
                }
              });
            }
            $$renderer3.push(`<!---->`);
          }
        });
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      GlassCard($$renderer2, {
        pad: "md",
        children: ($$renderer3) => {
          $$renderer3.push(`<div class="flex flex-col gap-4"><div><div class="flex items-center justify-between mb-2"><p class="text-sm font-medium text-fc-text">Velocità</p> <span class="text-xs text-fc-muted tabular-nums">${escape_html((settings()?.tts_rate ?? 1).toFixed(1))}×</span></div> <input type="range" min="0.5" max="2" step="0.1" class="w-full accent-fc-accent"${attr("value", settings()?.tts_rate ?? 1)}/></div> <div><div class="flex items-center justify-between mb-2"><p class="text-sm font-medium text-fc-text">Tono</p> <span class="text-xs text-fc-muted tabular-nums">${escape_html((settings()?.tts_pitch ?? 1).toFixed(1))}</span></div> <input type="range" min="0" max="2" step="0.1" class="w-full accent-fc-accent"${attr("value", settings()?.tts_pitch ?? 1)}/></div></div>`);
        }
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="settings-section flex flex-col gap-3"><h2 class="text-xs font-semibold text-fc-muted uppercase tracking-widest">Dati</h2> `);
    GlassCard($$renderer2, {
      pad: "md",
      children: ($$renderer3) => {
        $$renderer3.push(`<div class="flex items-center justify-between"><div><p class="text-sm font-medium text-fc-text">Esporta dati</p> <p class="text-xs text-fc-muted mt-0.5">Scarica un backup JSON di tutti i tuoi mazzi</p></div> `);
        {
          let iconLeft = function($$renderer4) {
            Download($$renderer4, { size: 13 });
          };
          Button($$renderer3, {
            variant: "secondary",
            size: "sm",
            loading: exporting,
            onclick: exportData,
            iconLeft,
            children: ($$renderer4) => {
              $$renderer4.push(`<!---->Esporta`);
            }
          });
        }
        $$renderer3.push(`<!----></div>`);
      }
    });
    $$renderer2.push(`<!----></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="settings-section flex flex-col gap-3"><h2 class="text-xs font-semibold text-fc-muted uppercase tracking-widest flex items-center gap-2">`);
      Smartphone($$renderer2, { size: 13 });
      $$renderer2.push(`<!----> App</h2> `);
      GlassCard($$renderer2, {
        pad: "sm",
        children: ($$renderer3) => {
          {
            $$renderer3.push("<!--[-1-->");
            $$renderer3.push(`<div class="flex items-center gap-4"><button type="button" class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shrink-0 transition-all hover:opacity-90 active:scale-[0.97]" style="background: linear-gradient(135deg, #7C3AED, #3B82F6)">`);
            Smartphone($$renderer3, { size: 15 });
            $$renderer3.push(`<!----> Installa</button> <div class="min-w-0"><p class="text-sm font-medium text-fc-text leading-snug">Installa Falschcard come app</p> <p class="text-xs text-fc-muted mt-0.5">Aprila direttamente dalla schermata iniziale, anche offline</p></div></div>`);
          }
          $$renderer3.push(`<!--]-->`);
        }
      });
      $$renderer2.push(`<!----></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
export {
  _page as default
};
