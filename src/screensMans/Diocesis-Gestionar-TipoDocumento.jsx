import React, { useState } from 'react';
import '../components/UI.css';
import '../utils/spacing.css';
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import ToggleSwitch from "../components2/Toggle";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from '../components2/MyButtonShortAction';
import MyButtonMediumIcon from "../components/MyButtonMediumIcon";
import "../utils/Estilos-Generales-1.css";

const initialDocs = [
  { id: 1, nombre: 'DNI', estado: 'Activo', descripcion: 'Documento Nacional de Identidad', nombreCorto: 'DNI' },
  { id: 2, nombre: 'Pasaporte', estado: 'Activo', descripcion: 'Pasaporte Internacional', nombreCorto: 'PI' },
  { id: 3, nombre: 'Carnet de Extranjería', estado: 'Baja', descripcion: 'Carnet de Extranjería', nombreCorto: 'CE' },
  { id: 4, nombre: 'Licencia de Conducir', estado: 'Activo', descripcion: 'Licencia de conducir vehicular', nombreCorto: 'LC' },
  { id: 5, nombre: 'Cédula de Identidad', estado: 'Activo', descripcion: 'Documento para ciudadanos extranjeros', nombreCorto: 'CI' },
  { id: 6, nombre: 'Tarjeta de Residencia', estado: 'Baja', descripcion: 'Tarjeta para residentes temporales', nombreCorto: 'TR' },
  { id: 7, nombre: 'Certificado de Nacimiento', estado: 'Activo', descripcion: 'Documento que certifica el nacimiento', nombreCorto: 'CN' },
  { id: 8, nombre: 'Permiso de Trabajo', estado: 'Activo', descripcion: 'Permiso para trabajar en el país', nombreCorto: 'PT' },
  { id: 9, nombre: 'Visa de Estudiante', estado: 'Baja', descripcion: 'Visa para estudios académicos', nombreCorto: 'VE' },
  { id: 10, nombre: 'Carnet de Sanidad', estado: 'Activo', descripcion: 'Certificado de salud', nombreCorto: 'CS' },
  { id: 11, nombre: 'Declaración Jurada', estado: 'Activo', descripcion: 'Documento legal', nombreCorto: 'DJ' },
];

export default function TipoDocumentoGestionar() {
  const [docs, setDocs] = useState(initialDocs);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [modalType, setModalType] = useState(null);

  const filteredDocs = docs.filter((doc) =>
    Object.values(doc).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleOpenModal = (doc, action) => {
    setCurrentDoc(doc);
    setModalType(action);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentDoc(null);
    setModalType(null);
  };

  const handleView = (doc) => {
    handleOpenModal(doc, 'view');
  };

  const handleEdit = (doc) => {
    handleOpenModal(doc, 'edit');
  };

  const handleDeleteConfirmation = (doc) => {
    handleOpenModal(doc, 'delete');
  };

  const handleAddDoc = () => {
    handleOpenModal(null, 'add');
  };

  const confirmDelete = () => {
    if (currentDoc) {
      setDocs(prevDocs => prevDocs.filter(doc => doc.id !== currentDoc.id));
      handleCloseModal();
    }
  };

  const handleSave = (docData) => {
    if (modalType === 'add') {
      const newDoc = {
        ...docData,
        id: docs.length > 0 ? Math.max(...docs.map(d => d.id)) + 1 : 1,
        estado: 'Activo'
      };
      setDocs(prevDocs => [...prevDocs, newDoc]);
    } else if (modalType === 'edit' && currentDoc) {
      setDocs(prevDocs =>
        prevDocs.map(doc =>
          doc.id === currentDoc.id ? { ...doc, ...docData } : doc
        )
      );
    }
    handleCloseModal();
  };

  const handleToggle = (docId) => {
    setDocs(prevDocs =>
      prevDocs.map(doc =>
        doc.id === docId
          ? { ...doc, estado: doc.estado === 'Activo' ? 'Baja' : 'Activo' }
          : doc
      )
    );
  };

  const columns = [
    {
      header: 'ID',
      accessor: (doc) => doc.id
    },
    {
      header: 'Nombre',
      accessor: (doc) => doc.nombre,
    },
    {
      header: 'Descripción',
      accessor: (doc) => doc.descripcion,
    },
    {
      header: 'Estado',
      accessor: (doc) => <ToggleSwitch checked={doc.estado === 'Activo'} onToggle={() => handleToggle(doc.id)} />,
    },
    {
      header: 'Acciones',
      accessor: (doc) => (
        <MyGroupButtonsActions>
          <MyButtonShortAction type="view" onClick={() => handleView(doc)} title="Visualizar" />
          <MyButtonShortAction type="edit" onClick={() => handleEdit(doc)} title="Editar" />
          <MyButtonShortAction type="delete" onClick={() => handleDeleteConfirmation(doc)} title="Eliminar" />
        </MyGroupButtonsActions>
      ),
    },
  ];

  const getModalContentAndActions = () => {
    switch (modalType) {
      case 'view':
        return {
          title: 'Visualizar documento',
          content: currentDoc && (
            <div>
              <p><strong>Nombre:</strong> {currentDoc.nombre}</p>
              <p><strong>Descripción:</strong> {currentDoc.descripcion}</p>
              <p><strong>Nombre Corto:</strong> {currentDoc.nombreCorto}</p>
            </div>
          ),
          onAccept: handleCloseModal,
          onCancel: handleCloseModal
        };
      case 'edit':
        return {
          title: 'Editar documento',
          content: <DocForm onSave={handleSave} />,
          onAccept: () => document.getElementById('doc-form').requestSubmit(),
          onCancel: handleCloseModal
        };
      case 'add':
        return {
          title: 'Añadir documento',
          content: <DocForm onSave={handleSave} />,
          onAccept: () => document.getElementById('doc-form').requestSubmit(),
          onCancel: handleCloseModal
        };
      case 'delete':
        return {
          title: 'Eliminar documento',
          content: (
            <div>
              <p>¿Estás seguro de que quieres eliminar el documento "{currentDoc.nombre}"?</p>
            </div>
          ),
          onAccept: confirmDelete,
          onCancel: handleCloseModal
        };
      default:
        return {
          title: '',
          content: null,
          onAccept: null,
          onCancel: handleCloseModal
        };
    }
  };

  const modalProps = getModalContentAndActions();

  return (
    <>
      <div className="content-module only-this">
        <h2 className='title-screen'>Tipos de documentos</h2>
        <div className="app-container">
          <div className="search-add">
            <div className="center-container">
              <SearchBar onSearchChange={setSearchTerm} />
            </div>
            <MyButtonShortAction type="add" onClick={handleAddDoc} title="Añadir documento" />
          </div>
          <DynamicTable
            columns={columns}
            data={filteredDocs}
            gridColumnsLayout="90px 380px 1fr 140px 220px"
            columnLeftAlignIndex={[2, 3]}
          />
        </div>
      </div>

      <Modal
        show={showModal}
        onClose={handleCloseModal}
        title={modalProps.title}
        onAccept={modalProps.onAccept}
        onCancel={modalProps.onCancel}
      >
        {modalProps.content}
      </Modal>
    </>
  );
}

const DocForm = ({ onSave, doc }) => {
  const [formData, setFormData] = useState({
    nombre: doc?.nombre || '',
    descripcion: doc?.descripcion || '',
    nombreCorto: doc?.nombreCorto || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form id="doc-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label>Nombre</label>
        <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="inputModal" required />
      </div>
      <div className="form-field">
        <label>Descripción</label>
        <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} className="inputModal" rows="3" />
      </div>
      <div className="form-field">
        <label>Nombre Corto</label>
        <input type="text" name="nombreCorto" value={formData.nombreCorto} onChange={handleChange} className="inputModal" />
      </div>
    </form>
  );
};