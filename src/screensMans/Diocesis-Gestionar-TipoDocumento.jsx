import React, { useState } from 'react';
import '../components/UI.css';
import '../utils/spacing.css';
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components/SearchBar";
import ToggleSwitch from "../components2/Toggle";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from '../components2/MyButtonShortAction';
import "../utils/Estilos-Generales-1.css";

const initialDocs = [
  { id: 1, nombre: 'DNI', estado: 'Activo', descripcion: 'Documento nacional de identidad', nombreCorto: 'DNI' },
  { id: 2, nombre: 'Pasaporte', estado: 'Activo', descripcion: 'Pasaporte internacional', nombreCorto: 'PI' },
  { id: 3, nombre: 'Carnet de extranjería', estado: 'Baja', descripcion: 'Carnet de extranjería', nombreCorto: 'CE' },
  { id: 4, nombre: 'Licencia de conducir', estado: 'Activo', descripcion: 'Licencia de conducir vehicular', nombreCorto: 'LC' },
  { id: 5, nombre: 'Cédula de identidad', estado: 'Activo', descripcion: 'Documento para ciudadanos extranjeros', nombreCorto: 'CI' },
  { id: 6, nombre: 'Tarjeta de residencia', estado: 'Baja', descripcion: 'Tarjeta para residentes temporales', nombreCorto: 'TR' },
  { id: 7, nombre: 'Certificado de nacimiento', estado: 'Activo', descripcion: 'Documento que certifica el nacimiento', nombreCorto: 'CN' },
  { id: 8, nombre: 'Permiso de trabajo', estado: 'Activo', descripcion: 'Permiso para trabajar en el país', nombreCorto: 'PT' },
  { id: 9, nombre: 'Visa de estudiante', estado: 'Baja', descripcion: 'Visa para estudios académicos', nombreCorto: 'VE' },
  { id: 10, nombre: 'Carnet de sanidad', estado: 'Activo', descripcion: 'Certificado de salud', nombreCorto: 'CS' },
  { id: 11, nombre: 'Declaración jurada', estado: 'Activo', descripcion: 'Documento legal', nombreCorto: 'DJ' },
];

export default function TipoDocumentoGestionar() {
    React.useEffect(() => {
    document.title = "MLAP | Gestionar tipos de documentos";
  }, []);
  const [docs, setDocs] = useState(initialDocs);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [modalType, setModalType] = useState(null);

  // Nuevo estado para gestionar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    nombreCorto: ''
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredDocs = docs.filter((doc) =>
    Object.values(doc).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleOpenModal = (doc, action) => {
    setCurrentDoc(doc);
    setModalType(action);
    // Cargar los datos del documento en el estado del formulario
    if (doc) {
      setFormData({
        nombre: doc.nombre,
        descripcion: doc.descripcion,
        nombreCorto: doc.nombreCorto
      });
    } else {
      setFormData({
        nombre: '',
        descripcion: '',
        nombreCorto: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentDoc(null);
    setModalType(null);
    setFormData({
      nombre: '',
      descripcion: '',
      nombreCorto: ''
    });
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

  const handleSave = () => {
    if (modalType === 'add') {
      const newDoc = {
        ...formData,
        id: docs.length > 0 ? Math.max(...docs.map(d => d.id)) + 1 : 1,
        estado: 'Activo'
      };
      setDocs(prevDocs => [...prevDocs, newDoc]);
    } else if (modalType === 'edit' && currentDoc) {
      setDocs(prevDocs =>
        prevDocs.map(doc =>
          doc.id === currentDoc.id ? { ...doc, ...formData } : doc
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
    { key: 'id',
      header: 'ID',
      accessor: (doc) => doc.id
    },
    { key: 'nombre',
      header: 'Nombre',
      accessor: (doc) => doc.nombre,
    },
    { key: 'descripcion',
      header: 'Descripción',
      accessor: (doc) => doc.descripcion,
    },
    { key: 'estado',
      header: 'Estado',
      accessor: (doc) => <ToggleSwitch isEnabled={doc.estado === 'Activo'} onToggle={() => handleToggle(doc.id)} />,
    },
    { key: 'acciones',
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
          content: <DocForm formData={formData} handleFormChange={handleFormChange} isViewMode={true} />,
          onAccept: handleCloseModal,
          onCancel: handleCloseModal
        };
      case 'edit':
        return {
          title: 'Editar documento',
          content: <DocForm formData={formData} handleFormChange={handleFormChange} isViewMode={false} />,
          onAccept: handleSave,
          onCancel: handleCloseModal
        };
      case 'add':
        return {
          title: 'Añadir documento',
          content: <DocForm formData={formData} handleFormChange={handleFormChange} isViewMode={false} />,
          onAccept: handleSave,
          onCancel: handleCloseModal
        };
      case 'delete':
        return {
          title: 'Eliminar documento',
          content: currentDoc && (
            <div className='Inputs-add'>
              <label htmlFor="deleteConfirmation" className="inputModal" disabled>¿Deseas eliminar el documento?</label>
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

const DocForm = ({ formData, handleFormChange, isViewMode }) => {
  return (
    <div>
      <div className="Inputs-add">
        <label htmlFor="nombre">Nombre:</label>
        <input
          type="text"
          className="inputModal"
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleFormChange}
          disabled={isViewMode}
          required
        />
        <label htmlFor="descripcion">Descripción:</label>
        <textarea
          className="inputModal"
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleFormChange}
          disabled={isViewMode}
          required
        />
        <label htmlFor="nombreCorto">Nombre corto:</label>
        <input
          type="text"
          className="inputModal"
          id="nombreCorto"
          name="nombreCorto"
          value={formData.nombreCorto}
          onChange={handleFormChange}
          disabled={isViewMode}
          required
        />
      </div>
    </div>
  );
};
