import React, { useState } from "react";
import DynamicTable from "../components2/Tabla";
import SearchBar from "../components2/SearchBar";
import ToggleSwitch from "../components2/Toggle";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyButtonMediumIcon from "../components/MyButtonMediumIcon";
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

    return (
        <div className="content-module only-this">
            <h2 className='title-screen'>Gestión de Capillas</h2>
            <div className="app-container">
                <div className="search-add">
                    <div className="center-container">
                        <SearchBar onSearchChange={setSearchTerm} />
                    </div>
                    <MyButtonShortAction type="add" onClick={handleAddChapel} title="Añadir" />
                </div>
                <DynamicTable columns={chapelColumns} data={filteredChapels}
                    gridColumnsLayout="90px 380px 1fr 140px 220px"
                    columnLeftAlignIndex={[2,3]}/>
            </div>
            <Modal
                show={showModal}
                onClose={handleCloseModal}
                title={
                    modalType === 'view' ? 'Detalles de la Capilla' :
                        modalType === 'edit' ? 'Editar Capilla' :
                            modalType === 'delete' ? 'Confirmar Eliminación' :
                                'Añadir Capilla'
                }
            >
                {modalType === 'view' && currentChapel && (
                    <div>
                        <p><strong>ID:</strong> {currentChapel.id}</p>
                        <p><strong>Nombre:</strong> {currentChapel.name}</p>
                        <p><strong>Dirección:</strong> {currentChapel.address}</p>
                        {currentChapel.phone && <p><strong>Teléfono:</strong> {currentChapel.phone}</p>}
                        {currentChapel.profile_photo && <p><strong>Foto de perfil:</strong> {currentChapel.profile_photo}</p>}
                        {currentChapel.cover_photo && <p><strong>Foto de portada:</strong> {currentChapel.cover_photo}</p>}
                    </div>
                )}

                {modalType === 'edit' && currentChapel && (
                    <EditChapelForm onSave={handleSave} onClose={handleCloseModal} chapel={currentChapel} />
                )}

                {modalType === 'delete' && currentChapel && (
                    <div>
                        <h4>¿Estás seguro que quieres eliminar esta capilla?</h4>
                        <div className="buttons-container">
                            <MyButtonMediumIcon text="Cancelar" icon="MdClose" onClick={handleCloseModal} />
                            <MyButtonMediumIcon text="Eliminar" icon="MdAccept" onClick={confirmDelete} />
                        </div>
                    </div>
                )}

                {modalType === 'add' && (
                    <AddChapelForm onSave={handleSave} onClose={handleCloseModal} />
                )}
            </Modal>
        </div>
    );
}

// Formulario para añadir solo name y address
function AddChapelForm({ onSave, onClose }) {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [profile_photo, setProfilePhoto] = useState('');
    const [cover_photo, setCoverPhoto] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, address, phone: "", profile_photo: "", cover_photo: "" });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="Inputs-add">
                <label htmlFor="addName">Nombre de la capilla</label>
                <input type="text" className="inputModal" id="addName" value={name} onChange={e => setName(e.target.value)} required />
                <label htmlFor="addAddress">Dirección</label>
                <textarea className="inputModal" id="addAddress" value={address} onChange={e => setAddress(e.target.value)} required />
                <label htmlFor="addPhone">Teléfono</label>
                <input type="text" className="inputModal" id="addPhone" value={phone} onChange={e => setPhone(e.target.value)} />
                <label htmlFor="addProfile">Foto de perfil (URL)</label>
                <input type="text" className="inputModal" id="addProfile" value={profile_photo} onChange={e => setProfilePhoto(e.target.value)} />
                <label htmlFor="addCover">Foto de portada (URL)</label>
                <input type="text" className="inputModal" id="addCover" value={cover_photo} onChange={e => setCoverPhoto(e.target.value)} />
            </div>
            <div className="buttons-container">
                <MyButtonMediumIcon text="Cerrar" icon="MdClose" onClick={onClose} />
                <MyButtonMediumIcon type="submit" text="Guardar" icon="MdOutlineSaveAs" />
            </div>
        </form>
    );
}

// Formulario para editar más campos
function EditChapelForm({ onSave, onClose, chapel }) {
    const [name, setName] = useState(chapel.name);
    const [address, setAddress] = useState(chapel.address);
    const [phone, setPhone] = useState(chapel.phone || "");
    const [profilePhoto, setProfilePhoto] = useState(chapel.profile_photo || "");
    const [coverPhoto, setCoverPhoto] = useState(chapel.cover_photo || "");

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, address, phone, profile_photo: profilePhoto, cover_photo: coverPhoto });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>Formulario de Edición de Capilla</h3>
            <div className="Inputs-edit">
                <label htmlFor="editName">Nuevo nombre</label>
                <input type="text" className="inputModal" id="editName" value={name} onChange={e => setName(e.target.value)} required />

                <label htmlFor="editAddress">Nueva dirección</label>
                <textarea className="inputModal" id="editAddress" value={address} onChange={e => setAddress(e.target.value)} required />

                <label htmlFor="editPhone">Teléfono</label>
                <input type="text" className="inputModal" id="editPhone" value={phone} onChange={e => setPhone(e.target.value)} />

                <label htmlFor="editProfile">Foto de perfil (URL)</label>
                <input type="text" className="inputModal" id="editProfile" value={profilePhoto} onChange={e => setProfilePhoto(e.target.value)} />

                <label htmlFor="editCover">Foto de portada (URL)</label>
                <input type="text" className="inputModal" id="editCover" value={coverPhoto} onChange={e => setCoverPhoto(e.target.value)} />
            </div>
            <div className="buttons-container">
                <MyButtonMediumIcon text="Cerrar" icon="MdClose" onClick={onClose} />
                <MyButtonMediumIcon type="submit" text="Guardar" icon="MdOutlineSaveAs" />
            </div>
        </form>
    );
}
