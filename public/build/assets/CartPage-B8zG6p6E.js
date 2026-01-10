import{j as e,a as g,r as m,b as C,H as N}from"./app-StHp4lGL.js";import{N as w}from"./NavBar-BZTDjxhM.js";import{C as S}from"./Container-BH8gv93r.js";import{n as F}from"./index-BMNUxnAA.js";const z=({id:p,title:r,brand:i,description:s,image:n,onRemove:l,color:d,size:o,quantity:u})=>{const c=()=>{g.get(route("items.show",p))};return e.jsxs("article",{className:"card product-card h-100 p-1",style:{cursor:"pointer"},children:[n&&e.jsx("img",{src:n,alt:r,loading:"lazy",onClick:c,style:{borderRadius:"7px",width:"100%",height:"200px",objectFit:"cover"}}),e.jsxs("div",{className:"card-body",children:[e.jsxs("div",{onClick:c,children:[e.jsx("h3",{className:"card-title",children:r}),e.jsx("h6",{className:"card-title",children:i}),e.jsx("p",{className:"card-desc",children:s}),d&&e.jsxs("p",{className:"d-flex align-items-center mb-1",children:[e.jsx("span",{style:{display:"inline-block",width:16,height:16,borderRadius:"50%",backgroundColor:d.color,marginRight:8,border:"1px solid #ccc"}}),e.jsx("span",{children:F(d).basic[0].name})]}),o&&e.jsxs("p",{className:"mb-1",children:["Size: ",e.jsx("strong",{children:o.size})]}),u!==void 0&&e.jsxs("p",{className:"mb-2",children:["Quantity: ",e.jsx("span",{className:"badge bg-primary",children:u})]})]}),e.jsx("button",{className:"btn btn-danger w-100",onClick:t=>{t.stopPropagation(),l()},children:"Remove"})]})]})},D=({total:p,user:r,onClose:i,osraTime:s})=>{const[n,l]=m.useState(""),[d,o]=m.useState(""),[u,c]=m.useState(""),[t,h]=m.useState(""),[j,f]=m.useState(""),[y,b]=m.useState(!1),[x,v]=m.useState("osraTime"),_=new Date().toISOString().split("T")[0],k=a=>{a.preventDefault(),b(!0),g.post(route("requests.createFromCart"),{full_name:r?.full_name||"",osra_code:null,start_date:d,end_date:t,start_time:u,end_time:j,total_price:p},{onSuccess:()=>{i(),l(""),o(""),h(""),c(""),f("")},onFinish:()=>b(!1)})},T=a=>{a.preventDefault(),b(!0),g.post(route("requests.createFromCart"),{full_name:r?.full_name||"",osra_code:n.trim(),osra_time:s,total_price:n.trim()?0:p},{onSuccess:()=>{i(),l(""),o(""),h(""),c(""),f("")},onFinish:()=>b(!1)})};return e.jsx("div",{className:"modal-overlay",children:e.jsxs("div",{className:"modal-content add-modal",children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{children:"Booking Details"}),e.jsx("button",{className:"close-btn fs-2",onClick:i,children:"×"})]}),e.jsxs("div",{className:"modal-body",children:[e.jsxs("div",{className:"option-group",children:[e.jsx("input",{type:"radio",id:"osra_Time",name:"timeOption",value:"osraTime",checked:x==="osraTime",onChange:()=>v("osraTime")}),e.jsx("label",{htmlFor:"osra_Time",children:"Family Time"}),e.jsx("input",{type:"radio",id:"Custom_time",name:"timeOption",value:"customTime",checked:x==="customTime",onChange:()=>v("customTime")}),e.jsx("label",{htmlFor:"Custom_time",children:"Custom Time"})]}),x==="osraTime"&&e.jsxs(e.Fragment,{children:[e.jsx("label",{htmlFor:"osra_time",children:"Family Time"}),e.jsx("input",{type:"text",id:"osra_time",value:s,readOnly:!0}),e.jsx("label",{htmlFor:"osra_code_one",children:"Family Code"})," ",e.jsx("input",{type:"text",value:n,id:"osra_code_one",onChange:a=>l(a.target.value),placeholder:"Enter Osra Code"})]}),x==="customTime"&&e.jsxs(e.Fragment,{children:[e.jsx("label",{htmlFor:"start_date",children:"Start Date"}),e.jsx("input",{id:"start_date",type:"date",min:_,value:d,onChange:a=>o(a.target.value)}),e.jsx("label",{htmlFor:"start_time",children:"Start Time"}),e.jsx("input",{id:"start_time",type:"time",value:u,onChange:a=>c(a.target.value)}),e.jsx("label",{htmlFor:"end_date",children:"End Date"}),e.jsx("input",{type:"date",id:"end_date",min:_,value:t,onChange:a=>h(a.target.value)}),e.jsx("label",{htmlFor:"end_time",children:"End Time"}),e.jsx("input",{id:"end_time",type:"time",value:j,onChange:a=>f(a.target.value)})]}),e.jsxs("p",{className:"mt-2",children:["Total Amount: EGP ",p]})]}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{disabled:y,className:"btn btn-success",onClick:x==="osraTime"?T:k,children:y?"Booking...":"Confirm Booking"}),e.jsx("button",{className:"btn btn-outline-secondary",onClick:i,children:"Cancel"})]}),e.jsx("style",{children:`
                  .modal-overlay {
                    position: fixed;
                    top: 0; left: 0;
                    width: 100%; height: 100%;
                    background: rgba(0,0,0,0.4);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 999;
                    padding: 20px; /* add padding so content isn't flush to edges */
                    box-sizing: border-box;
                  }
                  .add-modal {
                    width: 420px;
                    max-height: 90vh; /* limit height to viewport */
                    background: #e6f4ea;
                    border-radius: 14px;
                    box-shadow: 0 20px 40px rgba(46,204,113,0.2);
                    animation: scaleIn 0.2s ease;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden; /* contain scroll inside body */
                  }
                  .add-modal .modal-header {
                    background: linear-gradient(135deg, #2ecc71, #27ae60);
                    color: white;
                    padding: 16px 20px;
                    border-radius: 14px 14px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-shrink: 0;
                  }
                  .modal-body {
                    padding: 20px;
                    overflow-y: auto; /* scrollable body */
                    flex: 1; /* take remaining space */
                  }
                  .modal-body label {
                    font-weight: 600;
                    margin-top: 12px;
                    display: block;
                  }
                  .modal-body input {
                    width: 100%;
                    margin-top: 6px;
                    padding: 10px 12px;
                    border-radius: 8px;
                    border: 1px solid #ced4da;
                  }
                  .modal-body input:focus {
                    outline: none;
                    border-color: #27ae60;
                  }
                  .modal-footer {
                    padding: 16px 20px;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    border-top: 1px solid #dee2e6;
                    flex-shrink: 0;
                    background: #f8f9fa;
                  }
                  @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                  }
                  .option-group {
                    display: flex;
                    gap: 12px;
                    margin-top: 16px;
                  }
                  .option-group input[type="radio"] {
                    display: none;
                  }
                  .option-group label {
                    flex: 1;
                    text-align: center;
                    padding: 10px 14px;
                    border-radius: 8px;
                    border: 2px solid #27ae60;
                    background: #fff;
                    color: #27ae60;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                  }
                  .option-group input[type="radio"]:checked + label {
                    background: #27ae60;
                    color: #fff;
                    box-shadow: 0 4px 10px rgba(39,174,96,0.3);
                  }
                  .option-group label:hover {
                    background: #e6f4ea;
                  }
        `})]})})},B=()=>{const{cart:p,user:r,osra_time:i}=C().props,s=p?.products??[],{errors:n}=C().props,l=s.reduce((t,h)=>t+Number(h.pr_price),0),[d,o]=m.useState(!1),u=t=>{g.delete(route("cart.remove"),{data:{product_id:t},preserveScroll:!0})},c=t=>{g.post(route("requests.createFromCart"),t,{preserveScroll:!0,onSuccess:()=>o(!1)})};return console.log(s),e.jsxs(e.Fragment,{children:[e.jsx(N,{title:"مركز وسائل الإيضاح"}),e.jsx(w,{page_name:"cart"}),e.jsxs(S,{children:[e.jsx("h2",{style:{marginTop:24},children:"Your Cart"}),s.length===0&&e.jsx("p",{children:"Your cart is empty."}),e.jsx("div",{className:"row",children:s.map(t=>{const h=t.images&&t.images.length>0?`/markaz_alkarouz/public/storage/${t.images[0].photo}`:"/markaz_alkarouz/public/imgs/shopping.webp";return e.jsx("div",{className:"col-6 col-md-4 col-lg-3 mb-4",children:e.jsx(z,{id:t.product_id,title:t.pr_name,brand:t.brand,color:t.pivot.color,size:t.pivot.size,quantity:t.pivot.quantity,description:`Price: EGP ${t.pr_price}`,image:h,onRemove:()=>u(t.product_id)})},t.product_id)})}),s.length>0&&e.jsxs("div",{style:{textAlign:"right",marginTop:24},children:[e.jsxs("h4",{children:["Total: EGP ",l]}),e.jsx("button",{className:"btn btn-success",onClick:()=>o(!0),children:"Checkout"})]}),d&&r&&e.jsx(D,{errors:n,total:l,user:r,onClose:()=>o(!1),onConfirm:c,osraTime:i})]})]})};export{B as default};
