import{p as w,o as c,d as p,a as e,b as d,u as i,F as y,r as k,n as u,c as _,f as C,t as f,h as m,e as M,l as S,q as L,j as B}from"./index-D8WBi9PO.js";/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=a=>{for(const l in a)if(l.startsWith("aria-")||l==="role"||l==="title")return!0;return!1};/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=a=>a==="";/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const q=(...a)=>a.filter((l,r,n)=>!!l&&l.trim()!==""&&n.indexOf(l)===r).join(" ").trim();/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const A=a=>a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=a=>a.replace(/^([A-Z])|[\s-_]+(\w)/g,(l,r,n)=>n?n.toUpperCase():r.toLowerCase());/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=a=>{const l=I(a);return l.charAt(0).toUpperCase()+l.slice(1)};/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var h={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=({name:a,iconNode:l,absoluteStrokeWidth:r,"absolute-stroke-width":n,strokeWidth:t,"stroke-width":s,size:x=h.width,color:z=h.stroke,...b},{slots:g})=>w("svg",{...h,...b,width:x,height:x,stroke:z,"stroke-width":j(r)||j(n)||r===!0||n===!0?Number(t||s||h["stroke-width"])*24/Number(x):t||s||h["stroke-width"],class:q("lucide",b.class,...a?[`lucide-${A(V(a))}-icon`,`lucide-${A(a)}`]:["lucide-icon"]),...!g.default&&!$(b)&&{"aria-hidden":"true"}},[...l.map(P=>w(...P)),...g.default?[g.default()]:[]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const o=(a,l)=>(r,{slots:n,attrs:t})=>w(E,{...t,...r,iconNode:l,name:a},n);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=o("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=o("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const D=o("circle-plus",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=o("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=o("layers",[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=o("layout-dashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=o("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=o("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=o("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const v=o("sparkles",[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=o("users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=o("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=o("zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]),J={class:"min-h-screen bg-slate-50 flex"},Y={class:"hidden lg:flex lg:flex-col lg:w-64 xl:w-72 bg-slate-900 border-r border-slate-800 text-slate-300 flex-shrink-0 fixed inset-y-0 z-30"},K={class:"h-16 flex items-center justify-between px-6 border-b border-slate-800/80 bg-slate-950/40"},W={class:"flex items-center gap-3"},ee={class:"h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/25"},te={class:"px-4 pt-5 pb-2"},se={href:"/proposals/create",class:"flex items-center justify-center gap-2 w-full py-2.5 px-3.5 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium text-sm shadow-md shadow-brand-900/40 transition-all duration-200 group"},ae={class:"flex-1 px-3 py-4 space-y-1 overflow-y-auto"},le={class:"space-y-1"},oe=["href"],re={class:"flex items-center gap-3"},ne={class:"pt-6"},de={class:"mx-1 p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 text-xs space-y-2"},ie={class:"flex items-center justify-between text-slate-300"},ce={class:"flex items-center gap-1.5 font-medium"},pe={class:"p-4 border-t border-slate-800/80 bg-slate-950/50 flex items-center justify-between"},he={class:"flex items-center gap-1 text-slate-400"},xe={class:"p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors",title:"Settings"},ue={key:0,class:"fixed inset-0 z-50 lg:hidden flex",role:"dialog","aria-modal":"true"},fe={class:"relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 border-r border-slate-800 text-slate-300"},be={class:"absolute top-0 right-0 -mr-12 pt-4"},ge={class:"h-16 flex items-center px-6 border-b border-slate-800"},me={class:"flex items-center gap-2.5"},ve={class:"h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center text-white"},we={class:"flex-1 px-3 py-4 space-y-1 overflow-y-auto"},ye=["href"],ke={class:"flex items-center gap-3"},_e={key:0,class:"text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-300"},Ce={class:"flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72"},Me={class:"sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between"},je={class:"flex items-center gap-3 sm:gap-4"},Ae={class:"flex items-center text-sm font-medium text-slate-500"},ze={class:"flex items-center gap-3 sm:gap-4"},Pe={class:"hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-medium text-slate-700"},Se={class:"font-semibold text-slate-800 flex items-center gap-1"},Le={class:"relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"},Be={class:"hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium"},$e={class:"flex-1"},Ie={__name:"AppLayout",props:{currentRoute:{type:String,default:"Proposals"}},setup(a){const l=B(!1),r=[{name:"Dashboard",href:"/dashboard",icon:H,badge:null},{name:"Clients",href:"/clients",icon:T,badge:"4 Active"},{name:"Catalog",href:"/catalog",icon:F,badge:"6 Items"},{name:"Proposals",href:"/proposals",icon:R,badge:"New",highlightBadge:!0}];return(n,t)=>(c(),p("div",J,[e("aside",Y,[e("div",K,[e("div",W,[e("div",ee,[d(i(v),{class:"h-5 w-5"})]),t[4]||(t[4]=e("div",null,[e("span",{class:"font-bold text-white tracking-tight text-base leading-none block"},"ProposalAI"),e("span",{class:"text-[10px] text-slate-400 font-medium tracking-wider uppercase"},"Enterprise GenUI")],-1))]),t[5]||(t[5]=e("span",{class:"px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30"}," v2.4 ",-1))]),e("div",te,[e("a",se,[d(i(D),{class:"h-4 w-4 transition-transform group-hover:rotate-90 duration-300"}),t[6]||(t[6]=e("span",null,"Create Proposal",-1))])]),e("div",ae,[t[12]||(t[12]=e("div",{class:"px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400"}," Core Workspaces ",-1)),e("nav",le,[(c(),p(y,null,k(r,s=>e("a",{key:s.name,href:s.href,class:u([a.currentRoute===s.name?"bg-brand-600/15 text-white border-l-4 border-brand-500 font-semibold pl-3":"text-slate-300 hover:bg-slate-800/70 hover:text-white pl-4 font-medium","flex items-center justify-between py-2.5 pr-3 rounded-r-lg text-sm transition-colors duration-150 group"])},[e("div",re,[(c(),_(C(s.icon),{class:u([a.currentRoute===s.name?"text-brand-400":"text-slate-400 group-hover:text-slate-200","h-4 w-4 transition-colors"])},null,8,["class"])),e("span",null,f(s.name),1)]),s.badge?(c(),p("span",{key:0,class:u([s.highlightBadge?"bg-brand-500 text-white shadow-xs":"bg-slate-800 text-slate-400","text-[10px] px-2 py-0.5 rounded-full font-semibold"])},f(s.badge),3)):m("",!0)],10,oe)),64))]),e("div",ne,[t[11]||(t[11]=e("div",{class:"px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between"},[e("span",null,"AI Engine Status"),e("span",{class:"inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"})],-1)),e("div",de,[e("div",ie,[e("span",ce,[d(i(X),{class:"h-3.5 w-3.5 text-amber-400"}),t[7]||(t[7]=M(" Prompt Quota ",-1))]),t[8]||(t[8]=e("span",{class:"text-[11px] text-brand-400 font-semibold"},"92% Available",-1))]),t[9]||(t[9]=e("div",{class:"w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"},[e("div",{class:"bg-gradient-to-r from-brand-500 to-emerald-400 h-1.5 rounded-full w-[92%]"})],-1)),t[10]||(t[10]=e("p",{class:"text-[11px] text-slate-400"}," Gemini 1.5 Pro & Claude 3.5 synthesis ready for fast real-time drafting. ",-1))])])]),e("div",pe,[t[13]||(t[13]=S('<div class="flex items-center gap-3 min-w-0"><div class="h-9 w-9 rounded-full ring-2 ring-brand-500/40 overflow-hidden flex-shrink-0 bg-slate-800"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&amp;auto=format&amp;fit=crop&amp;q=80" alt="User Avatar" class="h-full w-full object-cover"></div><div class="min-w-0"><p class="text-sm font-semibold text-white truncate leading-snug">Elena Vance</p><p class="text-xs text-slate-400 truncate">Senior Deal Lead</p></div></div>',1)),e("div",he,[e("button",xe,[d(i(G),{class:"h-4 w-4"})])])])]),l.value?(c(),p("div",ue,[e("div",{class:"fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity",onClick:t[0]||(t[0]=s=>l.value=!1)}),e("div",fe,[e("div",be,[e("button",{type:"button",class:"h-10 w-10 rounded-full flex items-center justify-center text-white focus:outline-hidden",onClick:t[1]||(t[1]=s=>l.value=!1)},[d(i(Q),{class:"h-6 w-6"})])]),e("div",ge,[e("div",me,[e("div",ve,[d(i(v),{class:"h-4 w-4"})]),t[14]||(t[14]=e("span",{class:"font-bold text-white text-base"},"ProposalAI",-1))])]),e("nav",we,[(c(),p(y,null,k(r,s=>e("a",{key:s.name,href:s.href,class:u([a.currentRoute===s.name?"bg-brand-600/20 text-white border-l-4 border-brand-500 font-semibold":"text-slate-300 hover:bg-slate-800 hover:text-white font-medium","flex items-center justify-between px-3 py-2.5 rounded-r-lg text-sm"]),onClick:t[2]||(t[2]=x=>l.value=!1)},[e("div",ke,[(c(),_(C(s.icon),{class:"h-4 w-4 text-slate-400"})),e("span",null,f(s.name),1)]),s.badge?(c(),p("span",_e,f(s.badge),1)):m("",!0)],10,ye)),64))])])])):m("",!0),e("div",Ce,[e("header",Me,[e("div",je,[e("button",{type:"button",class:"lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100",onClick:t[3]||(t[3]=s=>l.value=!0)},[d(i(Z),{class:"h-5 w-5"})]),e("nav",Ae,[t[15]||(t[15]=e("a",{href:"/proposals",class:"hover:text-slate-900 transition-colors"},"Proposals",-1)),d(i(U),{class:"h-4 w-4 mx-1.5 text-slate-400"}),t[16]||(t[16]=e("span",{class:"text-slate-900 font-semibold"},"Create Proposal",-1))])]),e("div",ze,[e("div",Pe,[t[18]||(t[18]=e("span",{class:"relative flex h-2 w-2"},[e("span",{class:"animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"}),e("span",{class:"relative inline-flex rounded-full h-2 w-2 bg-emerald-500"})],-1)),t[19]||(t[19]=e("span",{class:"text-slate-500"},"Engine:",-1)),e("span",Se,[d(i(v),{class:"h-3 w-3 text-brand-600"}),t[17]||(t[17]=M(" Gemini 1.5 Pro ",-1))])]),e("button",Le,[d(i(N),{class:"h-4 w-4"}),t[20]||(t[20]=e("span",{class:"absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-600 ring-2 ring-white"},null,-1))]),t[22]||(t[22]=e("div",{class:"h-5 w-px bg-slate-200"},null,-1)),e("div",Be,[d(i(O),{class:"h-4 w-4 text-emerald-600"}),t[21]||(t[21]=e("span",null,"SOC2 Certified",-1))])])]),e("main",$e,[L(n.$slots,"default")])])]))}};export{D as C,R as F,F as L,v as S,T as U,X as Z,Ie as _,o as c};
