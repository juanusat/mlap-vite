import React, { useState } from 'react';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import MyPanelLateralConfig from '../components/MyPanelLateralConfig';
import '../components/UI.css';
import '../utils/spacing.css';
import SwitchToggleDoc from '../components/SwitchToggleDoc'; // Lo usamos para los actos
import MyModalConfirm from '../components/MyModalConfirm';
import MyButtonShortAction from '../components/MyButtonShortAction';
import MyGroupButtonsActions from '../components/MyGroupButtonsActions';
import MyList1 from '../components/MyList1';
import MyListItem1 from '../components/MyListItem1';
import TextInput from '../components/formsUI/TextInput';
import Textarea from '../components/formsUI/Textarea';

const initialActos = [
    { id: 1, nombre: 'Bautizo', estado: 'Activo', descripcion: 'Acto de iniciación cristiana', nombreCorto: 'Btz' },
    { id: 2, nombre: 'Comunión', estado: 'Activo', descripcion: 'Primera Comunión', nombreCorto: 'Cmn' },
    { id: 3, nombre: 'Matrimonio', estado: 'Activo', descripcion: 'Sacramento del Matrimonio', nombreCorto: 'Mtr' },
    { id: 4, nombre: 'Confirmación', estado: 'Activo', descripcion: 'Sacramento de la Confirmación', nombreCorto: 'Cfm' },
];

export default function GestionActos() {
    // Estados para la lista y el panel lateral
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelMode, setPanelMode] = useState('add'); // 'add' | 'edit' | 'view'
    const [editActo, setEditActo] = useState(null);
    const [formValues, setFormValues] = useState({ nombre: '', descripcion: '', nombreCorto: '' });
    const [actos, setActos] = useState(initialActos);

    // Estados para el modal de confirmación (baja, alta, eliminar)
    const [modalOpen, setModalOpen] = useState(false);
    const [modalActoId, setModalActoId] = useState(null);
    const [modalAction, setModalAction] = useState('');

    const handleView = (id) => {
        const acto = actos.find(a => a.id === id);
        setEditActo(acto);
        setFormValues({ nombre: acto.nombre, descripcion: acto.descripcion || '', nombreCorto: acto.nombreCorto || '' });
        setPanelMode('view');
        setPanelOpen(true);
    };

    const handleEdit = (id) => {
        const acto = actos.find(a => a.id === id);
        setEditActo(acto);
        setFormValues({ nombre: acto.nombre, descripcion: acto.descripcion || '', nombreCorto: acto.nombreCorto || '' });
        setPanelMode('edit');
        setPanelOpen(true);
    };

    const handleDelete = (id) => {
        setModalActoId(id);
        setModalAction('delete');
        setModalOpen(true);
    };

    const handleBaja = (id) => {
        setActos(actos.map(acto => acto.id === id ? { ...acto, estado: 'Baja' } : acto));
    };

    const handleAlta = (id) => {
        setActos(actos.map(acto => acto.id === id ? { ...acto, estado: 'Activo' } : acto));
    };

    const handleToggleConfirm = (id, action) => {
        setModalActoId(id);
        setModalAction(action);
        setModalOpen(true);
    };

    const handleModalConfirm = () => {
        if (modalAction === 'baja') handleBaja(modalActoId);
        if (modalAction === 'alta') handleAlta(modalActoId);
        if (modalAction === 'delete') setActos(actos.filter(acto => acto.id !== modalActoId));
        setModalOpen(false);
        setModalActoId(null);
        setModalAction('');
    };

    const handleModalCancel = () => {
        setModalOpen(false);
        setModalActoId(null);
        setModalAction('');
    };

    const handleAdd = () => {
        setFormValues({ nombre: '', descripcion: '', nombreCorto: '' });
        setPanelMode('add');
        setPanelOpen(true);
    };
    
    const handlePanelSave = () => {
        if (panelMode === 'add') {
            if (formValues.nombre.trim()) {
                setActos([...actos, {
                    id: Date.now(),
                    nombre: formValues.nombre,
                    descripcion: formValues.descripcion,
                    nombreCorto: formValues.nombreCorto,
                    estado: 'Activo',
                }]);
                setPanelOpen(false);
            }
        } else if (panelMode === 'edit' && editActo) {
            setActos(actos.map(acto => acto.id === editActo.id ? {
                ...acto,
                nombre: formValues.nombre,
                descripcion: formValues.descripcion,
                nombreCorto: formValues.nombreCorto,
            } : acto));
            setPanelOpen(false);
            setEditActo(null);
        }
    };

    const handlePanelCancel = () => {
        setPanelOpen(false);
        setEditActo(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormValues(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <div className="content-module only-this">
                <h2 className='title-screen'>Gestionar Actos Litúrgicos</h2>
                <MyButtonMediumIcon text="Agregar" icon="MdAdd" onClick={handleAdd} />
                <div style={{ width: '100%' }}>
                    <MyList1>
                        {actos.map(acto => (
                            <MyListItem1 key={acto.id} baja={acto.estado === 'Baja'}>
                                <SwitchToggleDoc
                                    checked={acto.estado === 'Activo'}
                                    onChange={() => handleToggleConfirm(acto.id, acto.estado === 'Activo' ? 'baja' : 'alta')}
                                />
                                <span style={{ marginLeft: '12px', marginRight: 'auto' }}>{acto.nombre}</span>
                                <MyGroupButtonsActions>
                                    <MyButtonShortAction type="view" onClick={() => handleView(acto.id)} title="Visualizar" />
                                    <MyButtonShortAction type="edit" onClick={() => handleEdit(acto.id)} title="Editar" />
                                    <MyButtonShortAction type="delete" onClick={() => handleDelete(acto.id)} title="Eliminar" />
                                </MyGroupButtonsActions>
                            </MyListItem1>
                        ))}
                    </MyList1>
                </div>
            </div>

            {panelOpen && (
                <MyPanelLateralConfig
                    title={panelMode === 'add' ? 'Agregar Tipo de Acto' : panelMode === 'edit' ? 'Editar Tipo de Acto' : 'Visualizar Tipo de Acto'}
                >
                    <form className="panel-config-form" onSubmit={e => { e.preventDefault(); handlePanelSave(); }}>
                        <TextInput
                            label="Nombre"
                            name="nombre"
                            value={formValues.nombre}
                            onChange={handleFormChange}
                            required
                            disabled={panelMode === 'view'}
                        />
                        <Textarea
                            label="Descripción"
                            name="descripcion"
                            value={formValues.descripcion}
                            onChange={handleFormChange}
                            disabled={panelMode === 'view'}
                            rows={3}
                        />
                        <TextInput
                            label="Nombre Corto"
                            name="nombreCorto"
                            value={formValues.nombreCorto}
                            onChange={handleFormChange}
                            disabled={panelMode === 'view'}
                        />
                        <div className="panel-config-actions">
                            {panelMode !== 'view' && (
                                <MyButtonMediumIcon text="Guardar" icon="MdOutlineSaveAs" type="submit" />
                            )}
                            <MyButtonMediumIcon text="Cancelar" icon="MdClose" type="button" onClick={handlePanelCancel} />
                        </div>
                    </form>
                </MyPanelLateralConfig>
            )}
            
            <MyModalConfirm
                open={modalOpen}
                message={
                    modalAction === 'baja'
                        ? '¿Desea dar de baja este tipo de acto?'
                        : modalAction === 'alta'
                            ? '¿Desea dar de alta este tipo de acto?'
                            : modalAction === 'delete'
                                ? '¿Seguro que quieres borrar este tipo de acto?'
                                : ''
                }
                onConfirm={handleModalConfirm}
                onCancel={handleModalCancel}
            />
        </>
    );
}