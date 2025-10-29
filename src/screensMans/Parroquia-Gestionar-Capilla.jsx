import React, { useState, useEffect } from "react";
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import ToggleSwitch from "../components/Toggle";
import Modal from "../components/Modal";
import MyGroupButtonsActions from "../components/MyGroupButtonsActions";
import MyButtonShortAction from "../components/MyButtonShortAction";
import InputFotoPerfil from '../components/inputFotoPerfil';
import * as chapelService from '../services/chapelService';
import "../utils/Estilos-Generales-1.css";
import '../utils/Parroquia-Gestionar-Capilla.css';

export default function GestionCapillas() {
  useEffect(() => {
    document.title = "MLAP | Gestionar capillas";
    loadChapels();
  }, []);
  
  const [chapels, setChapels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentChapel, setCurrentChapel] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadChapels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await chapelService.searchChapels(1, 100, '');
      setChapels(response.data);
    } catch (err) {
      setError(err.message || 'Error al cargar las capillas');
      console.error('Error al cargar capillas:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredChapels = chapels.filter((chapel) =>
    Object.values(chapel).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleToggle = async (chapelId, currentStatus) => {
    try {
      setLoading(true);
      setError(null);
      await chapelService.updateChapelStatus(chapelId, !currentStatus);
      await loadChapels();
    } catch (err) {
      setError(err.message || 'Error al cambiar el estado');
      console.error('Error al cambiar estado:', err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (type, chapel = null) => {
    setModalType(type);
    setCurrentChapel(chapel);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentChapel(null);
    setModalType(null);
  };

  const confirmDelete = async () => {
    if (currentChapel) {
      try {
        setLoading(true);
        setError(null);
        await chapelService.deleteChapel(currentChapel.id);
        await loadChapels();
        handleCloseModal();
      } catch (err) {
        setError(err.message || 'Error al eliminar la capilla');
        console.error('Error al eliminar:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async (chapelData) => {
    try {
      setLoading(true);
      setError(null);

      if (modalType === 'add') {
        await chapelService.createChapel(chapelData);
      } else if (modalType === 'edit' && currentChapel) {
        await chapelService.updateChapel(currentChapel.id, chapelData);
      }

      await loadChapels();
      handleCloseModal();
    } catch (err) {
      setError(err.message || 'Error al guardar la capilla');
      console.error('Error al guardar:', err);
    } finally {
      setLoading(false);
    }
  };

  const chapelColumns = [
    { key: 'id', header: 'ID', accessor: (row) => row.id },
    { key: 'nombre', header: 'Nombre', accessor: (row) => row.name },
    { key: 'direccion', header: 'Dirección', accessor: (row) => row.address },
    {
      key: 'estado',
      header: 'Estado',
      accessor: (row) => (
        <ToggleSwitch
          isEnabled={row.active}
          onToggle={() => handleToggle(row.id, row.active)}
        />
      ),
    },
    {
      key: 'acciones', header: 'Acciones', accessor: (row) => (
        <MyGroupButtonsActions>
          <MyButtonShortAction type="view" title="Ver" onClick={() => openModal('view', row)} />
          <MyButtonShortAction type="edit" title="Editar" onClick={() => openModal('edit', row)} />
          <MyButtonShortAction type="delete" title="Eliminar" onClick={() => openModal('delete', row)} />
        </MyGroupButtonsActions>
      )
    },
  ];

  const getModalContentAndActions = () => {
    switch (modalType) {
      case 'view':
      case 'edit':
      case 'add':
        return {
          title:
            modalType === 'view'
              ? 'Detalles de la Capilla'
              : modalType === 'add'
              ? 'Añadir Capilla'
              : 'Editar Capilla',
          content: (
            <ChapelForm
              mode={modalType}
              initialData={currentChapel}
              onSave={handleSave}
            />
          ),
          onAccept:
            modalType === 'view'
              ? handleCloseModal
              : () => {
                  document.getElementById("chapel-form")?.requestSubmit();
                },
          onCancel: handleCloseModal
        };
      case 'delete':
        return {
          title: 'Confirmar eliminación',
          content: <h4>¿Estás seguro que quieres eliminar esta capilla?</h4>,
          onAccept: confirmDelete,
          onCancel: handleCloseModal
        };
      default:
        return { title: '', content: null, onAccept: null, onCancel: null };
    }
  };

  const modalProps = getModalContentAndActions();

  return (
    <div className="content-module only-this">
      <h2 className='title-screen'>Gestión de capillas</h2>
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Cargando...</div>}
      <div className="app-container">
        <div className="search-add">
          <div className="center-container">
            <SearchBar onSearchChange={setSearchTerm} />
          </div>
          <MyButtonShortAction type="add" onClick={() => openModal('add')} title="Añadir" />
        </div>
        <DynamicTable
          columns={chapelColumns}
          data={filteredChapels}
          gridColumnsLayout="90px 380px 1fr 140px 220px"
          columnLeftAlignIndex={[2, 3]}
        />
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
    </div>
  );
}

function ChapelForm({ mode, initialData, onSave }) {
  const [name, setName] = useState(initialData?.name || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [profilePhoto, setProfilePhoto] = useState(initialData?.profile_photo || '');
  const [coverPhoto, setCoverPhoto] = useState(initialData?.cover_photo || '');

  const handleFotoPerfilChange = (data) => setProfilePhoto(data ? data.name : "");
  const handleFotoPortadaChange = (data) => setCoverPhoto(data ? data.name : "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode !== 'view') {
      onSave({
        name,
        address,
        phone,
        profile_photo: profilePhoto,
        cover_photo: coverPhoto
      });
    }
  };

  const disabled = mode === 'view';

  return (
    <form id="chapel-form" onSubmit={handleSubmit}>
      <div className="Inputs">
        <label>Nombre de la capilla</label>
        <input
          type="text"
          className="inputModal"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={disabled}
          required
        />
        <label>Dirección</label>
        <textarea
          className="inputModal"
          value={address}
          onChange={e => setAddress(e.target.value)}
          disabled={disabled}
          required
        />
        <label>Teléfono</label>
        <input
          type="text"
          className="inputModal"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          disabled={disabled}
        />
        <label>Foto de perfil</label>
        <InputFotoPerfil
          onChange={handleFotoPerfilChange}
          placeholder="Subir foto de perfil de la capilla"
          disabled={disabled}
        />
        <label>Foto de portada</label>
        <InputFotoPerfil
          onChange={handleFotoPortadaChange}
          placeholder="Subir foto de portada de la capilla"
          disabled={disabled}
        />
      </div>
    </form>
  );
}
