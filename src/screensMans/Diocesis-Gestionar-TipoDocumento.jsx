import React, { useState, useEffect } from 'react';
import '../components/UI.css';
import '../utils/spacing.css';
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import ToggleSwitch from "../components/Toggle";
import Modal from "../components/Modal";
import MyGroupButtonsActions from "../components/MyGroupButtonsActions";
import MyButtonShortAction from '../components/MyButtonShortAction';
import "../utils/Estilos-Generales-1.css";
import * as documentTypeService from '../services/documentTypeService';

export default function TipoDocumentoGestionar() {
  useEffect(() => {
    document.title = "MLAP | Gestionar tipos de documentos";
    loadDocumentTypes();
  }, []);

  const [docs, setDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentDoc, setCurrentDoc] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: ''
  });

  const loadDocumentTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await documentTypeService.listDocumentTypes(1, 100);
      setDocs(response.data);
    } catch (err) {
      if (err.message.includes('403') || err.message.includes('Prohibido')) {
        setError('No tienes permisos para acceder a esta funcionalidad. Requiere acceso de nivel diócesis.');
      } else if (err.message.includes('401') || err.message.includes('autorizado')) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        setError(err.message);
      }
      console.error('Error al cargar tipos de documentos:', err);
    } finally {
      setLoading(false);
    }
  };

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
    if (doc) {
      setFormData({
        name: doc.name,
        description: doc.description,
        code: doc.code
      });
    } else {
      setFormData({
        name: '',
        description: '',
        code: ''
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentDoc(null);
    setModalType(null);
    setFormData({
      name: '',
      description: '',
      code: ''
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

  const confirmDelete = async () => {
    if (currentDoc) {
      try {
        setLoading(true);
        setError(null);
        await documentTypeService.deleteDocumentType(currentDoc.id);
        await loadDocumentTypes();
        handleCloseModal();
      } catch (err) {
        if (err.message.includes('403') || err.message.includes('Prohibido')) {
          setError('No tienes permisos para eliminar tipos de documentos.');
        } else if (err.message.includes('401') || err.message.includes('autorizado')) {
          setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        } else {
          setError(err.message);
        }
        console.error('Error al eliminar:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (modalType === 'add') {
        await documentTypeService.createDocumentType(formData);
      } else if (modalType === 'edit' && currentDoc) {
        await documentTypeService.updateDocumentType(currentDoc.id, formData);
      }
      
      await loadDocumentTypes();
      handleCloseModal();
    } catch (err) {
      if (err.message.includes('403') || err.message.includes('Prohibido')) {
        setError('No tienes permisos para realizar esta operación.');
      } else if (err.message.includes('401') || err.message.includes('autorizado')) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        setError(err.message);
      }
      console.error('Error al guardar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (docId, currentStatus) => {
    try {
      setLoading(true);
      setError(null);
      await documentTypeService.updateDocumentTypeStatus(docId, !currentStatus);
      await loadDocumentTypes();
    } catch (err) {
      if (err.message.includes('403') || err.message.includes('Prohibido')) {
        setError('No tienes permisos para cambiar el estado de tipos de documentos.');
      } else if (err.message.includes('401') || err.message.includes('autorizado')) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        setError(err.message);
      }
      console.error('Error al cambiar estado:', err);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id',
      header: 'ID',
      accessor: (doc) => doc.id
    },
    { key: 'name',
      header: 'Nombre',
      accessor: (doc) => doc.name,
    },
    { key: 'description',
      header: 'Descripción',
      accessor: (doc) => doc.description,
    },
    { key: 'active',
      header: 'Estado',
      accessor: (doc) => <ToggleSwitch isEnabled={doc.active} onToggle={() => handleToggle(doc.id, doc.active)} />,
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
            <div>
              <h4>¿Deseas eliminar el documento?</h4>
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
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-message">Cargando...</div>}
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
        <label htmlFor="name">Nombre:</label>
        <input
          type="text"
          className="inputModal"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleFormChange}
          disabled={isViewMode}
          required
        />
        <label htmlFor="description">Descripción:</label>
        <textarea
          className="inputModal"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleFormChange}
          disabled={isViewMode}
          required
        />
        <label htmlFor="code">Nombre corto:</label>
        <input
          type="text"
          className="inputModal"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleFormChange}
          disabled={isViewMode}
          required
        />
      </div>
    </div>
  );
};
