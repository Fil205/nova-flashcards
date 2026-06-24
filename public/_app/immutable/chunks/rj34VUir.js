import{c as w,a as f}from"./Ct5KBVBl.js";import{p as m,f as v,i as _,a as g,g as s,b as a,d as u}from"./zHcUJTt4.js";import{I as h,c as $}from"./aWPtL9xz.js";import{s as I,r as S}from"./BhDUxMO9.js";var b=new Set(["$$slots","$$events","$$legacy"]);function O(t,e){m(e,!0);/**
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
 */let n=S(e,b);const d=[["path",{d:"M12 15V3"}],["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"}],["path",{d:"m7 10 5 5 5-5"}]];h(t,I({name:"download"},()=>n,{get iconNode(){return d},children:(i,P)=>{var l=w(),p=v(l);$(p,()=>e.children??_),f(i,l)},$$slots:{default:!0}})),g()}var E=new Set(["$$slots","$$events","$$legacy"]);function z(t,e){m(e,!0);/**
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
 */let n=S(e,E);const d=[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"}],["circle",{cx:"12",cy:"12",r:"3"}]];h(t,I({name:"settings"},()=>n,{get iconNode(){return d},children:(i,P)=>{var l=w(),p=v(l);$(p,()=>e.children??_),f(i,l)},$$slots:{default:!0}})),g()}let o=u(!1),y=u(!1),r=u(null),c=!1;function L(){if(c||typeof window>"u")return()=>{};c=!0,a(o,window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===!0,!0),a(y,/iphone|ipad|ipod/i.test(navigator.userAgent)&&!window.MSStream,!0),a(r,window.__deferredInstallPrompt,!0);const t=()=>{a(r,window.__deferredInstallPrompt,!0)},e=()=>{a(o,!0),a(r,null)};return window.addEventListener("pwa-installable",t),window.addEventListener("pwa-installed",e),window.addEventListener("beforeinstallprompt",n=>{n.preventDefault(),window.__deferredInstallPrompt=n,a(r,n,!0)}),()=>{window.removeEventListener("pwa-installable",t),window.removeEventListener("pwa-installed",e)}}async function M(){const t=s(r)??window.__deferredInstallPrompt;if(!t)return"unavailable";await t.prompt();const{outcome:e}=await t.userChoice;return e==="accepted"&&a(o,!0),a(r,null),window.__deferredInstallPrompt=null,e}const A={get installed(){return s(o)},get isIOS(){return s(y)},get deferred(){return s(r)},init:L,install:M};export{O as D,z as S,A as p};
