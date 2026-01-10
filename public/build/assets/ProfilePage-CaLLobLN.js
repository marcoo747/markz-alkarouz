import{b as C,r as t,j as e,H as k,a as w}from"./app-StHp4lGL.js";import{N as S}from"./NavBar-BZTDjxhM.js";import{C as E}from"./Container-BH8gv93r.js";const M=()=>{const{user:r,requests:u=[]}=C().props,[N,c]=t.useState(!1),[o,m]=t.useState({name:r.name,phone:r.phone,email:r.email,profilePhoto:null,osra_code:""}),[b,v]=t.useState(""),[n,f]=t.useState({}),[y,p]=t.useState(!1),[d,j]=t.useState({currentPassword:"",newPassword:"",confirmPassword:""}),[l,g]=t.useState({}),h=a=>{a.target.name==="profilePhoto"?m({...o,profilePhoto:a.target.files[0]}):m({...o,[a.target.name]:a.target.value})},_=a=>{a.preventDefault();const s=new FormData;s.append("full_name",o.name),s.append("email",o.email),s.append("mobile",o.phone),o.profilePhoto&&s.append("user_photo",o.profilePhoto),o.osra_code&&s.append("osra_code",o.osra_code),w.post(route("profile.update"),s,{forceFormData:!0,onSuccess:()=>{f({}),c(!1)},onError:i=>{f(i)}})},x=a=>{j({...d,[a.target.name]:a.target.value})},P=a=>{a.preventDefault();const s=new FormData;s.append("current_password",d.currentPassword),s.append("new_password",d.newPassword),s.append("new_password_confirmation",d.confirmPassword),w.post(route("password.change"),s,{forceFormData:!0,onSuccess:()=>{j({currentPassword:"",newPassword:"",confirmPassword:""}),g({}),p(!1)},onError:i=>{g(i)}})};return e.jsxs(e.Fragment,{children:[e.jsx(k,{title:"مركز وسائل الإيضاح"}),e.jsx(S,{page_name:"profile"}),e.jsx(E,{children:e.jsxs("div",{className:"row mt-4 g-4",children:[e.jsx("div",{className:"col-12 col-md-4",children:e.jsxs("div",{className:"card shadow-sm text-center p-4",children:[e.jsx("img",{src:r.profilePhoto,className:"rounded-circle mx-auto",style:{width:120,height:120,objectFit:"cover"},alt:"Profile"}),e.jsx("h5",{className:"mb-1",children:r.name}),e.jsx("p",{className:"text-muted mb-0",children:r.email}),e.jsx("p",{className:"text-muted mt-0",children:r.phone}),e.jsx("div",{className:"profile-osra mt-3 p-3 border rounded bg-light text-start mb-4",children:r.osra?e.jsxs(e.Fragment,{children:[e.jsx("h6",{className:"mb-2",children:"🧑‍👩‍👧 Family Details"}),e.jsxs("div",{className:"d-flex flex-column gap-1",children:[e.jsxs("span",{children:[e.jsx("strong",{children:"Name:"})," ",r.osra.osra_name]}),e.jsxs("span",{children:[e.jsx("strong",{children:"Place:"})," ",r.osra.osra_place]}),e.jsxs("span",{children:[e.jsx("strong",{children:"Time:"})," ",r.osra.osra_time]}),e.jsxs("span",{children:[e.jsx("strong",{children:"Code:"})," ",e.jsx("span",{className:"badge bg-primary",children:r.osra.osra_code})]})]})]}):e.jsx("p",{className:"text-muted mb-0",children:"No Family assigned"})}),e.jsx("button",{className:"btn btn-outline-primary w-100 mb-2",onClick:()=>c(!0),children:"Edit Profile"}),e.jsx("button",{className:"btn btn-primary w-100",onClick:()=>p(!0),children:"Change Password"})]})}),e.jsxs("div",{className:"col-12 col-md-8",children:[e.jsx("h5",{className:"mb-3",children:"Latest Requests"}),u.length===0&&e.jsx("div",{className:"alert alert-info",children:"No requests yet."}),u.map((a,s)=>e.jsx("div",{className:"card shadow-sm mb-3",children:e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{className:"d-flex justify-content-between align-items-center mb-2",children:[e.jsxs("strong",{children:["Request #",++s]}),e.jsx("span",{className:`badge ${a.request_status==="accepted"?"bg-success":a.request_status==="pending"?"bg-warning text-dark":a.request_status==="done"?"bg-danger":"bg-secondary"}`,children:a.request_status})]}),e.jsx("div",{className:"mb-2",children:e.jsx("span",{className:"badge bg-primary",children:a.osra_name??a.osra_code})}),e.jsxs("div",{className:"mb-2 text-muted small",children:[a.start_date&&a.start_time?e.jsxs(e.Fragment,{children:[e.jsx("strong",{children:"Start:"})," ",new Date(a.start_date+"T"+a.start_time).toLocaleString("en-US",{weekday:"short",year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})]}):a.osra_time&&e.jsxs(e.Fragment,{children:[e.jsx("strong",{children:"Time:"})," ",a.osra_time]}),e.jsx("br",{}),a.end_date&&a.end_time&&e.jsxs(e.Fragment,{children:[e.jsx("strong",{children:"End:"})," ",new Date(a.end_date+"T"+a.end_time).toLocaleString("en-US",{weekday:"short",year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})]})]}),e.jsxs("div",{className:"text-muted small",children:[e.jsx("strong",{children:"Ordered at:"})," ",new Date(a.created_at).toLocaleString("en-US",{year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})]})]})},a.request_id))]})]})}),N&&e.jsx("div",{className:"modal-overlay",children:e.jsx("div",{className:"modal-dialog-centered",children:e.jsx("div",{className:"modal-content edit-modal",children:e.jsxs("form",{onSubmit:_,children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:"Edit Profile"}),e.jsx("button",{type:"button",className:"close-btn fs-2",onClick:()=>c(!1),children:"×"})]}),e.jsxs("div",{className:"modal-body",children:[e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{className:"form-label",children:"Full Name"}),e.jsx("input",{type:"text",name:"name",value:o.name,onChange:h,className:`form-control ${n.name?"is-invalid":""}`}),n.name&&e.jsx("div",{className:"invalid-feedback",children:n.name})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{className:"form-label",children:"Email"}),e.jsx("input",{type:"email",name:"email",value:o.email,onChange:h,className:`form-control ${n.email?"is-invalid":""}`}),n.email&&e.jsx("div",{className:"invalid-feedback",children:n.email})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{className:"form-label",children:"Mobile"}),e.jsx("input",{type:"tel",name:"phone",value:o.phone,onChange:a=>{const s=a.target.value.replace(/[^0-9]/g,"");m({...o,phone:s})},className:`form-control ${n.phone?"is-invalid":""}`,placeholder:"01XXXXXXXXX",inputMode:"numeric",maxLength:11}),n.phone&&e.jsx("div",{className:"invalid-feedback",children:n.phone})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{className:"form-label",children:"Family Code"}),e.jsx("input",{type:"text",name:"osra_code",value:o.osra_code,onChange:h,className:`form-control ${n.osra_code?"is-invalid":""}`,placeholder:"Enter family code"}),n.osra_code&&e.jsx("div",{className:"invalid-feedback",children:n.osra_code})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{className:"form-label",children:"Profile Photo"}),e.jsxs("div",{className:"file-upload",children:[e.jsxs("label",{className:"upload-btn mt-0",children:["Upload Photo",e.jsx("input",{type:"file",name:"profilePhoto",hidden:!0,onChange:a=>{const s=a.target.files[0];s&&(m(i=>({...i,profilePhoto:s})),v(s.name))}})]}),b&&e.jsx("span",{className:"file-name",children:b})]}),n.profilePhoto&&e.jsx("div",{className:"invalid-feedback d-block",children:n.profilePhoto})]})]}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{type:"submit",className:"btn btn-primary",children:"Save Changes"}),e.jsx("button",{type:"button",className:"btn btn-outline-secondary",onClick:()=>c(!1),children:"Cancel"})]})]})})})}),y&&e.jsx("div",{className:"modal-overlay",children:e.jsx("div",{className:"modal-dialog-centered",children:e.jsx("div",{className:"modal-content edit-modal",children:e.jsxs("form",{onSubmit:P,children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{className:"modal-title",children:"Change Password"}),e.jsx("button",{type:"button",className:"close-btn fs-2",onClick:()=>p(!1),children:"×"})]}),e.jsxs("div",{className:"modal-body",children:[e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{className:"form-label",children:"Current Password"}),e.jsx("input",{type:"password",name:"currentPassword",value:d.currentPassword,onChange:x,className:`form-control ${l.current_password?"is-invalid":""}`}),l.current_password&&e.jsx("div",{className:"invalid-feedback",children:l.current_password})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{className:"form-label",children:"New Password"}),e.jsx("input",{type:"password",name:"newPassword",value:d.newPassword,onChange:x,className:`form-control ${l.new_password?"is-invalid":""}`}),l.new_password&&e.jsx("div",{className:"invalid-feedback",children:l.new_password})]}),e.jsxs("div",{className:"mb-3",children:[e.jsx("label",{className:"form-label",children:"Confirm New Password"}),e.jsx("input",{type:"password",name:"confirmPassword",value:d.confirmPassword,onChange:x,className:`form-control ${l.new_password_confirmation?"is-invalid":""}`}),l.new_password_confirmation&&e.jsx("div",{className:"invalid-feedback",children:l.new_password_confirmation})]})]}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{type:"submit",className:"btn btn-primary",children:"Save Changes"}),e.jsx("button",{type:"button",className:"btn btn-outline-secondary",onClick:()=>p(!1),children:"Cancel"})]})]})})})}),e.jsx("style",{children:`
        /* ===== Modal Overlay (page background) ===== */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6); /* page background when modal is open */
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1050;
        }

        /* ===== Centering Wrapper ===== */
        .modal-dialog-centered {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        /* ===== Modal Box ===== */
        .edit-modal {
          padding: 20px;
          width: 420px;
          background: #f0f5ff;
          border-radius: 14px;
          box-shadow: 0 20px 40px rgba(13, 110, 253, 0.2);
          animation: scaleIn 0.2s ease;
        }

        /* ===== Header ===== */
        .edit-modal .modal-header {
          background: linear-gradient(135deg, #0d6efd, #0b5ed7);
          color: white;
          padding: 16px 20px;
          border-radius: 14px 14px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        /* ===== Close Button ===== */
        .close-btn {
          background: transparent;
          border: none;
          color: white;
          font-size: 22px;
          cursor: pointer;
        }

        /* ===== Body ===== */
        .modal-body {
          padding: 20px;
        }

        .modal-body label {
          font-weight: 600;
          margin-top: 12px;
          display: block;
        }

        .modal-body input,
        .modal-body textarea {
          width: 100%;
          margin-top: 6px;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid #ced4da;
        }

        .modal-body input:focus,
        .modal-body textarea:focus {
          outline: none;
          border-color: #0d6efd;
        }

        /* ===== File Upload ===== */
        .file-upload {
          margin-top: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .upload-btn {
          background-color: #0d6efd;
          color: white;
          padding: 8px 14px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
        }

        .file-name {
          font-size: 0.9rem;
          color: #495057;
        }

        /* ===== Footer ===== */
        .modal-footer {
          padding: 16px 20px;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          border-top: 1px solid #dee2e6;
        }

        /* ===== Animation ===== */
        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `})]})};export{M as default};
