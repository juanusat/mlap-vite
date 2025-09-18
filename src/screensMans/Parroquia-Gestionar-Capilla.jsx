import React, { useState } from "react";
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import ToggleSwitch from "../components2/Toggle";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyButtonMediumIcon from "../components/MyButtonMediumIcon";
import InputFotoPerfil from '../components2/inputFotoPerfil';
import "../utils/Estilos-Generales-1.css";

const initialChapelsData = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    parish_id: 1,
    name: `Capilla ${i + 1}`,
    address: `Dirección de la Capilla ${i + 1}`,
    phone: "",
    profile_photo: "",
    cover_photo: "",
    active: (i + 1) % 2 === 0,
}));

export default function GestionCapillas() {
    const [chapels, setChapels] = useState(initialChapelsData);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [currentChapel, setCurrentChapel] = useState(null);
    const [modalType, setModalType] = useState(null);

    const filteredChapels = chapels.filter((chapel) =>
        Object.values(chapel).some((value) =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const handleToggle = (chapelId) => {
        setChapels(prevChapels =>
            prevChapels.map(chapel =>
                chapel.id === chapelId
                    ? { ...chapel, active: !chapel.active }
                    : chapel
            )
        );
    };

    const handleView = (chapel) => {
        setCurrentChapel(chapel);
        setModalType('view');
        setShowModal(true);
    };

    const handleEdit = (chapel) => {
        setCurrentChapel(chapel);
        setModalType('edit');
        setShowModal(true);
    };

    const handleDeleteConfirmation = (chapel) => {
        setCurrentChapel(chapel);
        setModalType('delete');
        setShowModal(true);
    };

    const handleAddChapel = () => {
        setCurrentChapel(null);
        setModalType('add');
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentChapel(null);
        setModalType(null);
    };

    const confirmDelete = () => {
        if (currentChapel) {
            setChapels(prevChapels => prevChapels.filter(chapel => chapel.id !== currentChapel.id));
            handleCloseModal();
        }
    };

    const handleSave = (chapelData) => {
        if (modalType === 'add') {
            const newChapel = { ...chapelData, id: chapels.length + 1, parish_id: 1, active: true };
            setChapels(prevChapels => [...prevChapels, newChapel]);
        } else if (modalType === 'edit' && currentChapel) {
            setChapels(prevChapels =>
                prevChapels.map(chapel =>
                    chapel.id === currentChapel.id ? { ...chapel, ...chapelData } : chapel
                )
            );
        }
        handleCloseModal();
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
                    onToggle={() => handleToggle(row.id)}
                />
            ),
        },
        {
            key: 'acciones', header: 'Acciones', accessor: (row) => (
                <MyGroupButtonsActions>
                    <MyButtonShortAction type="view" title="Ver" onClick={() => handleView(row)} />
                    <MyButtonShortAction type="edit" title="Editar" onClick={() => handleEdit(row)} />
                    <MyButtonShortAction type="delete" title="Eliminar" onClick={() => handleDeleteConfirmation(row)} />
                </MyGroupButtonsActions>
            )
        },
    ];

    const getModalContentAndActions = () => {
        switch (modalType) {
            case 'view':
                return {
                    title: 'Detalles de la Capilla',
                    content: currentChapel && (
                        <div>
                            <p><strong>ID:</strong> {currentChapel.id}</p>
                            <p><strong>Nombre:</strong> {currentChapel.name}</p>
                            <p><strong>Dirección:</strong> {currentChapel.address}</p>
                            {currentChapel.phone && <p><strong>Teléfono:</strong> {currentChapel.phone}</p>}
                            {currentChapel.profile_photo && <p><strong>Foto de perfil:</strong> {currentChapel.profile_photo}</p>}
                            {currentChapel.cover_photo && <p><strong>Foto de portada:</strong> {currentChapel.cover_photo}</p>}
                        </div>
                    ),
                    onAccept: handleCloseModal,
                    onCancel: handleCloseModal
                };
            case 'edit':
                return {
                    title: 'Editar capilla',
                    content: <EditChapelForm onSave={handleSave} chapel={currentChapel} />,
                    onAccept: () => document.getElementById('edit-chapel-form').requestSubmit(),
                    onCancel: handleCloseModal
                };
            case 'delete':
                return {
                    title: 'Confirmar eliminación',
                    content: <h4>¿Estás seguro que quieres eliminar esta capilla?</h4>,
                    onAccept: confirmDelete,
                    onCancel: handleCloseModal
                };
            case 'add':
                return {
                    title: 'Añadir capilla',
                    content: <AddChapelForm onSave={handleSave} />,
                    onAccept: () => document.getElementById('add-chapel-form').requestSubmit(),
                    onCancel: handleCloseModal
                };
            default:
                return {
                    title: '',
                    content: null,
                    onAccept: null,
                    onCancel: null
                };
        }
    };

    const modalProps = getModalContentAndActions();

    return (
        <div className="content-module only-this">
            <h2 className='title-screen'>Gestión de capillas</h2>
            <div className="app-container">
                <div className="search-add">
                    <div className="center-container">
                        <SearchBar onSearchChange={setSearchTerm} />
                    </div>
                    <MyButtonShortAction type="add" onClick={handleAddChapel} title="Añadir" />
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

// Formulario para añadir
function AddChapelForm({ onSave }) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [profilePhoto, setProfilePhoto] = useState('');
    const [coverPhoto, setCoverPhoto] = useState('');

    const handleFotoPerfilChange = (data) => {
        setProfilePhoto(data ? data.name : "");
        console.log("Foto de perfil seleccionada:", data);
    };

    const handleFotoPortadaChange = (data) => {
        setCoverPhoto(data ? data.name : "");
        console.log("Foto de portada seleccionada:", data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, address, phone, profile_photo: profilePhoto, cover_photo: coverPhoto });
    };

    return (
        <form id="add-chapel-form" onSubmit={handleSubmit}>
            <div className="Inputs-add">
                <label htmlFor="addName">Nombre de la capilla</label>
                <input type="text" className="inputModal" id="addName" value={name} onChange={e => setName(e.target.value)} required />
                <label htmlFor="addAddress">Dirección</label>
                <textarea className="inputModal" id="addAddress" value={address} onChange={e => setAddress(e.target.value)} required />
                <label htmlFor="addPhone">Teléfono</label>
                <input type="text" className="inputModal" id="addPhone" value={phone} onChange={e => setPhone(e.target.value)} />
                <label htmlFor="addProfile">Foto de perfil</label>
                <InputFotoPerfil onChange={handleFotoPerfilChange} placeholder="Subir foto de perfil de la capilla" maxSize={5 * 1024 * 1024} acceptedFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']} />
                <label htmlFor="addCover">Foto de portada</label>
                <InputFotoPerfil onChange={handleFotoPortadaChange} placeholder="Subir foto de portada de la capilla" maxSize={10 * 1024 * 1024} acceptedFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']} />
            </div>
        </form>
    );
}

// Formulario para editar
function EditChapelForm({ onSave, chapel }) {
    const [name, setName] = useState(chapel.name);
    const [address, setAddress] = useState(chapel.address);
    const [phone, setPhone] = useState(chapel.phone || "");
    const [profilePhoto, setProfilePhoto] = useState(chapel.profile_photo || "");
    const [coverPhoto, setCoverPhoto] = useState(chapel.cover_photo || "");

    const handleFotoPerfilChange = (data) => {
        setProfilePhoto(data ? data.name : "");
        console.log("Foto de perfil seleccionada:", data);
    };

    const handleFotoPortadaChange = (data) => {
        setCoverPhoto(data ? data.name : "");
        console.log("Foto de portada seleccionada:", data);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, address, phone, profile_photo: profilePhoto, cover_photo: coverPhoto });
    };

    return (
        <form id="edit-chapel-form" onSubmit={handleSubmit}>
            <div className="Inputs-edit">
                <label htmlFor="editName">Nuevo nombre</label>
                <input type="text" className="inputModal" id="editName" value={name} onChange={e => setName(e.target.value)} required />
                <label htmlFor="editAddress">Nueva dirección</label>
                <textarea className="inputModal" id="editAddress" value={address} onChange={e => setAddress(e.target.value)} required />
                <label htmlFor="editPhone">Teléfono</label>
                <input type="text" className="inputModal" id="editPhone" value={phone} onChange={e => setPhone(e.target.value)} />
                <label htmlFor="editProfile">Foto de perfil</label>
                <InputFotoPerfil onChange={handleFotoPerfilChange} placeholder="Subir foto de perfil de la capilla" maxSize={5 * 1024 * 1024} acceptedFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']} />
                <label htmlFor="editCover">Foto de portada</label>
                <InputFotoPerfil onChange={handleFotoPortadaChange} placeholder="Subir foto de portada de la capilla" maxSize={10 * 1024 * 1024} acceptedFormats={['image/jpeg', 'image/jpg', 'image/png', 'image/webp']} />
            </div>
        </form>
    );
}