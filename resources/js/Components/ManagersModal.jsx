import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const ManagersModal = ({ isOpen, onClose, managers }) => {
  const { t } = useTranslation();
  const [sortedManagers, setSortedManagers] = useState(managers || []);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setSortedManagers(managers || []);
  }, [managers]);

  const filteredManagers = sortedManagers.filter(
    (manager) =>
      manager.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      manager.mobile.includes(searchTerm)
  );

  if (!isOpen) return null;

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
        aria-labelledby="managers-modal-title"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto my-8 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-6 flex justify-between items-center">
            <div>
              <h2 id="managers-modal-title" className="text-2xl font-bold text-white">
                {t("managers.title") || "Managers Directory"}
              </h2>
              <p className="text-blue-100 text-sm mt-1">
                {filteredManagers.length} {t("managers.count_label") || "manager(s)"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-blue-800 p-2 rounded-lg transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <input
              type="text"
              placeholder={t("managers.search_placeholder") || "Search by name, email, or phone..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {filteredManagers.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM16 16a5 5 0 00-10 0v2h10v-2z" />
                </svg>
                <p className="text-gray-500">
                  {searchTerm ? t("managers.no_results") || "No managers found" : t("managers.no_managers") || "No managers available"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredManagers.map((manager) => (
                  <div key={manager.user_id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {manager.user_photo ? (
                          <img
                            src={manager.user_photo}
                            alt={manager.full_name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                            {manager.full_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-grow">
                        <h3 className="font-semibold text-gray-900 text-lg">{manager.full_name}</h3>
                        <div className="mt-2 space-y-1 text-sm">
                          <p className="text-gray-600 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope-fill" viewBox="0 0 16 16">
                                <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z"/>
                            </svg>
                            <a href={`mailto:${manager.email}`} className="text-inherit">
                              {manager.email}
                            </a>
                          </p>
                          <p className="text-gray-600 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone-fill" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                            </svg>
                            <a href={`tel:${manager.mobile}`} className="text-inherit font-mono">
                              {manager.mobile}
                            </a>
                          </p>
                          <p className="text-gray-500 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-people-fill" viewBox="0 0 16 16">
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
                            </svg>
                            <span>{manager.osra_name}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              {t("managers.close_button") || "Close"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManagersModal;
