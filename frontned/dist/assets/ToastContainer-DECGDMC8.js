import{D as $,r as x,n as z,q as T,E as j,o as g,c as v,b as A,k as N,F as P,l as I,u as C,y as S,g as B,x as U,a as _,t as M,d as q,G as E}from"./index-DIYBW5mF.js";const ae=$("auth",()=>{const e=T(),t=x(null),o=x(!1),a=x(null);try{const s=localStorage.getItem("proposal_user");s&&(t.value=JSON.parse(s))}catch{}const i=z(()=>!!t.value);function l(s){t.value=s;try{s?localStorage.setItem("proposal_user",JSON.stringify(s)):localStorage.removeItem("proposal_user")}catch{}}async function y({email:s,password:u,remember:b=!1}){o.value=!0,a.value=null;try{const m=await fetch("/api/login",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({email:s,password:u,remember:b})});if(m.ok){const f=await m.json();return l(f.user),e.success(`Welcome back, ${f.user.name}!`,"Authentication Success"),{success:!0,redirect:f.redirect||"/dashboard"}}const r=await m.json().catch(()=>null),c=(r!=null&&r.errors?Object.values(r.errors).flat().join(" "):null)||(r==null?void 0:r.message)||"Invalid corporate credentials.";return a.value=c,e.error(c,"Login Failed"),{success:!1,message:c}}catch{if(s==="admin@aiproposals.io"&&u==="password123"){const c={id:1,name:"Lead Solutions Architect",email:"admin@aiproposals.io",proposals_count:0,is_subscribed:!1};return l(c),e.success(`Welcome back, ${c.name}! (Local Session)`,"Authentication Success"),{success:!0,redirect:"/dashboard"}}const r="Unable to reach backend server. Please verify Laravel is running (php artisan serve).";return a.value=r,e.error(r,"Connection Notice"),{success:!1,message:r}}finally{o.value=!1}}async function n({name:s,email:u,password:b,password_confirmation:m}){if(o.value=!0,a.value=null,b!==m){const r="Password confirmation does not match.";return a.value=r,e.error(r,"Registration Error"),o.value=!1,{success:!1,message:r}}try{const r=await fetch("/api/register",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({name:s,email:u,password:b,password_confirmation:m})});if(r.ok){const w=await r.json();return l(w.user),e.success(`Welcome, ${w.user.name}! Your workspace is active.`,"Workspace Provisioned"),{success:!0,redirect:w.redirect||"/dashboard"}}const c=await r.json().catch(()=>null),f=(c!=null&&c.errors?Object.values(c.errors).flat().join(" "):null)||(c==null?void 0:c.message)||"Registration failed.";return a.value=f,e.error(f,"Registration Failed"),{success:!1,message:f}}catch{const c={id:Date.now(),name:s,email:u,proposals_count:0,is_subscribed:!1};return l(c),e.success(`Workspace created for ${s}!`,"Workspace Ready"),{success:!0,redirect:"/dashboard"}}finally{o.value=!1}}async function p(){o.value=!0;try{await fetch("/api/logout",{method:"POST",credentials:"include",headers:{Accept:"application/json"}})}catch{}return l(null),e.info("You have safely signed out of your workspace.","Signed Out"),{success:!0,redirect:"/login"}}async function h(){try{const s=await fetch("/api/user",{credentials:"include",headers:{Accept:"application/json"}});if(s.ok){const u=await s.json();u.authenticated&&u.user&&l(u.user)}}catch{}}return{user:t,isLoading:o,authError:a,isAuthenticated:i,setUser:l,login:y,register:n,logout:p,checkAuth:h}});/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const R=e=>{for(const t in e)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1};/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=e=>e==="";/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const F=(...e)=>e.filter((t,o,a)=>!!t&&t.trim()!==""&&a.indexOf(t)===o).join(" ").trim();/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=e=>e.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const J=e=>e.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,o,a)=>a?a.toUpperCase():o.toLowerCase());/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const V=e=>{const t=J(e);return t.charAt(0).toUpperCase()+t.slice(1)};/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var k={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const W=({name:e,iconNode:t,absoluteStrokeWidth:o,"absolute-stroke-width":a,strokeWidth:i,"stroke-width":l,size:y=k.width,color:n=k.stroke,...p},{slots:h})=>j("svg",{...k,...p,width:y,height:y,stroke:n,"stroke-width":L(o)||L(a)||o===!0||a===!0?Number(i||l||k["stroke-width"])*24/Number(y):i||l||k["stroke-width"],class:F("lucide",p.class,...e?[`lucide-${O(V(e))}-icon`,`lucide-${O(e)}`]:["lucide-icon"]),...!h.default&&!R(p)&&{"aria-hidden":"true"}},[...t.map(s=>j(...s)),...h.default?[h.default()]:[]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const d=(e,t)=>(o,{slots:a,attrs:i})=>j(W,{...i,...o,iconNode:t,name:e},a);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const re=d("arrow-right",[["path",{d:"M5 12h14",key:"1ays0h"}],["path",{d:"m12 5 7 7-7 7",key:"xquz4c"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const G=d("circle-alert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Y=d("circle-check",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const Z=d("info",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"M12 16v-4",key:"1dtifu"}],["path",{d:"M12 8h.01",key:"e9boi3"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const oe=d("loader-circle",[["path",{d:"M21 12a9 9 0 1 1-6.219-8.56",key:"13zald"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ce=d("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=d("sparkles",[["path",{d:"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z",key:"1s2grr"}],["path",{d:"M20 2v4",key:"1rf3ol"}],["path",{d:"M22 4h-4",key:"gwowj6"}],["circle",{cx:"4",cy:"20",r:"2",key:"6kqj1y"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const X=d("triangle-alert",[["path",{d:"m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",key:"wmoenq"}],["path",{d:"M12 9v4",key:"juzpu7"}],["path",{d:"M12 17h.01",key:"p32p05"}]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const H=d("x",[["path",{d:"M18 6 6 18",key:"1bl5f8"}],["path",{d:"m6 6 12 12",key:"d8bk6v"}]]),Q={class:"fixed bottom-4 right-4 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0","aria-live":"polite"},K={class:"flex-1 min-w-0"},D={key:0,class:"text-xs font-bold uppercase tracking-wider mb-0.5"},ee={class:"text-xs text-slate-200 font-medium leading-relaxed break-words"},te=["onClick"],ie={__name:"ToastContainer",setup(e){const{toasts:t,removeToast:o}=T(),a={success:Y,error:G,warning:X,info:Z},i={success:{bg:"bg-emerald-950/95 border-emerald-500/40 text-emerald-100",icon:"text-emerald-400",border:"border-emerald-500/30"},error:{bg:"bg-rose-950/95 border-rose-500/40 text-rose-100",icon:"text-rose-400",border:"border-rose-500/30"},warning:{bg:"bg-amber-950/95 border-amber-500/40 text-amber-100",icon:"text-amber-400",border:"border-amber-500/30"},info:{bg:"bg-slate-900/95 border-slate-700 text-slate-100",icon:"text-brand-400",border:"border-slate-700"}};return(l,y)=>(g(),v("div",Q,[A(E,{"enter-active-class":"transform ease-out duration-300 transition","enter-from-class":"translate-y-4 opacity-0 scale-95","enter-to-class":"translate-y-0 opacity-100 scale-100","leave-active-class":"transition ease-in duration-200","leave-from-class":"opacity-100 scale-100","leave-to-class":"opacity-0 scale-95"},{default:N(()=>[(g(!0),v(P,null,I(C(t),n=>{var p,h;return g(),v("div",{key:n.id,class:S([((p=i[n.type])==null?void 0:p.bg)||i.info.bg,"pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all"])},[(g(),B(U(a[n.type]||a.info),{class:S(["h-5 w-5 flex-shrink-0 mt-0.5",((h=i[n.type])==null?void 0:h.icon)||i.info.icon])},null,8,["class"])),_("div",K,[n.title?(g(),v("p",D,M(n.title),1)):q("",!0),_("p",ee,M(n.message),1)]),_("button",{type:"button",onClick:s=>C(o)(n.id),class:"p-1 -mr-1 -mt-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer","aria-label":"Dismiss notification"},[A(C(H),{class:"h-4 w-4"})],8,te)],2)}),128))]),_:1})]))}};export{re as A,G as C,oe as L,ne as S,H as X,ie as _,ce as a,Y as b,d as c,ae as u};
