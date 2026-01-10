import React, { useState } from "react";
import { Head, router } from "@inertiajs/react";
import NavBar from "@/Components/NavBar";
import EditOsraModal from "@/Components/EditOsraModal";
import DeleteOsraModal from "@/Components/DeleteOsraModal";
import AddOsraModal from "@/Components/AddOsraModal";
import "../../css/checkoutModal.css";

const OsraPage = ({ osras: initialOsras }) => {
  const [osras, setOsras] = useState(initialOsras || []);
  const [selectedOsra, setSelectedOsra] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  // Add Osra
  const handleAdd = (data) => {
    const formData = new FormData();
    formData.append("osra_name", data.name);
    formData.append("osra_code", data.code);
    formData.append("osra_place", data.osra_place);
    formData.append("osra_time", data.osra_time);

    router.post(route("osras.store"), formData, { onSuccess: () => router.reload() });
  };

  // Edit Osra
  const handleEdit = (data) => {
    const formData = new FormData();
    formData.append("osra_name", data.name);
    formData.append("osra_code", data.code);
    formData.append("osra_place", data.osra_place);
    formData.append("osra_time", data.osra_time);
    formData.append("_method", "PUT");

    router.post(route("osras.update", data.osra_id), formData, { onSuccess: () => router.reload() });
  };

  // Delete Osra
  const handleDelete = (osra) => {
    router.delete(route("osras.destroy", osra.osra_id), { onSuccess: () => router.reload() });
  };

  return (
    <>
      <Head title="مركز وسائل الإيضاح" />
      <NavBar page_name="osras" />

      <div className="container mt-4">
        <h2>Osra List</h2>
        
        <button className="btn btn-success mt-2 mb-3" onClick={() => setShowAdd(true)}>Add Family</button>

        <div className="row">
          {osras.map((osra) => (
            <div key={osra.osra_id} className="col-lg-3 col-md-4 col-sm-6" style={{ marginTop: 24 }}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{osra.osra_name}</h5>
                  <p className="card-text text-muted mb-1">Code: {osra.osra_code}</p>
                  <p className="card-text mb-1">📍 Place: {osra.osra_place}</p>
                  <p className="card-text">⏰ Time: {osra.osra_time}</p>

                  <div className="d-flex gap-2 mt-2">
                    <button className="btn btn-primary btn-sm" onClick={() => { setSelectedOsra(osra); setShowEdit(true); }}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => { setSelectedOsra(osra); setShowDelete(true); }}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showAdd && <AddOsraModal onClose={() => setShowAdd(false)} onConfirm={handleAdd} />}
        {showEdit && selectedOsra && <EditOsraModal osra={selectedOsra} onClose={() => setShowEdit(false)} onConfirm={handleEdit} />}
        {showDelete && selectedOsra && <DeleteOsraModal osra={selectedOsra} onClose={() => setShowDelete(false)} onConfirm={() => handleDelete(selectedOsra)} />}
      </div>
    </>
  );
};

export default OsraPage;
