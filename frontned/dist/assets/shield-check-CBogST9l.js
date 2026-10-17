import{L as A,g as w,h as C,s as S,B as _,M as b}from"./index-Cmuot3si.js";const M=A("auth",()=>{const s=_(),t=w(null),c=w(!1),o=w(null);try{const e=localStorage.getItem("proposal_user");e&&(t.value=JSON.parse(e))}catch{}const p=C(()=>!!t.value);function i(e){t.value=e;try{if(e){localStorage.setItem("proposal_user",JSON.stringify(e));const n=e.ref_role||e.role;if(e.is_subscribed||e.subscription_tier==="pro"||n==="admin"){const l=S();l.isSubscribed=!0,l.activeAiModel="Gemini 1.5 Pro"}}else localStorage.removeItem("proposal_user")}catch{}}async function h({email:e,password:n,remember:l=!1}){c.value=!0,o.value=null;try{const u=await fetch("/api/login",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({email:e,password:n,remember:l})});if(u.ok){const d=await u.json();return i(d.user),s.success(`Welcome back, ${d.user.name}!`,"Authentication Success"),{success:!0,redirect:d.redirect||"/dashboard"}}const r=await u.json().catch(()=>null),a=(r!=null&&r.errors?Object.values(r.errors).flat().join(" "):null)||(r==null?void 0:r.message)||"Invalid corporate credentials.";return o.value=a,s.error(a,"Login Failed"),{success:!1,message:a}}catch{if(e==="admin@aiproposals.io"&&n==="password123"){const a={id:1,name:"System Administrator",email:"admin@aiproposals.io",ref_role:"admin",role:"admin",proposals_count:0,is_subscribed:!0,subscription_tier:"pro"};return i(a),s.success(`Welcome back, ${a.name}! (Local Session)`,"Authentication Success"),{success:!0,redirect:"/dashboard"}}const r="Unable to reach backend server. Please verify Laravel is running (php artisan serve).";return o.value=r,s.error(r,"Connection Notice"),{success:!1,message:r}}finally{c.value=!1}}async function v({name:e,email:n,password:l,password_confirmation:u}){if(c.value=!0,o.value=null,l!==u){const r="Password confirmation does not match.";return o.value=r,s.error(r,"Registration Error"),c.value=!1,{success:!1,message:r}}try{const r=await fetch("/api/register",{method:"POST",credentials:"include",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({name:e,email:n,password:l,password_confirmation:u})});if(r.ok){const y=await r.json();return i(y.user),s.success(`Welcome, ${y.user.name}! Your workspace is active.`,"Workspace Provisioned"),{success:!0,redirect:y.redirect||"/dashboard"}}const a=await r.json().catch(()=>null),d=(a!=null&&a.errors?Object.values(a.errors).flat().join(" "):null)||(a==null?void 0:a.message)||"Registration failed.";return o.value=d,s.error(d,"Registration Failed"),{success:!1,message:d}}catch{const a={id:Date.now(),name:e,email:n,ref_role:"user",role:"user",proposals_count:0,is_subscribed:!1,subscription_tier:"free"};return i(a),s.success(`Workspace created for ${e}!`,"Workspace Ready"),{success:!0,redirect:"/dashboard"}}finally{c.value=!1}}function f(){c.value=!1,i(null);try{localStorage.removeItem("proposal_user");const e=S();e.isSubscribed=!1}catch{}try{fetch("/api/logout",{method:"POST",credentials:"include",headers:{Accept:"application/json"}}).catch(()=>{}),fetch("/logout",{method:"POST",credentials:"include",headers:{Accept:"application/json"}}).catch(()=>{})}catch{}return s.info("You have safely signed out of your workspace.","Signed Out"),{success:!0,redirect:"/login"}}async function m(){try{const e=await fetch("/api/user",{credentials:"include",headers:{Accept:"application/json"}});if(e.ok){const n=await e.json();n.authenticated&&n.user&&i(n.user)}}catch{}}return{user:t,isLoading:c,authError:o,isAuthenticated:p,setUser:i,login:h,register:v,logout:f,checkAuth:m}});/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=s=>{for(const t in s)if(t.startsWith("aria-")||t==="role"||t==="title")return!0;return!1};/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=s=>s==="";/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const P=(...s)=>s.filter((t,c,o)=>!!t&&t.trim()!==""&&o.indexOf(t)===c).join(" ").trim();/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=s=>s.replace(/([a-z0-9])([A-Z])/g,"$1-$2").toLowerCase();/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=s=>s.replace(/^([A-Z])|[\s-_]+(\w)/g,(t,c,o)=>o?o.toUpperCase():c.toLowerCase());/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const $=s=>{const t=L(s);return t.charAt(0).toUpperCase()+t.slice(1)};/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */var g={xmlns:"http://www.w3.org/2000/svg",width:24,height:24,viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":2,"stroke-linecap":"round","stroke-linejoin":"round"};/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=({name:s,iconNode:t,absoluteStrokeWidth:c,"absolute-stroke-width":o,strokeWidth:p,"stroke-width":i,size:h=g.width,color:v=g.stroke,...f},{slots:m})=>b("svg",{...g,...f,width:h,height:h,stroke:v,"stroke-width":k(c)||k(o)||c===!0||o===!0?Number(p||i||g["stroke-width"])*24/Number(h):p||i||g["stroke-width"],class:P("lucide",f.class,...s?[`lucide-${j($(s))}-icon`,`lucide-${j(s)}`]:["lucide-icon"]),...!m.default&&!O(f)&&{"aria-hidden":"true"}},[...t.map(e=>b(...e)),...m.default?[m.default()]:[]]);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const T=(s,t)=>(c,{slots:o,attrs:p})=>b(I,{...p,...c,iconNode:t,name:s},o);/**
 * @license lucide-vue-next v1.0.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const N=T("shield-check",[["path",{d:"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",key:"oel41y"}],["path",{d:"m9 12 2 2 4-4",key:"dzmm74"}]]);export{N as S,T as c,M as u};
