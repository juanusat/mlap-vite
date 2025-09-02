import React, { useState } from 'react';
import MyButtonMediumIcon from '../components/MyButtonMediumIcon';
import MyPanelLateralConfig from '../components/MyPanelLateralConfig';
import '../components/UI.css';
import '../utils/spacing.css';
import SwitchToggleDoc from '../components/SwitchToggleDoc';
import MyModalConfirm from '../components/MyModalConfirm';
import MyButtonShortAction from '../components/MyButtonShortAction';
import MyGroupButtonsActions from '../components/MyGroupButtonsActions';
import MyList1 from '../components/MyList1';
import MyListItem1 from '../components/MyListItem1';
import TextInput from '../components/formsUI/TextInput';
import Textarea from '../components/formsUI/Textarea';

const initialDocs = [
  { id: 1, nombre: 'DNI', estado: 'Activo', descripcion: 'Documento Nacional de Identidad', nombreCorto: 'DNI' },
  { id: 2, nombre: 'Pasaporte', estado: 'Activo', descripcion: 'Pasaporte Internacional', nombreCorto: 'PI' },
  { id: 3, nombre: 'Carnet de Extranjería', estado: 'Baja', descripcion: 'Carnet de Extranjería', nombreCorto: 'CE' },
];

export default function TipoDocumentoGestionar() {
  // Visualiza el panel lateral en modo solo lectura
  const handleView = (id) => {
    const doc = docs.find(d => d.id === id);
    setEditDoc(doc);
    setFormValues({ nombre: doc.nombre, descripcion: doc.descripcion || '', nombreCorto: doc.nombreCorto || '' });
    setPanelMode('view');
    setPanelOpen(true);
  };
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState('add'); // 'add' o 'edit'
  const [editDoc, setEditDoc] = useState(null);
  const [formValues, setFormValues] = useState({ nombre: '', descripcion: '', nombreCorto: '' });
  const [docs, setDocs] = useState(initialDocs);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDocId, setModalDocId] = useState(null);
  const [modalAction, setModalAction] = useState('');

  // Edita el panel lateral en vez de abrir modal
  const handleEdit = (id) => {
    const doc = docs.find(d => d.id === id);
    setEditDoc(doc);
    setFormValues({ nombre: doc.nombre, descripcion: doc.descripcion || '', nombreCorto: doc.nombreCorto || '' });
    setPanelMode('edit');
    setPanelOpen(true); // El panel lateral se abre y se actualiza con los datos
  };

  const handleDelete = (id) => {
    setModalDocId(id);
    setModalAction('delete');
    setModalOpen(true);
  };

  const handleBaja = (id) => {
    setDocs(docs.map(doc => doc.id === id ? { ...doc, estado: 'Baja' } : doc));
  };

  const handleAlta = (id) => {
    setDocs(docs.map(doc => doc.id === id ? { ...doc, estado: 'Activo' } : doc));
  };

  const handleToggleConfirm = (id, action) => {
    setModalDocId(id);
    setModalAction(action);
    setModalOpen(true);
  };

  const handleModalConfirm = () => {
    if (modalAction === 'baja') handleBaja(modalDocId);
    if (modalAction === 'alta') handleAlta(modalDocId);
    if (modalAction === 'delete') setDocs(docs.filter(doc => doc.id !== modalDocId));
    setModalOpen(false);
    setModalDocId(null);
    setModalAction('');
  };

  const handleModalCancel = () => {
    setModalOpen(false);
    setModalDocId(null);
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
        setDocs([...docs, {
          id: Date.now(),
          nombre: formValues.nombre,
          descripcion: formValues.descripcion,
          nombreCorto: formValues.nombreCorto,
          estado: 'Activo',
        }]);
        setPanelOpen(false);
      }
    } else if (panelMode === 'edit' && editDoc) {
      setDocs(docs.map(doc => doc.id === editDoc.id ? {
        ...doc,
        nombre: formValues.nombre,
        descripcion: formValues.descripcion,
        nombreCorto: formValues.nombreCorto,
      } : doc));
      setPanelOpen(false);
      setEditDoc(null);
    }
  };

  const handlePanelCancel = () => {
    setPanelOpen(false);
    setEditDoc(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <div className="content-module">
        <h2 className='title-screen'>Tipos de Documentos</h2>
        <MyButtonMediumIcon text="Agregar" icon="MdAdd" onClick={handleAdd} />
        <div style={{ width: '100%' }}>
          <MyList1>
            {docs.map(doc => (
              <MyListItem1 key={doc.id} baja={doc.estado === 'Baja'}>
                <SwitchToggleDoc
                  checked={doc.estado === 'Activo'}
                  onChange={() => handleToggleConfirm(doc.id, doc.estado === 'Activo' ? 'baja' : 'alta')}
                />
                <span style={{ marginLeft: '12px', marginRight: 'auto' }}>{doc.nombre}</span>
                <MyGroupButtonsActions>
                  <MyButtonShortAction type="view" onClick={() => handleView(doc.id)} title="Visualizar" />
                  <MyButtonShortAction type="edit" onClick={() => handleEdit(doc.id)} title="Editar" />
                  <MyButtonShortAction type="delete" onClick={() => handleDelete(doc.id)} title="Eliminar" />
                </MyGroupButtonsActions>
              </MyListItem1>
            ))}
            <MyModalConfirm
              open={modalOpen}
              message={
                modalAction === 'baja'
                  ? '¿Desea dar de baja este tipo de documento?'
                  : modalAction === 'alta'
                    ? '¿Desea dar de alta este tipo de documento?'
                    : modalAction === 'delete'
                      ? '¿Seguro que quieres borrar este tipo de documento?'
                      : ''
              }
              onConfirm={handleModalConfirm}
              onCancel={handleModalCancel}
            />
          </MyList1>
        </div>
      </div>

      <MyPanelLateralConfig
        title={panelMode === 'add' ? 'Agregar Tipo de Documento' : panelMode === 'edit' ? 'Editar Tipo de Documento' : 'Visualizar Tipo de Documento'}
        doc={editDoc}
        mode={panelMode}
        onClose={handlePanelCancel}
        isOpen={panelOpen}
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
    </>
  );
}
