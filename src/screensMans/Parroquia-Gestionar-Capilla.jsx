import React, { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import { FaMapMarkedAlt } from 'react-icons/fa';
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import ToggleSwitch from "../components/Toggle";
import Modal from "../components/Modal";
import MyGroupButtonsActions from "../components/MyGroupButtonsActions";
import MyButtonShortAction from "../components/MyButtonShortAction";
import InputFotoPerfil from '../components/inputFotoPerfil';
import MyModalGreatSize from '../components/MyModalGreatSize';
import MyMapSelector from '../components/MyMapSelector';
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
  const [coordinates, setCoordinates] = useState(initialData?.coordinates || '');
  const [phone, setPhone] = useState(initialData?.phone || '');
  const [profilePhoto, setProfilePhoto] = useState(initialData?.profile_photo || '');
  const [coverPhoto, setCoverPhoto] = useState(initialData?.cover_photo || '');

  // Estados para el modal del mapa
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);

  const parseCoordinates = (coordString) => {
    if (!coordString) return [0, 0];
    const parts = coordString.split(',').map(s => parseFloat(s.trim()));
    return parts.length === 2 ? parts : [0, 0];
  };

  const handleFotoPerfilChange = (data) => setProfilePhoto(data ? data.name : "");
  const handleFotoPortadaChange = (data) => setCoverPhoto(data ? data.name : "");

  // Funciones para el modal del mapa
  const handleOpenMapModal = () => {
    setShowMapModal(true);
    if (coordinates) {
      const coords = parseCoordinates(coordinates);
      setSelectedCoordinates({ lat: coords[0].toFixed(6), lng: coords[1].toFixed(6) });
    }
  };

  const handleCloseMapModal = () => {
    setShowMapModal(false);
    setSelectedCoordinates(null);
  };

  const handleMapClick = (coords) => {
    setSelectedCoordinates(coords);
  };

  const handleConfirmLocation = () => {
    if (selectedCoordinates) {
      const coordsString = `${selectedCoordinates.lat}, ${selectedCoordinates.lng}`;
      setCoordinates(coordsString);
      handleCloseMapModal();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode !== 'view') {
      onSave({
        name,
        address,
        coordinates,
        phone,
        profile_photo: profilePhoto,
        cover_photo: coverPhoto
      });
    }
  };

  const disabled = mode === 'view';

  return (
    <>
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
        <label>Coordenadas</label>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            className="inputModal"
            value={coordinates}
            onChange={e => setCoordinates(e.target.value)}
            disabled={disabled}
            placeholder="Latitud, Longitud"
            style={{ 
              flex: '0 1 55%',
              fontSize: '13px',
              padding: '8px'
            }}
          />
          {!disabled && (
            <button
              type="button"
              className="btn-select-location"
              onClick={handleOpenMapModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontSize: '13px',
                flex: '0 0 auto'
              }}
            >
              <FaMapMarkedAlt size={14} />
              Seleccionar ubicación
            </button>
          )}
        </div>
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
    
    <MapModalPortal 
      showMapModal={showMapModal}
      handleCloseMapModal={handleCloseMapModal}
      handleConfirmLocation={handleConfirmLocation}
      selectedCoordinates={selectedCoordinates}
      handleMapClick={handleMapClick}
      coordinates={coordinates}
      parseCoordinates={parseCoordinates}
    />
    </>
  );
}

function MapModalPortal({ showMapModal, handleCloseMapModal, handleConfirmLocation, selectedCoordinates, handleMapClick, coordinates, parseCoordinates }) {
  if (!showMapModal) return null;

  return createPortal(
    <MyModalGreatSize open={showMapModal} onClose={handleCloseMapModal}>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ 
          padding: '10px 20px', 
          borderBottom: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0 }}>Seleccionar Ubicación de la Capilla</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleConfirmLocation}
              disabled={!selectedCoordinates}
              style={{
                padding: '8px 20px',
                backgroundColor: selectedCoordinates ? '#4CAF50' : '#ccc',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: selectedCoordinates ? 'pointer' : 'not-allowed'
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <MyMapSelector
            onMapClick={handleMapClick}
            selectedCoordinates={selectedCoordinates}
            initialCenter={coordinates ? parseCoordinates(coordinates) : [-6.77, -79.84]}
          />
        </div>
      </div>
    </MyModalGreatSize>,
    document.body
  );
}
