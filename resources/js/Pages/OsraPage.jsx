import React, { useState } from "react";
import { Head, router, usePage } from "@inertiajs/react";
import { useTranslation } from "react-i18next";
import NavBar from "@/Components/NavBar";
import EditOsraModal from "@/Components/EditOsraModal";
import DeleteOsraModal from "@/Components/DeleteOsraModal";
import AddOsraModal from "@/Components/AddOsraModal";
import PaginationControls from "@/Components/PaginationControls";

const OsraPage = ({ osras: initialOsras }) => {
  const { t } = useTranslation();
  const { pagination, errors } = usePage().props;
  const osras = initialOsras || [];
  const [selectedOsra, setSelectedOsra] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  return (
    <>
      <Head title={t('home.page_title')} />
      <NavBar page_name="osras" />

      <div className="container mt-4">
        <h2>{t('osra.title')}</h2>

        {errors?.osra && (
          <div className="alert alert-danger mt-2 mb-2">{errors.osra}</div>
        )}

        <button className="btn btn-success mt-2 mb-3" onClick={() => setShowAdd(true)}>{t('osra.add_family')}</button>

        <div className="row">
          {osras.map((osra) => (
            <div key={osra.osra_id} className="col-lg-3 col-md-4 col-sm-6 mt-2">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{osra.osra_name}</h5>
                  <p className="card-text text-muted mb-1">{t('osra.code')} {osra.osra_code}</p>
                  <p className="card-text mb-1">{t('osra.place')} {osra.osra_place}</p>
                  <p className="card-text">{t('osra.time')} {osra.osra_time}</p>

                  <div className="d-flex gap-2 mt-2">
                    <button className="btn btn-primary btn-sm" onClick={() => { setSelectedOsra(osra); setShowEdit(true); }}>{t('osra.edit')}</button>
                    <button className="btn btn-danger btn-sm" onClick={() => { setSelectedOsra(osra); setShowDelete(true); }}>{t('osra.delete')}</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <PaginationControls pagination={pagination} />

        {showAdd && <AddOsraModal onClose={() => setShowAdd(false)} />}
        {showEdit && selectedOsra && <EditOsraModal osra={selectedOsra} onClose={() => setShowEdit(false)} />}
        {showDelete && selectedOsra && <DeleteOsraModal osra={selectedOsra} onClose={() => setShowDelete(false)} />}
      </div>
    </>
  );
};

export default OsraPage;
