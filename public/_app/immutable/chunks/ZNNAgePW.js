import{c as d,a as h}from"./Ct5KBVBl.js";import{p as f,f as u,i as w,a as l}from"./zHcUJTt4.js";import{I as g,c as m}from"./aWPtL9xz.js";import{s as y,r as S}from"./BhDUxMO9.js";var $=new Set(["$$slots","$$events","$$legacy"]);function z(n,e){f(e,!0);/**
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
 */let i=S(e,$);const c=[["path",{d:"M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"}],["path",{d:"M16 9a5 5 0 0 1 0 6"}],["path",{d:"M19.364 18.364a9 9 0 0 0 0-12.728"}]];g(n,y({name:"volume-2"},()=>i,{get iconNode(){return c},children:(a,s)=>{var t=d(),r=u(t);m(r,()=>e.children??w),h(a,t)},$$slots:{default:!0}})),l()}let o=[];function p(){return typeof window>"u"||!window.speechSynthesis?[]:window.speechSynthesis.getVoices().map(n=>({uri:n.voiceURI,name:n.name,lang:n.lang}))}function A(){return new Promise(n=>{if(typeof window>"u"||!window.speechSynthesis){n([]);return}const e=p();if(e.length>0){o=e,n(e);return}window.speechSynthesis.onvoiceschanged=()=>{o=p(),n(o)},setTimeout(()=>n(o),500)})}function _(n){if(!n)return"";let e=n;return e=e.replace(/```[a-z]*\n?/gi,"").replace(/```/g,"").replace(/`([^`]*)`/g,"$1"),e=e.replace(/\$\$([\s\S]*?)\$\$/g," $1 ").replace(/\$([^$]*)\$/g," $1 "),e=e.replace(/\\[a-zA-Z]+/g," ").replace(/[{}^_\\]/g," "),e=e.replace(/!?\[([^\]]*)\]\([^)]*\)/g,"$1"),e=e.replace(/[*_~#>|]/g," "),e.replace(/\s+/g," ").trim()}function I(n,e,i,c=1,a=1){if(typeof window>"u"||!window.speechSynthesis)return;window.speechSynthesis.cancel();const s=new SpeechSynthesisUtterance(_(n));if(s.lang=e,s.rate=c,s.pitch=a,i){const t=window.speechSynthesis.getVoices().find(r=>r.voiceURI===i);t&&(s.voice=t)}window.speechSynthesis.speak(s)}function M(){typeof window>"u"||!window.speechSynthesis||window.speechSynthesis.cancel()}function k(){return typeof window<"u"&&"speechSynthesis"in window}export{z as V,I as a,A as g,k as i,M as s};
