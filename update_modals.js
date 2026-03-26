const fs = require('fs');
const path = require('path');

const cssDir = './resources/css';
const files = [
  { name: 'AddModal.module.css', color: '#16a34a', rgb: '22, 163, 74' },
  { name: 'EditModal.module.css', color: '#2563eb', rgb: '37, 99, 235' },
  { name: 'DeleteModal.module.css', color: '#dc2626', rgb: '220, 38, 38' },
  { name: 'ImageUploadModal.module.css', color: '#16a34a', rgb: '22, 163, 74' },
  { name: 'OptionModal.module.css', color: '#2563eb', rgb: '37, 99, 235' }
];

files.forEach(file => {
  const filePath = path.join(cssDir, file.name);
  if (!fs.existsSync(filePath)) return;

  const content = `.modalOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 20px;
  box-sizing: border-box;
}

${file.name.includes('Add') ? '.addModal' : file.name.includes('Delete') ? '.redModal' : file.name.includes('Image') ? '.greenModal' : file.name.includes('Option') ? '.optionModal' : '.editModal'} {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(0,0,0,0.05);
}

.modalHeader {
  background: #ffffff;
  padding: 24px 28px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.modalHeader h3 {
  margin: 0;
  font-size: 1.35rem;
  font-weight: 700;
  color: ${file.color};
  letter-spacing: -0.02em;
}

.closeBtn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.closeBtn:hover {
  color: #0f172a;
  background: rgba(0,0,0,0.05);
}

.modalBody {
  padding: 16px 28px 24px;
  overflow-y: auto;
  max-height: 65vh;
  flex: 1;
  color: #475569;
  font-size: 0.95rem;
}

.modalBody label {
  font-weight: 600;
  margin-top: 18px;
  font-size: 0.9rem;
  color: #334155;
  display: block;
}

.modalBody label:first-child {
  margin-top: 0;
}

.modalBody input,
.modalBody textarea,
.modalBody select {
  width: 100%;
  margin-top: 8px;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
  transition: all 0.2s;
  font-size: 0.95rem;
  color: #0f172a;
}

.modalBody input:focus,
.modalBody textarea:focus,
.modalBody select:focus {
  outline: none;
  border-color: ${file.color};
  background-color: #ffffff;
  box-shadow: 0 0 0 4px rgba(${file.rgb}, 0.15);
}

.fileUpload {
  margin-top: 18px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.uploadBtn {
  background-color: rgba(${file.rgb}, 0.1);
  color: ${file.color};
  padding: 10px 18px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  border: 1px solid rgba(${file.rgb}, 0.2);
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.uploadBtn:hover {
  background-color: ${file.color};
  color: #ffffff;
}

.fileName {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.modalFooter {
  padding: 20px 28px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.modalFooter button {
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.2s;
}

@keyframes scaleIn {
  from {
    transform: scale(0.95) translateY(10px);
    opacity: 0;
  }
  to {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}
`;

  fs.writeFileSync(filePath, content);
});
console.log('Modals updated');
