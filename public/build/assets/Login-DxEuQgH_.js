import{r as d,u as y,j as o,H as k,L as N,a as z}from"./app-BSKpD5J0.js";import{M as L}from"./Message-Dqj4R1sh.js";import{l as b}from"./AlkaroozCom-C7DtjMCo.js";import{s as _}from"./shopping-mYIxQXoI.js";import{u as C}from"./useTranslation-D8iQ9jv2.js";const S="/markaz_alkarouz/public/assets/img1-CW6i2ERM.jpg";function I({carouselPhotos:g=[]}){const{t,i18n:c}=C(),i=c.language.startsWith("ar"),p=()=>{c.changeLanguage(i?"en":"ar")},[x,f]=d.useState(!1),[m,h]=d.useState(0),{data:s,setData:u,post:w,processing:l,errors:r}=y({mobile:"",password:""}),a=g.length>0?g:[_,S];d.useEffect(()=>{if(a.length<=1)return;const e=setInterval(()=>{h(n=>(n+1)%a.length)},4e3);return()=>clearInterval(e)},[a.length]);const j=()=>f(e=>!e),v=e=>{if(e.preventDefault(),!s.mobile||s.mobile.replace(/\D/g,"").length!==11){alert(t("auth.mobile_11_digits"));return}if(!s.password){alert(t("auth.password_required"));return}w(route("login.store"),{onSuccess:()=>z.visit(route("home")),onError:n=>console.log(n)})};return o.jsxs(o.Fragment,{children:[o.jsx(k,{title:t("home.page_title")}),o.jsx("style",{children:`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', system-ui, sans-serif;
        }

        /* ════════════════════════════
           LEFT — carousel background
        ════════════════════════════ */
        .login-left {
          display: none;
          flex: 1;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 1024px) { .login-left { display: block; } }

        /* Slide images */
        .login-slide {
          position: absolute; inset: 0;
          background-size: cover;
          background-position: center;
          transition: opacity 1s ease-in-out;
          opacity: 0;
        }
        .login-slide.active { opacity: 1; }

        /* Dark overlay so text is readable */
        .login-slide-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            160deg,
            rgba(10,20,60,0.72) 0%,
            rgba(10,20,60,0.45) 60%,
            rgba(10,20,60,0.65) 100%
          );
        }

        /* Branding content on top of carousel */
        .login-left-content {
          position: absolute; inset: 0;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          z-index: 2;
          padding: 48px;
          text-align: center;
          color: #fff;
        }
        .login-left-logo {
          width: 130px;
          margin-bottom: 28px;
          object-fit: contain;
          filter: drop-shadow(0 2px 12px rgba(0,0,0,0.3));
        }
        .login-left-content h2 {
          font-size: 30px; font-weight: 800;
          line-height: 1.25; letter-spacing: -0.4px;
          margin-bottom: 14px;
          text-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        .login-left-content p {
          font-size: 15px; color: rgba(255,255,255,0.8);
          line-height: 1.75; max-width: 360px;
          text-shadow: 0 1px 4px rgba(0,0,0,0.35);
        }

        /* Slide dots */
        .login-dots {
          position: absolute; bottom: 32px; left: 50%;
          transform: translateX(-50%);
          display: flex; gap: 8px; z-index: 3;
        }
        .login-dot {
          height: 8px; border-radius: 4px;
          background: rgba(255,255,255,0.4);
          transition: width 400ms ease, background 400ms ease;
          width: 8px; cursor: pointer; border: none;
        }
        .login-dot.active { width: 24px; background: #fff; }

        /* ── Language toggle ── */
        .lang-toggle-wrap {
          display: flex;
          justify-content: flex-end;
          margin-bottom: 24px;
        }
        .lang-toggle {
          display: flex;
          align-items: center;
          background: #f1f5f9;
          border: 1px solid #e2e8f0;
          border-radius: 999px;
          padding: 3px;
          gap: 0;
          position: relative;
          cursor: pointer;
          direction: ltr; /* Force LTR so buttons stay in place */
        }
        .lang-toggle-option {
          position: relative; z-index: 2;
          padding: 5px 14px;
          font-size: 12.5px; font-weight: 700;
          border: none; background: none;
          border-radius: 999px;
          cursor: pointer;
          transition: color 250ms;
          font-family: inherit;
          color: #64748b;
        }
        .lang-toggle-option.active { color: #1e40af; }
        .lang-toggle-slider {
          position: absolute;
          top: 3px; bottom: 3px;
          border-radius: 999px;
          background: #ffffff;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
          transition: transform 280ms cubic-bezier(.4,0,.2,1), width 280ms;
          z-index: 1;
          left: 3px;
        }
        .login-right {
          flex: 0 0 100%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 48px 28px;
          background: #ffffff;
          min-height: 100vh;
        }
        @media (min-width: 1024px) { .login-right { flex: 0 0 460px; } }

        .login-card {
          width: 100%; max-width: 380px;
          animation: slideUp 420ms cubic-bezier(.22,.9,.36,1) both;
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Mobile logo */
        .login-logo-mobile {
          display: flex; justify-content: center;
          margin-bottom: 28px;
        }
        .login-logo-mobile img {
          width: 110px; object-fit: contain;
        }
        @media (min-width: 1024px) { .login-logo-mobile { display: none; } }

        /* Heading */
        .login-heading { margin-bottom: 28px; }
        .login-heading h1 {
          font-size: 26px; font-weight: 800;
          color: #0f172a; letter-spacing: -0.4px;
          margin: 0 0 6px;
        }
        .login-heading p { font-size: 13.5px; color: #64748b; margin: 0; }

        /* Field */
        .login-field { margin-bottom: 16px; }
        .login-label {
          display: block; font-size: 13px; font-weight: 600;
          color: #374151; margin-bottom: 6px;
        }
        .login-input-wrap { position: relative; }
        .login-input {
          width: 100%; padding: 13px 16px;
          border: 2px solid #e5e7eb; border-radius: 12px;
          font-size: 14px; color: #0f172a;
          background: #f9fafb;
          transition: border-color 180ms, box-shadow 180ms, background 180ms;
          outline: none; font-family: inherit;
        }
        .login-input::placeholder { color: #9ca3af; }
        .login-input:focus {
          border-color: #2563eb; background: #fff;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.1);
        }
        .login-input.has-error { border-color: #ef4444; background: #fff; }
        .login-input.has-error:focus { box-shadow: 0 0 0 4px rgba(239,68,68,0.1); }

        .login-pw-btn {
          position: absolute; right: 13px; top: 50%;
          transform: translateY(-50%);
          background: none; border: none; cursor: pointer;
          color: #94a3b8; padding: 4px;
          display: flex; align-items: center;
          transition: color 180ms; line-height: 0;
        }
        .login-pw-btn:hover { color: #2563eb; }

        .login-err {
          font-size: 12px; color: #ef4444;
          margin-top: 5px; display: flex; align-items: center; gap: 4px;
        }

        /* Forgot */
        .login-forgot {
          display: flex; justify-content: flex-end;
          margin-top: -8px; margin-bottom: 20px;
        }
        .login-forgot button {
          background: none; border: none; cursor: pointer;
          font-size: 12.5px; font-weight: 600;
          color: #2563eb; padding: 0; font-family: inherit;
          transition: color 180ms;
        }
        .login-forgot button:hover { color: #1d4ed8; text-decoration: underline; }

        /* Submit */
        .login-submit {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg, #1d4ed8, #3b82f6);
          color: #fff; font-size: 15px; font-weight: 700;
          border: none; border-radius: 12px; cursor: pointer;
          box-shadow: 0 4px 14px rgba(37,99,235,0.38);
          transition: transform 150ms, box-shadow 200ms, opacity 200ms;
          font-family: inherit; letter-spacing: 0.2px;
        }
        .login-submit:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 7px 20px rgba(37,99,235,0.48);
        }
        .login-submit:active:not(:disabled) { transform: scale(0.98); }
        .login-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .login-spinner {
          display: inline-block; width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle; margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Divider + signup */
        .login-divider {
          display: flex; align-items: center; gap: 12px;
          margin: 22px 0;
        }
        .login-divider span { flex: 1; height: 1px; background: #e5e7eb; }
        .login-divider p { font-size: 12px; color: #9ca3af; margin: 0; white-space: nowrap; }

        .login-signup {
          text-align: center; font-size: 13.5px; color: #64748b;
        }
        .login-signup a {
          color: #2563eb; font-weight: 700;
          text-decoration: none; margin-left: 4px;
          transition: color 180ms;
        }
        .login-signup a:hover { color: #1d4ed8; text-decoration: underline; }
      `}),o.jsxs("div",{className:"login-root",children:[o.jsxs("div",{className:"login-left",children:[a.map((e,n)=>o.jsx("div",{className:`login-slide${n===m?" active":""}`,style:{backgroundImage:`url('${e}')`}},n)),o.jsx("div",{className:"login-slide-overlay"}),o.jsxs("div",{className:"login-left-content",children:[o.jsx("img",{src:b,alt:"Alkarooz",className:"login-left-logo"}),o.jsxs("h2",{children:["Welcome Back to",o.jsx("br",{}),"Markaz Al-Karouz"]}),o.jsx("p",{children:"Sign in to manage your orders, explore our catalogue, and connect with your family group."})]}),o.jsx("div",{className:"login-dots",children:a.map((e,n)=>o.jsx("button",{className:`login-dot${n===m?" active":""}`,onClick:()=>h(n),"aria-label":`Go to slide ${n+1}`},n))})]}),o.jsx("div",{className:"login-right",dir:i?"rtl":"ltr",children:o.jsxs("div",{className:"login-card",children:[o.jsx("div",{className:"login-logo-mobile",children:o.jsx("img",{src:b,alt:"Alkarooz",style:{width:"110px",objectFit:"contain"}})}),o.jsx("div",{className:"lang-toggle-wrap",children:o.jsxs("div",{className:"lang-toggle",role:"group","aria-label":"Language switcher",children:[o.jsx("div",{className:"lang-toggle-slider",style:i?{transform:"translateX(43px)",width:52}:{transform:"translateX(0)",width:43}}),o.jsx("button",{type:"button",className:`lang-toggle-option${i?"":" active"}`,onClick:()=>i&&p(),"aria-pressed":!i,children:"EN"}),o.jsx("button",{type:"button",className:`lang-toggle-option${i?" active":""}`,onClick:()=>!i&&p(),"aria-pressed":i,children:"عربي"})]})}),o.jsxs("div",{className:"login-heading",children:[o.jsx("h1",{children:i?"تسجيل الدخول":"Sign in"}),o.jsx("p",{children:i?"أدخل رقم هاتفك وكلمة المرور للمتابعة.":"Enter your mobile number and password to continue."})]}),o.jsxs("form",{onSubmit:v,method:"post",children:[o.jsxs("div",{className:"login-field",children:[o.jsx("label",{className:"login-label",htmlFor:"login-mobile",children:t("auth.mobile_placeholder")||"Mobile Number"}),o.jsx("div",{className:"login-input-wrap",children:o.jsx("input",{id:"login-mobile",type:"tel",placeholder:"01XXXXXXXXX",value:s.mobile,onChange:e=>u("mobile",e.target.value),className:`login-input${r.mobile?" has-error":""}`,required:!0})}),r.mobile&&o.jsxs("div",{className:"login-err",children:[o.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:[o.jsx("circle",{cx:"12",cy:"12",r:"10"}),o.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),o.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]}),r.mobile]})]}),o.jsxs("div",{className:"login-field",children:[o.jsx("label",{className:"login-label",htmlFor:"login-password",children:t("auth.password_placeholder")||"Password"}),o.jsxs("div",{className:"login-input-wrap",children:[o.jsx("input",{id:"login-password",type:x?"text":"password",placeholder:"••••••••",value:s.password,onChange:e=>u("password",e.target.value),className:`login-input${r.password?" has-error":""}`,style:{paddingRight:"46px"},required:!0}),o.jsx("button",{type:"button",className:"login-pw-btn",onClick:j,"aria-label":"Toggle password visibility",children:x?o.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:"2",children:o.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"})}):o.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"20",height:"20",fill:"none",viewBox:"0 0 24 24",stroke:"currentColor",strokeWidth:"2",children:[o.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M15 12a3 3 0 11-6 0 3 3 0 016 0z"}),o.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"})]})})]}),r.password&&o.jsxs("div",{className:"login-err",children:[o.jsxs("svg",{width:"13",height:"13",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2.5",children:[o.jsx("circle",{cx:"12",cy:"12",r:"10"}),o.jsx("line",{x1:"12",y1:"8",x2:"12",y2:"12"}),o.jsx("line",{x1:"12",y1:"16",x2:"12.01",y2:"16"})]}),r.password]})]}),o.jsx("div",{className:"login-forgot",children:o.jsx("button",{type:"button",onClick:()=>alert(t("auth.contact_support_reset")),children:t("auth.forgot_password")})}),o.jsxs("button",{id:"login-submit-btn",type:"submit",className:"login-submit",disabled:l,children:[l&&o.jsx("span",{className:"login-spinner"}),l?"Signing in…":t("auth.login_btn")||"Sign In"]}),r.general&&o.jsx(L,{type:"error",className:"mt-4",children:r.general})]}),o.jsxs("div",{className:"login-divider",children:[o.jsx("span",{}),o.jsx("p",{children:"Don't have an account?"}),o.jsx("span",{})]}),o.jsx("div",{className:"login-signup",children:o.jsx(N,{href:route("sign_up"),children:"Create an account →"})})]})})]})]})}export{I as default};
