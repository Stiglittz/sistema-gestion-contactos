'use client';

import { useUsuarios } from './hooks/useUsuarios';
import { useContactos } from './hooks/useContactos';

import ConfirmDialog from './components/ui/ConfirmDialog';
import Header from './components/layout/Header';
import UserList from './components/usuarios/UserList';
import UserForm from './components/usuarios/UserForm';
import ContactList from './components/contactos/ContactList';
import ContactForm from './components/contactos/ContactForm';

export default function Dashboard() {
  // Hook personalizado para usuarios
  const {
    usuarios,
    usuarioSeleccionado, 
    loading,
    modalAbierto,
    modoEdicion,
    usuarioAEditar,
    modalEliminar,
    usuarioAEliminar,
    formData,
    enviandoForm,
    errorForm,
    eliminandoUsuario,
    seleccionarUsuario,
    abrirModal,
    abrirModalEditar,
    cerrarModal,
    manejarCambioInput,
    guardarUsuario,
    confirmarEliminar,
    cancelarEliminar,
    eliminarUsuario
  } = useUsuarios();

  // Hook personalizado para contactos
  const {
    contactos,
    modalContactoAbierto,
    modoEdicionContacto,
    contactoAEditar,
    modalEliminarContacto,
    contactoAEliminar,
    formDataContacto,
    enviandoFormContacto,
    errorFormContacto,
    eliminandoContacto,
    cargarContactos,
    abrirModalContacto,
    abrirModalEditarContacto,
    cerrarModalContacto,
    manejarCambioInputContacto,
    guardarContacto,
    confirmarEliminarContacto,
    cancelarEliminarContacto,
    eliminarContacto,
    limpiarContactos
  } = useContactos();

  // Función mejorada para seleccionar usuario y cargar sus contactos
  const seleccionarUsuarioYCargarContactos = async (usuario) => {
    // Si se selecciona el mismo usuario, no hacer nada
    if (usuarioSeleccionado && usuarioSeleccionado._id === usuario._id) {
      return;
    }

    // Seleccionar el usuario (viene del hook useUsuarios)
    seleccionarUsuario(usuario);
    
    // Cargar contactos del usuario seleccionado (viene del hook useContactos)
    await cargarContactos(usuario._id);
  };

  // Función para manejar cuando se deselecciona un usuario
  const manejarDeseleccionUsuario = () => {
    seleccionarUsuario(null);
    limpiarContactos();
  };

  // Función wrapper para guardar contacto que pasa el usuarioId
  const manejarGuardarContacto = async (e) => {
    if (!usuarioSeleccionado) return;
    await guardarContacto(e, usuarioSeleccionado._id);
  };

  // Función wrapper para eliminar contacto que pasa el usuarioId
  const manejarEliminarContacto = async () => {
    if (!usuarioSeleccionado) return;
    await eliminarContacto(usuarioSeleccionado._id);
  };

  // ======================= RENDER =======================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Layout Principal */}
      <div className="flex h-[calc(100vh-73px)]">
        
        {/* Sidebar - Lista de Usuarios */}
        <UserList
          usuarios={usuarios}
          usuarioSeleccionado={usuarioSeleccionado}
          onSeleccionarUsuario={seleccionarUsuarioYCargarContactos}
          onAbrirModal={abrirModal}
          onAbrirModalEditar={abrirModalEditar}
          onConfirmarEliminar={confirmarEliminar}
        />

        {/* Panel Principal - Contactos */}
        <main className="flex-1 overflow-y-auto">
          <ContactList
            usuario={usuarioSeleccionado}
            contactos={contactos}
            onAbrirModalContacto={abrirModalContacto}
            onEditarContacto={abrirModalEditarContacto}
            onEliminarContacto={confirmarEliminarContacto}
          />
        </main>
      </div>

      {/* Modal para crear/editar usuario */}
      <UserForm
        isOpen={modalAbierto}
        onClose={cerrarModal}
        onSubmit={guardarUsuario}
        formData={formData}
        onInputChange={manejarCambioInput}
        isLoading={enviandoForm}
        error={errorForm}
        isEditMode={modoEdicion}
      />

      {/* Modal de confirmación para eliminar usuario */}
      <ConfirmDialog
        isOpen={modalEliminar}
        onClose={cancelarEliminar}
        onConfirm={eliminarUsuario}
        title="🗑️ Eliminar Usuario"
        icon="⚠️"
        itemName={usuarioAEliminar?.nombre}
        itemSubtitle={usuarioAEliminar?.email}
        warningMessage="Esta acción eliminará el usuario y todos sus contactos asociados. No se puede deshacer."
        confirmText="Eliminar"
        isLoading={eliminandoUsuario}
        confirmButtonColor="red"
      />

      {/* Modal para crear/editar contacto */}
      <ContactForm
        isOpen={modalContactoAbierto}
        onClose={cerrarModalContacto}
        onSubmit={manejarGuardarContacto}
        formData={formDataContacto}
        onInputChange={manejarCambioInputContacto}
        isLoading={enviandoFormContacto}
        error={errorFormContacto}
        isEditMode={modoEdicionContacto}
        usuario={usuarioSeleccionado}
      />

      {/* Modal de confirmación para eliminar contacto */}
      <ConfirmDialog
        isOpen={modalEliminarContacto}
        onClose={cancelarEliminarContacto}
        onConfirm={manejarEliminarContacto}
        title="🗑️ Eliminar Contacto"
        icon="📞"
        itemName={contactoAEliminar?.nombre}
        itemSubtitle={`📱 ${contactoAEliminar?.telefono}${contactoAEliminar?.email ? ` • ✉️ ${contactoAEliminar.email}` : ''}`}
        warningMessage="Esta acción eliminará el contacto de forma permanente. No se puede deshacer."
        confirmText="Eliminar"
        isLoading={eliminandoContacto}
        confirmButtonColor="red"
      />
    </div>
  );
}