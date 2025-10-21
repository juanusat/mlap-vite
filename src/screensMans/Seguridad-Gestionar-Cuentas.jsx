import React, { useState } from "react";
import DynamicTable from "../components/Tabla";
import SearchBar from "../components/SearchBar";
import ToggleSwitch from "../components/Toggle";
import Modal from "../components2/Modal";
import MyGroupButtonsActions from "../components2/MyGroupButtonsActions";
import MyButtonShortAction from "../components2/MyButtonShortAction";
import MyPanelLateralConfig from '../components/MyPanelLateralConfig';
import "../utils/Estilos-Generales-1.css";
import "../utils/Seguridad-Cuentas-Gestionar.css";

const allRoles = ["Administrador", "Secretario", "Vicario", "Editor"];

// Simulación de usuarios iniciales
const initialUsers = Array.from({ length: 20 }, (_, i) => {
  const userRoles = [allRoles[i % allRoles.length]];
  return {
    id: i + 1,
    username: `Usuario${i + 1}`,
    lastName: `Apellido${i + 1}`,
    email: `usuario${i + 1}@example.com`,
    isEnabled: true,
    roles: userRoles,
  };
});

export default function CuentasGestionar() {
    React.useEffect(() => {
    document.title = "MLAP | Gestionar cuentas";
  }, []);
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  // Estado de formulario
  const [formData, setFormData] = useState({
    email: '',
    role: ''
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Abrir modal según acción
  const handleOpenModal = (user, action) => {
    setCurrentUser(user);
    setModalType(action);

    if (action === "invite") {
      setFormData({ email: '', role: '' });
    } else if (action === "addRole" && user) {
      setFormData({ email: user.email, role: '' });
    }

    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentUser(null);
    setModalType(null);
    setFormData({ email: '', role: '' });
  };

  const handleViewRoles = (user) => {
    setCurrentUser(user);
    setShowSidebar(true);
  };

  const handleCloseSidebar = () => {
    setShowSidebar(false);
    setCurrentUser(null);
  };

  // Guardar cambios en modal
  const handleSave = () => {
    if (modalType === "invite") {
      const newUser = {
        id: users.length + 1,
        username: formData.email.split('@')[0],
        lastName: '',
        email: formData.email,
        isEnabled: true,
        roles: ['Secretario'],
      };
      setUsers(prev => [...prev, newUser]);
    } else if (modalType === "addRole" && currentUser) {
      setUsers(prev =>
        prev.map(u =>
          u.id === currentUser.id ? { ...u, roles: [...u.roles, formData.role] } : u
        )
      );
    }
    handleCloseModal();
  };

  const confirmDelete = () => {
    if (currentUser) {
      setUsers(prev => prev.filter(u => u.id !== currentUser.id));
      handleCloseModal();
    }
  };

  const handleDeleteRole = (role) => {
    if (!currentUser) return;
    setUsers(prev =>
      prev.map(u =>
        u.id === currentUser.id
          ? { ...u, roles: u.roles.filter(r => r !== role) }
          : u
      )
    );
    setCurrentUser(prev => ({
      ...prev,
      roles: prev.roles.filter(r => r !== role)
    }));
  };

  const handleToggle = (id) => {
    setUsers(prev =>
      prev.map(u =>
        u.id === id ? { ...u, isEnabled: !u.isEnabled } : u
      )
    );
  };

  // Columnas de tabla
  const columns = [
    { key: 'id', header: 'ID', accessor: (u) => u.id },
    { key: 'username', header: 'Nombre', accessor: (u) => u.username },
    { key: 'lastName', header: 'Apellidos', accessor: (u) => u.lastName },
    { key: 'email', header: 'Correo', accessor: (u) => u.email },
    {
      key: 'estado',
      header: 'Estado',
      accessor: (u) => (
        <ToggleSwitch
          isEnabled={u.isEnabled}
          onToggle={() => handleToggle(u.id)}
        />
      ),
    },
    {
      key: 'acciones',
      header: 'Acciones',
      accessor: (u) => (
        <MyGroupButtonsActions>
          <MyButtonShortAction type="view" title="Ver roles" onClick={() => handleViewRoles(u)} />
          <MyButtonShortAction type="file" title="Añadir rol" onClick={() => handleOpenModal(u, "addRole")} />
          <MyButtonShortAction type="delete" title="Eliminar usuario" onClick={() => handleOpenModal(u, "delete")} />
        </MyGroupButtonsActions>
      ),
    },
  ];

  // Contenido de modal dinámico
  const getModalContentAndActions = () => {
    switch (modalType) {
      case "invite":
        return {
          title: "Invitar usuario",
          content: <UserForm formData={formData} handleFormChange={handleFormChange} mode="invite" />,
          onAccept: handleSave,
          onCancel: handleCloseModal
        };
      case "addRole":
        return {
          title: "Añadir rol",
          content: (
            <UserForm
              formData={formData}
              handleFormChange={handleFormChange}
              mode="addRole"
              availableRoles={allRoles.filter(r => !currentUser?.roles.includes(r))}
            />
          ),
          onAccept: handleSave,
          onCancel: handleCloseModal
        };
      case "delete":
        return {
          title: "Eliminar usuario",
          content: <h4>¿Deseas eliminar este usuario permanentemente?</h4>,
          onAccept: confirmDelete,
          onCancel: handleCloseModal
        };
      default:
        return { title: "", content: null, onAccept: null, onCancel: handleCloseModal };
    }
  };

  const modalProps = getModalContentAndActions();

  return (
    <>
      <div className="content-module only-this">
        <h2 className="title-screen">Gestión de cuentas</h2>
        <div className="app-container">
          <div className="search-add">
            <div className="center-container">
              <SearchBar onSearchChange={setSearchTerm} />
            </div>
            <MyButtonShortAction type="add" onClick={() => handleOpenModal(null, "invite")} title="Añadir usuario" />
          </div>
          <DynamicTable
            columns={columns}
            data={filteredUsers}
            gridColumnsLayout="90px 350px 380px 1fr 140px 220px"
            columnLeftAlignIndex={[2, 3, 4]}
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

      {showSidebar && currentUser && (
        <MyPanelLateralConfig>
          <div className="panel-lateral-header">
            <h2 className="sidebar-title">{`Roles de ${currentUser.username}`}</h2>
            <MyButtonShortAction type="close" title="Cerrar" onClick={handleCloseSidebar} />
          </div>
          <div className="sidebar-list">
            {currentUser.roles.map((r) => (
              <div key={`${currentUser.id}-${r}`} className="sidebar-list-item">
                {r}
                <MyButtonShortAction type="delete" title="Eliminar rol" onClick={() => handleDeleteRole(r)} />
              </div>
            ))}
          </div>
        </MyPanelLateralConfig>
      )}
    </>
  );
}

// Formulario reutilizable
const UserForm = ({ formData, handleFormChange, mode, availableRoles = [] }) => {
  return (
    <div className="Inputs-add">
      {mode === "invite" && (
        <>
          <label htmlFor="email">Correo electrónico:</label>
          <input
            type="email"
            className="inputModal"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleFormChange}
            required
          />
        </>
      )}

      {mode === "addRole" && (
        <>
          <label htmlFor="role">Selecciona un rol:</label>
          <select
            id="role"
            name="role"
            className="inputModal"
            value={formData.role}
            onChange={handleFormChange}
            required
          >
            <option value="">Seleccione un rol</option>
            {availableRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};
