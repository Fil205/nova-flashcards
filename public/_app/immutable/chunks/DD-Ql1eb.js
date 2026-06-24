import{c as j,a as n,d as U,e as W,b as M,f as _,s as Y}from"./Ct5KBVBl.js";import{p as C,f as E,a as F,i as Z,M as $,g as s,N as ee,d as P,c as l,s as I,r as d,b as T,t as V}from"./zHcUJTt4.js";import{I as te,c as N,k as ae,l as re,m as oe,n as se,s as ie,h as le}from"./aWPtL9xz.js";import{s as de,r as ne,p as q,i as b}from"./BhDUxMO9.js";import{b as A}from"./DeVgPpkz.js";import{X as ce}from"./BTdM5JnV.js";var ve=new Set(["$$slots","$$events","$$legacy"]);function ke(x,e){C(e,!0);/**
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
 */let c=ne(e,ve);const w=[["path",{d:"M3 6h18"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17"}]];te(x,de({name:"trash-2"},()=>c,{get iconNode(){return w},children:(i,v)=>{var h=j(),m=E(h);N(m,()=>e.children??Z),n(i,h)},$$slots:{default:!0}})),F()}var fe=_('<h2 class="text-base font-semibold text-fc-text font-display"> </h2>'),me=_('<div class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-fc-border"><!> <button class="ml-auto p-1 rounded-lg text-fc-muted hover:text-fc-text hover:bg-white/8 transition-colors" aria-label="Chiudi"><!></button></div>'),ue=_('<div class="px-5 pb-5 pt-1 flex items-center justify-end gap-2 border-t border-fc-border"><!></div>'),be=_('<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true"><div role="presentation"><!> <div class="p-5"><!></div> <!></div></div>');function pe(x,e){C(e,!0);let c=q(e,"open",15),w=q(e,"width",3,"md"),i=P(null),v=P(null);const h={sm:"max-w-sm",md:"max-w-md",lg:"max-w-lg",xl:"max-w-2xl"};function m(){var o;if(!s(i)||!s(v)){c(!1),(o=e.onclose)==null||o.call(e);return}oe(s(v),()=>{se(s(i),()=>{var r;c(!1),(r=e.onclose)==null||r.call(e)})})}function H(o){o.key==="Escape"&&m()}$(()=>(c()?(requestAnimationFrame(()=>{ae(s(i)),re(s(v))}),document.body.style.overflow="hidden"):document.body.style.overflow="",()=>{document.body.style.overflow=""}));var z=j();W("keydown",ee,H);var K=E(z);{var S=o=>{var r=be(),u=l(r),O=l(u);{var X=t=>{var a=me(),f=l(a);{var L=k=>{var p=fe(),R=l(p,!0);d(p),V(()=>Y(R,e.title)),n(k,p)};b(f,k=>{e.title&&k(L)})}var g=I(f,2),Q=l(g);ce(Q,{size:18}),d(g),d(a),M("click",g,m),n(t,a)};b(O,t=>{(e.title||e.onclose)&&t(X)})}var y=I(O,2),B=l(y);{var D=t=>{var a=j(),f=E(a);N(f,()=>e.children),n(t,a)};b(B,t=>{e.children&&t(D)})}d(y);var G=I(y,2);{var J=t=>{var a=ue(),f=l(a);N(f,()=>e.footer),d(a),n(t,a)};b(G,t=>{e.footer&&t(J)})}d(u),A(u,t=>T(v,t),()=>s(v)),d(r),A(r,t=>T(i,t),()=>s(i)),V(()=>{ie(r,"aria-label",e.title),le(u,1,`popover relative w-full ${h[w()]??""} max-h-[90dvh] overflow-y-auto`)}),M("click",r,()=>m()),M("click",u,t=>t.stopPropagation()),n(o,r)};b(K,o=>{c()&&o(S)})}n(x,z),F()}U(["click"]);export{pe as M,ke as T};
