import{p as _,o as p,c as w,b as n,w as j,e as h,T as R,a as e,d as o,t as u,n as g,F as M,r as A,f as P,i as y,q as H,k,u as B,g as S,m as q,s as G,j as F}from"./index-iKtPjRZ9.js";/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=a=>{for(const r in a)if(r.startsWith("aria-")||r==="role"||r==="title")return!0;return!1};/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=a=>a==="";/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=(...a)=>a.filter((r,l,d)=>!!r&&r.trim()!==""&&d.indexOf(r)===l).join(" ").trim();/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const z=a=>a.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=a=>a.replace(/^([A-Z])|[\s-_]+(\w)/g,(r,l,d)=>d?d.toUpperCase():l.toLowerCase());/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=a=>{const r=V(a);return r.charAt(0).toUpperCase()+r.slice(1)};/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var v={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=({name:a,iconNode:r,absoluteStrokeWidth:l,"absolute-stroke-width":d,strokeWidth:c,"stroke-width":b,size:x=v.width,color:f=v.stroke,...t},{slots:s})=>_("svg",{...v,...t,width:x,height:x,stroke:f,"stroke-width":L(l)||L(d)||l===!0||d===!0?Number(c||b||v["stroke-width"])*24/Number(x):c||b||v["stroke-width"],class:T("lucide",t.class,...a?[`lucide-${z(E(a))}-icon`,`lucide-${z(a)}`]:["lucide-icon"]),...!s.default&&!N(t)&&{"aria-hidden":"true"}},[...r.map(m=>_(...m)),...s.default?[s.default()]:[]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const i=(a,r)=>(l,{slots:d,attrs:c})=>_(O,{...c,...l,iconNode:r,name:a},d);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=i("arrow-right",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=i("bell",[["path",{d:"M10.268 21a2 2 0 0 0 3.464 0",key:"vwvbt9"}],["path",{d:"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326",key:"11g9vi"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y=i("check",[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Q=i("chevron-right",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=i("circle-plus",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M8 12h8",key:"1wcyev"}],["path",{d:"M12 8v8",key:"napkw2"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=i("crown",[["path",{d:"M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z",key:"1vdc57"}],["path",{d:"M5 21h14",key:"11awu3"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=i("file-text",[["path",{d:"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",key:"1oefj6"}],["path",{d:"M14 2v5a1 1 0 0 0 1 1h5",key:"wfsgrz"}],["path",{d:"M10 9H8",key:"b1mrlr"}],["path",{d:"M16 13H8",key:"t4e002"}],["path",{d:"M16 17H8",key:"z1uh3a"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J=i("layers",[["path",{d:"M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z",key:"zw3jo"}],["path",{d:"M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12",key:"1wduqc"}],["path",{d:"M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17",key:"kqbvx6"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const K=i("layout-dashboard",[["rect",{width:"7",height:"9",x:"3",y:"3",rx:"1",key:"10lvy0"}],["rect",{width:"7",height:"5",x:"14",y:"3",rx:"1",key:"16une8"}],["rect",{width:"7",height:"9",x:"14",y:"12",rx:"1",key:"1hutg5"}],["rect",{width:"7",height:"5",x:"3",y:"16",rx:"1",key:"ldoo1y"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ee=i("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const te=i("menu",[["path",{d:"M4 5h16",key:"1tepv9"}],["path",{d:"M4 12h16",key:"1lakjw"}],["path",{d:"M4 19h16",key:"1djgab"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const se=i("settings",[["path",{d:"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",key:"1i5ecw"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=i("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=i("shield",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=i("sparkles",[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=i("users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["path",{d:"M16 3.128a4 4 0 0 1 0 7.744",key:"16gr8j"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=i("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const le=i("zap",[["path",{d:"M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z",key:"1xq2db"}]]),ne={key:0,class:"fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto",role:"dialog","aria-modal":"true","aria-labelledby":"subscription-modal-title"},ie={key:0,class:"relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8"},de={class:"px-6 pt-7 pb-4 text-center space-y-3"},ce={class:"inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-2xs"},pe={class:"text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed"},ue={class:"px-6 py-4 space-y-4 bg-slate-50/70 border-y border-slate-100"},he={class:"flex items-center justify-center gap-2"},xe={class:"space-y-2.5 max-h-56 overflow-y-auto pr-1"},be={class:"mt-0.5 h-5 w-5 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0"},me={class:"min-w-0 text-left"},fe={class:"text-xs font-bold text-slate-900 leading-snug"},ge={class:"text-[11px] text-slate-500 leading-tight mt-0.5"},ye={class:"p-6 space-y-3 bg-white"},ve=["disabled"],we={class:"flex items-center justify-between text-[11px] text-slate-400 px-2"},ke={class:"flex items-center gap-1"},Ce={__name:"SubscriptionModal",props:{show:{type:Boolean,default:!1},limit:{type:Number,default:3},currentCount:{type:Number,default:3},errorMessage:{type:String,default:"You have reached the free tier limit of 3 proposals."}},emits:["close","upgrade"],setup(a,{emit:r}){const l=r,d=k(!1),c=k("monthly"),b=[{title:"Unlimited AI Proposals",description:"No more 3-proposal cap. Generate unlimited proposals for all client deals."},{title:"Top-Tier AI Engines (Gemini 1.5 Pro & Claude 3.5)",description:"Upgrade from Gemini Flash-Lite to frontier reasoning models for complex proposals."},{title:"Domain Knowledge RAG Memory",description:"Autonomous pgvector embeddings trained on your won proposals to boost win rates."},{title:"White-Label Branding & Custom PDFs",description:"Remove default watermarks and attach your company domain and letterhead."},{title:"Priority 24/7 SLA & Team Workspaces",description:"Sub-minute generation latency and multi-seat collaborative editing."}];function x(){d.value=!0,l("upgrade",{cycle:c.value,plan:"pro"})}function f(){l("close")}return(t,s)=>(p(),w(H,{to:"body"},[n(R,{"enter-active-class":"transition duration-300 ease-out","enter-from-class":"opacity-0","enter-to-class":"opacity-100","leave-active-class":"transition duration-200 ease-in","leave-from-class":"opacity-100","leave-to-class":"opacity-0"},{default:j(()=>[a.show?(p(),h("div",ne,[n(R,{"enter-active-class":"transition duration-300 ease-out","enter-from-class":"opacity-0 scale-95 translate-y-4","enter-to-class":"opacity-100 scale-100 translate-y-0","leave-active-class":"transition duration-200 ease-in","leave-from-class":"opacity-100 scale-100 translate-y-0","leave-to-class":"opacity-0 scale-95 translate-y-4"},{default:j(()=>[a.show?(p(),h("div",ie,[s[5]||(s[5]=e("div",{class:"h-2 w-full bg-gradient-to-r from-amber-400 via-brand-500 to-indigo-600"},null,-1)),e("button",{type:"button",onClick:f,class:"absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-10",title:"Close modal"},[n(o(I),{class:"h-5 w-5"})]),e("div",de,[e("div",ce,[n(o($),{class:"h-4 w-4 text-amber-500"}),e("span",null,"Freemium Limit Reached ("+u(a.currentCount)+"/"+u(a.limit)+" Proposals Used)",1)]),s[2]||(s[2]=e("h2",{id:"subscription-modal-title",class:"text-2xl font-black text-slate-900 tracking-tight leading-tight"}," Upgrade to Pro for Unlimited Generations ",-1)),e("p",pe,u(a.errorMessage)+" Your free proposal quota has been exhausted. Upgrade now to unlock advanced AI models, domain RAG memory, and unlimited pitching power. ",1)]),e("div",ue,[e("div",he,[e("button",{type:"button",onClick:s[0]||(s[0]=m=>c.value="monthly"),class:g([c.value==="monthly"?"bg-white text-slate-900 shadow-xs font-bold border-slate-200":"text-slate-500 hover:text-slate-800 font-medium border-transparent","px-3 py-1 rounded-lg text-xs border transition-all"])}," Monthly ($49/mo) ",2),e("button",{type:"button",onClick:s[1]||(s[1]=m=>c.value="annually"),class:g([c.value==="annually"?"bg-white text-slate-900 shadow-xs font-bold border-slate-200":"text-slate-500 hover:text-slate-800 font-medium border-transparent","px-3 py-1 rounded-lg text-xs border transition-all relative"])},[...s[3]||(s[3]=[e("span",null,"Annually ($39/mo)",-1),e("span",{class:"ml-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200"},"Save 20%",-1)])],2)]),e("div",xe,[(p(),h(M,null,A(b,(m,D)=>e("div",{key:D,class:"flex items-start gap-2.5 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs"},[e("div",be,[n(o(Y),{class:"h-3 w-3"})]),e("div",me,[e("p",fe,u(m.title),1),e("p",ge,u(m.description),1)])])),64))])]),e("div",ye,[e("button",{type:"button",onClick:x,disabled:d.value,class:"w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold text-sm shadow-lg shadow-brand-500/30 transition-all duration-200 group disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"},[d.value?(p(),w(o(ee),{key:0,class:"h-5 w-5 animate-spin"})):(p(),w(o($),{key:1,class:"h-5 w-5 text-amber-300 group-hover:rotate-12 transition-transform"})),e("span",null,u(d.value?"Redirecting to Checkout...":"Upgrade to Pro"),1),n(o(Z),{class:"h-4 w-4 transition-transform group-hover:translate-x-1"})],8,ve),e("div",we,[e("span",ke,[n(o(oe),{class:"h-3.5 w-3.5 text-emerald-500"}),s[4]||(s[4]=P(" 30-day money-back guarantee ",-1))]),e("button",{type:"button",onClick:f,class:"hover:text-slate-600 hover:underline"}," Dismiss for now ")])])])):y("",!0)]),_:1})])):y("",!0)]),_:1})]))}},_e={class:"min-h-screen bg-slate-50 flex"},Me={class:"hidden lg:flex lg:flex-col lg:w-64 xl:w-72 bg-slate-900 border-r border-slate-800 text-slate-300 flex-shrink-0 fixed inset-y-0 z-30"},Ae={class:"h-16 flex items-center justify-between px-6 border-b border-slate-800/80 bg-slate-950/40"},Pe={href:"/dashboard",class:"flex items-center gap-3 group"},$e={class:"h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 group-hover:scale-105 transition-transform"},je={class:"px-4 pt-5 pb-2"},Re={href:"/proposals/create",class:"flex items-center justify-center gap-2 w-full py-2.5 px-3.5 rounded-lg bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium text-sm shadow-md shadow-brand-900/40 transition-all duration-200 group"},Se={class:"flex-1 px-3 py-4 space-y-1 overflow-y-auto"},Le={class:"space-y-1"},ze=["href"],Ue={class:"flex items-center gap-3"},Ie={class:"pt-6"},De={class:"mx-1 p-3 rounded-xl bg-slate-950/60 border border-slate-800/70 text-xs space-y-2"},He={class:"flex items-center justify-between text-slate-300"},Be={class:"flex items-center gap-1.5 font-medium"},qe={class:"text-[11px] text-slate-400"},Ge={class:"p-4 border-t border-slate-800/80 bg-slate-950/50 flex items-center justify-between"},Fe={class:"flex items-center gap-1 text-slate-400"},Ne={class:"p-1.5 hover:text-white hover:bg-slate-800 rounded-lg transition-colors",title:"Settings"},Te={key:0,class:"fixed inset-0 z-50 lg:hidden flex",role:"dialog","aria-modal":"true"},Ve={class:"relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 border-r border-slate-800 text-slate-300"},Ee={class:"absolute top-0 right-0 -mr-12 pt-4"},Oe={class:"h-16 flex items-center px-6 border-b border-slate-800"},Ze={class:"flex items-center gap-2.5"},We={class:"h-8 w-8 rounded-lg bg-brand-600 flex items-center justify-center text-white"},Ye={class:"px-4 pt-4 pb-2"},Qe={class:"flex-1 px-3 py-4 space-y-1 overflow-y-auto"},Xe=["href"],Je={class:"flex items-center gap-3"},Ke={key:0,class:"text-[10px] px-2 py-0.5 rounded-full font-semibold bg-slate-800 text-slate-300"},et={class:"flex-1 flex flex-col min-w-0 lg:pl-64 xl:pl-72"},tt={class:"sticky top-0 z-20 h-16 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between"},st={class:"flex items-center gap-3 sm:gap-4"},at={class:"flex items-center text-xs sm:text-sm font-medium text-slate-500"},ot=["href"],rt={class:"text-slate-900 font-semibold truncate"},lt={class:"flex items-center gap-3 sm:gap-4"},nt={class:"hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-xs font-medium text-slate-700"},it={class:"font-semibold text-slate-800 flex items-center gap-1"},dt={class:"relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"},ct={class:"hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium"},pt={class:"flex-1"},ht={__name:"AppLayout",props:{currentRoute:{type:String,default:"Proposals"},subRoute:{type:String,default:""},aiModel:{type:String,default:null}},setup(a){const r=a,l=B(),d=k(r.aiModel||l.activeAiModel||"Gemini Flash-Lite"),c=k(!1),b=[{name:"Dashboard",href:"/dashboard",icon:K,badge:null},{name:"Clients",href:"/clients",icon:re,badge:"4 Active"},{name:"Catalog",href:"/catalog",icon:J,badge:"6 Items"},{name:"Proposals",href:"/proposals",icon:X,badge:"New",highlightBadge:!0}],x=F(()=>r.currentRoute==="Create Proposal"||r.subRoute==="Create"?{parent:"Proposals",parentHref:"/proposals",current:"Create Proposal"}:r.currentRoute==="Proposals"?{parent:"Workspace",parentHref:"/dashboard",current:"Proposals Directory"}:r.currentRoute==="Dashboard"?{parent:"Workspace",parentHref:"/dashboard",current:"Dashboard Overview"}:r.currentRoute==="Clients"?{parent:"Directory",parentHref:"/dashboard",current:"Client Accounts"}:r.currentRoute==="Catalog"?{parent:"Inventory",parentHref:"/dashboard",current:"Services & Pricing Catalog"}:{parent:"Workspace",parentHref:"/dashboard",current:r.currentRoute});return(f,t)=>(p(),h("div",_e,[e("aside",Me,[e("div",Ae,[e("a",Pe,[e("div",$e,[n(o(C),{class:"h-5 w-5"})]),t[6]||(t[6]=e("div",null,[e("span",{class:"font-bold text-white tracking-tight text-base leading-none block"},"ProposalAI"),e("span",{class:"text-[10px] text-slate-400 font-medium tracking-wider uppercase"},"Enterprise GenUI")],-1))]),t[7]||(t[7]=e("span",{class:"px-2 py-0.5 rounded text-[10px] font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30"}," v2.4 ",-1))]),e("div",je,[e("a",Re,[n(o(U),{class:"h-4 w-4 transition-transform group-hover:rotate-90 duration-300"}),t[8]||(t[8]=e("span",null,"Create Proposal",-1))])]),e("div",Se,[t[13]||(t[13]=e("div",{class:"px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400"}," Core Workspaces ",-1)),e("nav",Le,[(p(),h(M,null,A(b,s=>e("a",{key:s.name,href:s.href,class:g([a.currentRoute===s.name||s.name==="Proposals"&&a.currentRoute==="Create Proposal"?"bg-brand-600/20 text-white border-l-4 border-brand-500 font-semibold pl-3":"text-slate-300 hover:bg-slate-800/70 hover:text-white pl-4 font-medium","flex items-center justify-between py-2.5 pr-3 rounded-r-lg text-sm transition-colors duration-150 group"])},[e("div",Ue,[(p(),w(S(s.icon),{class:g([a.currentRoute===s.name||s.name==="Proposals"&&a.currentRoute==="Create Proposal"?"text-brand-400":"text-slate-400 group-hover:text-slate-200","h-4 w-4 transition-colors"])},null,8,["class"])),e("span",null,u(s.name),1)]),s.badge?(p(),h("span",{key:0,class:g([s.highlightBadge?"bg-brand-500 text-white shadow-xs":"bg-slate-800 text-slate-400","text-[10px] px-2 py-0.5 rounded-full font-semibold"])},u(s.badge),3)):y("",!0)],10,ze)),64))]),e("div",Ie,[t[12]||(t[12]=e("div",{class:"px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between"},[e("span",null,"AI Engine Status"),e("span",{class:"inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"})],-1)),e("div",De,[e("div",He,[e("span",Be,[n(o(le),{class:"h-3.5 w-3.5 text-amber-400"}),t[9]||(t[9]=P(" Prompt Quota ",-1))]),t[10]||(t[10]=e("span",{class:"text-[11px] text-brand-400 font-semibold"},"92% Available",-1))]),t[11]||(t[11]=e("div",{class:"w-full bg-slate-800 h-1.5 rounded-full overflow-hidden"},[e("div",{class:"bg-gradient-to-r from-brand-500 to-emerald-400 h-1.5 rounded-full w-[92%]"})],-1)),e("p",qe,u(d.value)+" synthesis ready for fast real-time drafting. ",1)])])]),e("div",Ge,[t[14]||(t[14]=q('<div class="flex items-center gap-3 min-w-0"><div class="h-9 w-9 rounded-full ring-2 ring-brand-500/40 overflow-hidden flex-shrink-0 bg-slate-800"><img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&amp;auto=format&amp;fit=crop&amp;q=80" alt="User Avatar" class="h-full w-full object-cover"></div><div class="min-w-0"><p class="text-sm font-semibold text-white truncate leading-snug">Elena Vance</p><p class="text-xs text-slate-400 truncate">Senior Deal Lead</p></div></div>',1)),e("div",Fe,[e("button",Ne,[n(o(se),{class:"h-4 w-4"})])])])]),c.value?(p(),h("div",Te,[e("div",{class:"fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity",onClick:t[0]||(t[0]=s=>c.value=!1)}),e("div",Ve,[e("div",Ee,[e("button",{type:"button",class:"h-10 w-10 rounded-full flex items-center justify-center text-white focus:outline-hidden",onClick:t[1]||(t[1]=s=>c.value=!1)},[n(o(I),{class:"h-6 w-6"})])]),e("div",Oe,[e("div",Ze,[e("div",We,[n(o(C),{class:"h-4 w-4"})]),t[15]||(t[15]=e("span",{class:"font-bold text-white text-base"},"ProposalAI",-1))])]),e("div",Ye,[e("a",{href:"/proposals/create",onClick:t[2]||(t[2]=s=>c.value=!1),class:"flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-lg bg-brand-600 text-white font-medium text-xs shadow-sm"},[n(o(U),{class:"h-4 w-4"}),t[16]||(t[16]=e("span",null,"Create Proposal",-1))])]),e("nav",Qe,[(p(),h(M,null,A(b,s=>e("a",{key:s.name,href:s.href,class:g([a.currentRoute===s.name||s.name==="Proposals"&&a.currentRoute==="Create Proposal"?"bg-brand-600/20 text-white border-l-4 border-brand-500 font-semibold":"text-slate-300 hover:bg-slate-800 hover:text-white font-medium","flex items-center justify-between px-3 py-2.5 rounded-r-lg text-sm"]),onClick:t[3]||(t[3]=m=>c.value=!1)},[e("div",Je,[(p(),w(S(s.icon),{class:"h-4 w-4 text-slate-400"})),e("span",null,u(s.name),1)]),s.badge?(p(),h("span",Ke,u(s.badge),1)):y("",!0)],10,Xe)),64))])])])):y("",!0),e("div",et,[e("header",tt,[e("div",st,[e("button",{type:"button",class:"lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors",onClick:t[4]||(t[4]=s=>c.value=!0)},[n(o(te),{class:"h-5 w-5"})]),e("nav",at,[e("a",{href:x.value.parentHref,class:"hover:text-slate-900 transition-colors"},u(x.value.parent),9,ot),n(o(Q),{class:"h-3.5 w-3.5 mx-1.5 text-slate-400"}),e("span",rt,u(x.value.current),1)])]),e("div",lt,[e("div",nt,[t[17]||(t[17]=e("span",{class:"relative flex h-2 w-2"},[e("span",{class:"animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"}),e("span",{class:"relative inline-flex rounded-full h-2 w-2 bg-emerald-500"})],-1)),t[18]||(t[18]=e("span",{class:"text-slate-500"},"Engine:",-1)),e("span",it,[n(o(C),{class:"h-3 w-3 text-brand-600"}),P(" "+u(d.value),1)])]),o(l).isSubscribed?y("",!0):(p(),h("button",{key:0,type:"button",onClick:t[5]||(t[5]=s=>o(l).triggerLimitReached("Unlock unlimited AI proposals, Gemini 1.5 Pro, and domain RAG memory.")),class:"hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-brand-600 hover:from-amber-400 hover:to-brand-500 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"},[n(o($),{class:"h-3.5 w-3.5 text-amber-200"}),t[19]||(t[19]=e("span",null,"Upgrade Pro",-1))])),e("button",dt,[n(o(W),{class:"h-4 w-4"}),t[20]||(t[20]=e("span",{class:"absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-600 ring-2 ring-white"},null,-1))]),t[22]||(t[22]=e("div",{class:"h-5 w-px bg-slate-200"},null,-1)),e("div",ct,[n(o(ae),{class:"h-4 w-4 text-emerald-600"}),t[21]||(t[21]=e("span",null,"SOC2 Certified",-1))])])]),e("main",pt,[G(f.$slots,"default")])]),n(Ce,{show:o(l).isSubscriptionModalOpen,limit:o(l).freeLimit,"current-count":o(l).proposalsCount,"error-message":o(l).subscriptionError,onClose:o(l).closeSubscriptionModal,onUpgrade:o(l).upgradeToPro},null,8,["show","limit","current-count","error-message","onClose","onUpgrade"])]))}};export{Z as A,U as C,X as F,J as L,C as S,re as U,I as X,le as Z,ht as _,$ as a,ee as b,i as c,Y as d};
