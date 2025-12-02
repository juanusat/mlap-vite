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
import * as mentionTypeService from '../services/mentionTypeService';

export default function TipoMencionesGestionar() {
  useEffect(() => {
    document.title = "MLAP | Gestionar tipos de menciones";
    loadMentionTypes();
  }, []);

  const [mentions, setMentions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentMention, setCurrentMention] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalError, setModalError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: ''
  });

  const loadMentionTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mentionTypeService.listMentionTypes(1, 100);
      setMentions(response.data);
    } catch (err) {
      if (err.message.includes('403') || err.message.includes('Prohibido')) {
        setError('No tienes permisos para acceder a esta funcionalidad. Requiere acceso de nivel diócesis.');
      } else if (err.message.includes('401') || err.message.includes('autorizado')) {
        setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        setError(err.message);
      }
      console.error('Error al cargar tipos de menciones:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredMentions = mentions.filter((mention) =>
    Object.values(mention).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleOpenModal = (mention, action) => {
    setCurrentMention(mention);
    setModalType(action);
    setModalError(null);
    if (mention) {
      setFormData({
        name: mention.name,
        description: mention.description || '',
        code: mention.code
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
    setCurrentMention(null);
    setModalType(null);
    setModalError(null);
    setFormData({
      name: '',
      description: '',
      code: ''
    });
  };

  const handleView = (mention) => {
    handleOpenModal(mention, 'view');
  };

  const handleEdit = (mention) => {
    handleOpenModal(mention, 'edit');
  };

  const handleDeleteConfirmation = (mention) => {
    handleOpenModal(mention, 'delete');
  };

  const handleAddMention = () => {
    handleOpenModal(null, 'add');
  };

  const confirmDelete = async () => {
    if (currentMention) {
      try {
        setLoading(true);
        setModalError(null);
        await mentionTypeService.deleteMentionType(currentMention.id);
        await loadMentionTypes();
        handleCloseModal();
      } catch (err) {
        if (err.message.includes('403') || err.message.includes('Prohibido')) {
          setModalError('No tienes permisos para eliminar tipos de menciones.');
        } else if (err.message.includes('401') || err.message.includes('autorizado')) {
          setModalError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        } else {
          setModalError(err.message);
        }
        console.error('Error al eliminar:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async () => {
    // Validar que los campos obligatorios no estén vacíos o solo con espacios
    if (!formData.name || !formData.name.trim()) {
      setModalError('El nombre no puede estar vacío');
      return;
    } 
    if (!formData.description || !formData.description.trim()) {
      setModalError('La descripción no puede estar vacía');
      return;
    }
    
    if (!formData.code || !formData.code.trim()) {
      setModalError('El código no puede estar vacío');
      return;
    }

    try {
      setLoading(true);
      setModalError(null);
      
      const cleanData = {
        name: formData.name.trim(),
        description: formData.description ? formData.description.trim() : '',
        code: formData.code.trim()
      };

      if (modalType === 'add') {
        await mentionTypeService.createMentionType(cleanData);
      } else if (modalType === 'edit' && currentMention) {
        await mentionTypeService.updateMentionType(currentMention.id, cleanData);
      }
      
      await loadMentionTypes();
      handleCloseModal();
    } catch (err) {
      if (err.message.includes('403') || err.message.includes('Prohibido')) {
        setModalError('No tienes permisos para realizar esta operación.');
      } else if (err.message.includes('401') || err.message.includes('autorizado')) {
        setModalError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
      } else {
        setModalError(err.message);
      }
      console.error('Error al guardar:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (mentionId, currentStatus) => {
    try {
      setLoading(true);
      setError(null);
      await mentionTypeService.updateMentionTypeStatus(mentionId, !currentStatus);
      await loadMentionTypes();
    } catch (err) {
      if (err.message.includes('403') || err.message.includes('Prohibido')) {
        setError('No tienes permisos para cambiar el estado de tipos de menciones.');
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
      accessor: (mention) => mention.id
    },
    { key: 'name',
      header: 'Nombre',
      accessor: (mention) => mention.name,
    },
    { key: 'description',
      header: 'Descripción',
      accessor: (mention) => mention.description || '-',
    },
    { key: 'active',
      header: 'Estado',
      accessor: (mention) => <ToggleSwitch isEnabled={mention.active} onToggle={() => handleToggle(mention.id, mention.active)} />,
    },
    { key: 'acciones',
      header: 'Acciones',
      accessor: (mention) => (
        <MyGroupButtonsActions>
          <MyButtonShortAction type="view" onClick={() => handleView(mention)} title="Visualizar" />
          <MyButtonShortAction type="edit" onClick={() => handleEdit(mention)} title="Editar" />
          <MyButtonShortAction type="delete" onClick={() => handleDeleteConfirmation(mention)} title="Eliminar" />
        </MyGroupButtonsActions>
      ),
    },
  ];

  const getModalContentAndActions = () => {
    switch (modalType) {
      case 'view':
        return {
          title: 'Visualizar tipo de mención',
          content: (
            <>
              <MentionForm formData={formData} handleFormChange={handleFormChange} isViewMode={true} />
              {modalError && <div className="error-message" style={{ marginTop: 8 }}>{modalError}</div>}
            </>
          ),
          onAccept: handleCloseModal,
          onCancel: handleCloseModal
        };
      case 'edit':
        return {
          title: 'Editar tipo de mención',
          content: (
            <>
              <MentionForm formData={formData} handleFormChange={handleFormChange} isViewMode={false} />
              {modalError && <div className="error-message" style={{ marginTop: 8 }}>{modalError}</div>}
            </>
          ),
          onAccept: handleSave,
          onCancel: handleCloseModal
        };
      case 'add':
        return {
          title: 'Añadir tipo de mención',
          content: (
            <>
              <MentionForm formData={formData} handleFormChange={handleFormChange} isViewMode={false} />
              {modalError && <div className="error-message" style={{ marginTop: 8 }}>{modalError}</div>}
            </>
          ),
          onAccept: handleSave,
          onCancel: handleCloseModal
        };
      case 'delete':
        return {
          title: 'Eliminar tipo de mención',
          content: currentMention && (
            <div>
              <h4>¿Deseas eliminar el tipo de mención "{currentMention.name}"?</h4>
              {modalError && <div className="error-message" style={{ marginTop: 8 }}>{modalError}</div>}
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
        <h2 className='title-screen'>Tipos de menciones</h2>
        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-message">Cargando...</div>}
        <div className="app-container">
          <div className="search-add">
            <div className="center-container">
              <SearchBar onSearchChange={setSearchTerm} />
            </div>
            <MyButtonShortAction type="add" onClick={handleAddMention} title="Añadir tipo de mención" />
          </div>
          <DynamicTable
            columns={columns}
            data={filteredMentions}
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

const MentionForm = ({ formData, handleFormChange, isViewMode }) => {
  const handleBlur = (e) => {
    const { name, value } = e.target;
    handleFormChange({ target: { name, value: value.trim() } });
  };

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
          onBlur={handleBlur}
          disabled={isViewMode}
          placeholder="Ej: Difunto, Salud, Agradecimiento"
          required
          pattern=".*\S+.*"
          title="El nombre no puede estar vacío o contener solo espacios"
        />
        <label htmlFor="description">Descripción:</label>
        <textarea
          className="inputModal"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleFormChange}
          onBlur={handleBlur}
          disabled={isViewMode}
          placeholder="Descripción del tipo de mención (opcional)"
        />
        <label htmlFor="code">Código corto:</label>
        <input
          type="text"
          className="inputModal"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleFormChange}
          onBlur={handleBlur}
          disabled={isViewMode}
          placeholder="Ej: DIF, SAL, AGR"
          maxLength={10}
          required
          pattern=".*\S+.*"
          title="El código no puede estar vacío o contener solo espacios"
        />
      </div>
    </div>
  );
};
