import React, { useState } from 'react';
import '../components/UI.css';
import '../utils/spacing.css';
import ScreenMan from '../components/ScreenMan';

const initialDocs = [
  { id: 1, nombre: 'DNI', estado: 'Activo' },
  { id: 2, nombre: 'Pasaporte', estado: 'Activo' },
  { id: 3, nombre: 'Carnet de Extranjería', estado: 'Baja' },
];

export default function tipoDocumento() {
  const [docs, setDocs] = useState(initialDocs);
  const [nuevoNombre, setNuevoNombre] = useState('');

  const handleEdit = (id) => {
    const nombre = prompt('Nuevo nombre:');
    if (nombre) {
      setDocs(docs.map(doc => doc.id === id ? { ...doc, nombre } : doc));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que quieres borrar este tipo de documento?')) {
      setDocs(docs.filter(doc => doc.id !== id));
    }
  };

  const handleBaja = (id) => {
    setDocs(docs.map(doc => doc.id === id ? { ...doc, estado: 'Baja' } : doc));
  };

  const handleAlta = (id) => {
    setDocs(docs.map(doc => doc.id === id ? { ...doc, estado: 'Activo' } : doc));
  };

  const handleAdd = () => {
    if (nuevoNombre.trim()) {
      setDocs([...docs, { id: Date.now(), nombre: nuevoNombre, estado: 'Activo' }]);
      setNuevoNombre('');
    }
  };

  return (
    <ScreenMan>
      <div className="ui-card ui-card-docs">
        <h2>Tipos de Documentos</h2>
        <div className="ui-docs-list">
          {docs.map(doc => (
            <div key={doc.id} className={`ui-doc-item ${doc.estado === 'Baja' ? 'ui-doc-baja' : ''}`}>
              <span>{doc.nombre}</span>
              <span className="ui-doc-estado">{doc.estado}</span>
              <button onClick={() => handleEdit(doc.id)}>Editar</button>
              <button onClick={() => handleDelete(doc.id)}>Eliminar</button>
              {doc.estado === 'Activo' ? (
                <button onClick={() => handleBaja(doc.id)}>Dar de baja</button>
              ) : (
                <button onClick={() => handleAlta(doc.id)}>Dar de alta</button>
              )}
            </div>
          ))}
        </div>
        <div className="ui-docs-add">
          <input
            type="text"
            value={nuevoNombre}
            onChange={e => setNuevoNombre(e.target.value)}
            placeholder="Nuevo tipo de documento"
          />
          <button onClick={handleAdd}>Agregar</button>
        </div>
      </div>
    </ScreenMan>
  );
}
