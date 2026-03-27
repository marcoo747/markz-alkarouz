import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const TermsAndPenaltiesModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('terms');
  const [terms, setTerms] = useState([]);
  const [penalties, setPenalties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'terms',
    amount: ''
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(route("api.terms-penalties"));
      const data = await response.json();
      setTerms(data.terms || []);
      setPenalties(data.penalties || []);
    } catch (error) {
      console.error("Error fetching terms and penalties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      content: '',
      type: activeTab === 'terms' ? 'terms' : 'penalty',
      amount: ''
    });
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      type: item.type,
      amount: item.amount || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (item) => {
    if (!confirm(t("terms.confirm_delete"))) return;

    setDeletingId(item.id);
    try {
      const response = await fetch(route("api.terms-penalties.destroy", item.id), {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert(t("terms.success_delete"));
        fetchData();
      } else {
        alert(t("terms.error_delete"));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert(t("terms.error_delete"));
    } finally {
      setDeletingId(null);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.type === 'penalty' && !formData.amount) {
      alert("Please enter an amount for penalties");
      return;
    }

    setSaving(true);
    try {
      const url = editingItem
        ? route("api.terms-penalties.update", editingItem.id)
        : route("api.terms-penalties.store");

      const method = editingItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(editingItem ? t("terms.success_update") : t("terms.success_create"));
        setShowForm(false);
        fetchData();
      } else {
        alert(editingItem ? t("terms.error_update") : t("terms.error_create"));
      }
    } catch (error) {
      console.error("Error saving item:", error);
      alert(editingItem ? t("terms.error_update") : t("terms.error_create"));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  if (!isOpen) return null;

  const currentItems = activeTab === 'terms' ? terms : penalties;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1100] transition-opacity"
        onClick={onClose}
        role="presentation"
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-[1101] flex items-center justify-center p-4 overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-modal-title"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto my-8 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-6 flex justify-between items-center">
            <div>
              <h2 id="terms-modal-title" className="text-2xl font-bold text-white">
                {t("terms.title")}
              </h2>
              <p className="text-green-100 text-sm mt-1">
                {t("terms.subtitle")}
              </p>
            </div>
            <div className="flex gap-3">
              {!showForm && (
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t("terms.add_button")}
                </button>
              )}
              <button
                onClick={onClose}
                className="text-white hover:bg-green-800 p-2 rounded-lg transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tab Navigation */}
          {!showForm && (
            <div className="border-b border-gray-200 bg-gray-50">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('terms')}
                  className={`px-6 py-4 font-medium text-sm transition-colors ${
                    activeTab === 'terms'
                      ? 'border-b-2 border-green-600 text-green-600 bg-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {t("terms.terms_tab")}
                  {terms.length > 0 && (
                    <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      {terms.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('penalties')}
                  className={`px-6 py-4 font-medium text-sm transition-colors ${
                    activeTab === 'penalties'
                      ? 'border-b-2 border-red-600 text-red-600 bg-white'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {t("terms.penalties_tab")}
                  {penalties.length > 0 && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      {penalties.length}
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {showForm ? (
              /* Form */
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  {editingItem ? t("terms.edit_button") : t("terms.add_button")} {t(`terms.type_${formData.type}`)}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("terms.title_label")} *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                      placeholder={t("terms.title_label")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("terms.type_label")} *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                    >
                      <option value="terms">{t("terms.type_terms")}</option>
                      <option value="penalty">{t("terms.type_penalty")}</option>
                    </select>
                  </div>

                  {formData.type === 'penalty' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t("terms.amount_label")} *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.amount}
                        onChange={(e) => setFormData({...formData, amount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        placeholder={t("terms.amount_placeholder")}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t("terms.content_label")} *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      rows={6}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                      placeholder={t("terms.content_label")}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* List View */
              <div className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <svg className="w-8 h-8 mx-auto text-gray-400 animate-spin mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <p className="text-gray-500">{t("terms.loading")}</p>
                  </div>
                ) : currentItems.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500">
                      {activeTab === 'terms' ? t("terms.no_terms") : t("terms.no_penalties")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentItems.map((item) => (
                      <div key={item.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${activeTab === 'penalties' ? 'border-red-200 bg-red-50' : 'border-gray-200'}`}>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                item.type === 'penalty'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {item.type === 'penalty' ? t("terms.penalty_label") : t("terms.term_label")}
                              </span>
                              {item.amount && (
                                <span className="bg-red-600 text-white text-sm px-3 py-1 rounded-full font-bold">
                                  {item.amount} {t("terms.currency")}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title={t("terms.edit_button")}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              disabled={deletingId === item.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title={t("terms.delete_button")}
                            >
                              {deletingId === item.id ? (
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                          {item.content}
                        </div>
                        <div className="mt-3 text-xs text-gray-500">
                          {t("terms.last_updated")}: {new Date(item.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end gap-3">
            {showForm ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {t("terms.cancel_button")}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  {saving && (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  )}
                  {t("terms.save_button")}
                </button>
              </>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                {t("terms.close_button")}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsAndPenaltiesModal;