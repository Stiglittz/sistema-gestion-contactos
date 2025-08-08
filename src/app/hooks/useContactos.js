import { useState } from 'react';

export function useContactos() {
  // ======================= ESTADOS DE CONTACTOS =======================
  const [contactos, setContactos] = useState([]);
  
  // Estados para el modal de crear/editar contacto
  const [modalContactoAbierto, setModalContactoAbierto] = useState(false);
  const [modoEdicionContacto, setModoEdicionContacto] = useState(false);
  const [contactoAEditar, setContactoAEditar] = useState(null);
  const [formDataContacto, setFormDataContacto] = useState({
    nombre: '',
    telefono: '',
    email: ''
  });
  const [enviandoFormContacto, setEnviandoFormContacto] = useState(false);
  const [errorFormContacto, setErrorFormContacto] = useState('');

  // Estados para eliminar contacto
  const [modalEliminarContacto, setModalEliminarContacto] = useState(false);
  const [contactoAEliminar, setContactoAEliminar] = useState(null);
  const [eliminandoContacto, setEliminandoContacto] = useState(false);

  // ======================= FUNCIONES DE CONTACTOS =======================

  const cargarContactos = async (usuarioId) => {
    if (!usuarioId) {
      setContactos([]);
      return;
    }
    
    try {
      const response = await fetch(`/api/usuarios/${usuarioId}/contactos`);
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setContactos(data.data);
      } else if (Array.isArray(data)) {
        setContactos(data);
      } else {
        console.error('Error en la respuesta de contactos:', data);
        setContactos([]);
      }
    } catch (error) {
      console.error('Error cargando contactos:', error);
      setContactos([]);
    }
  };

  // Funciones para el modal de crear/editar contacto
  const abrirModalContacto = () => {
    setModoEdicionContacto(false);
    setContactoAEditar(null);
    setModalContactoAbierto(true);
    setFormDataContacto({ nombre: '', telefono: '', email: '' });
    setErrorFormContacto('');
  };

  const abrirModalEditarContacto = (contacto) => {
    setModoEdicionContacto(true);
    setContactoAEditar(contacto);
    setModalContactoAbierto(true);
    setFormDataContacto({
      nombre: contacto.nombre || '',
      telefono: contacto.telefono || '',
      email: contacto.email || ''
    });
    setErrorFormContacto('');
  };

  const cerrarModalContacto = () => {
    setModalContactoAbierto(false);
    setModoEdicionContacto(false);
    setContactoAEditar(null);
    setFormDataContacto({ nombre: '', telefono: '', email: '' });
    setErrorFormContacto('');
  };

  const manejarCambioInputContacto = (e) => {
    const { name, value } = e.target;
    setFormDataContacto(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const guardarContacto = async (e, usuarioId) => {
    e.preventDefault();
    setErrorFormContacto('');
    
    // Validaciones básicas
    if (!formDataContacto.nombre.trim()) {
      setErrorFormContacto('El nombre es requerido');
      return;
    }
    if (!formDataContacto.telefono.trim()) {
      setErrorFormContacto('El teléfono es requerido');
      return;
    }
    if (formDataContacto.email && !/\S+@\S+\.\S+/.test(formDataContacto.email)) {
      setErrorFormContacto('El email no tiene un formato válido');
      return;
    }

    if (!usuarioId) {
      setErrorFormContacto('Error: Usuario no seleccionado');
      return;
    }

    setEnviandoFormContacto(true);

    try {
      const url = modoEdicionContacto 
        ? `/api/usuarios/${usuarioId}/contactos/${contactoAEditar._id}` 
        : `/api/usuarios/${usuarioId}/contactos`;
      
      const method = modoEdicionContacto ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataContacto),
      });

      const data = await response.json();

      if (data.success || response.ok) {
        // Contacto creado/actualizado exitosamente
        await cargarContactos(usuarioId); // Recargar la lista de contactos
        cerrarModalContacto();
      } else {
        setErrorFormContacto(data.message || `Error ${modoEdicionContacto ? 'actualizando' : 'creando'} el contacto`);
      }
    } catch (error) {
      console.error(`Error ${modoEdicionContacto ? 'actualizando' : 'creando'} contacto:`, error);
      setErrorFormContacto('Error de conexión. Intenta nuevamente.');
    }

    setEnviandoFormContacto(false);
  };

  // Funciones para eliminar contacto
  const confirmarEliminarContacto = (contacto) => {
    setContactoAEliminar(contacto);
    setModalEliminarContacto(true);
  };

  const cancelarEliminarContacto = () => {
    setModalEliminarContacto(false);
    setContactoAEliminar(null);
  };

  const eliminarContacto = async (usuarioId) => {
    if (!contactoAEliminar || !usuarioId) return;

    setEliminandoContacto(true);

    try {
      const response = await fetch(`/api/usuarios/${usuarioId}/contactos/${contactoAEliminar._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        // Contacto eliminado exitosamente
        await cargarContactos(usuarioId); // Recargar la lista de contactos
        setModalEliminarContacto(false);
        setContactoAEliminar(null);
      } else {
        console.error('Error eliminando contacto:', data);
        alert('Error eliminando el contacto: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error eliminando contacto:', error);
      alert('Error de conexión. Intenta nuevamente.');
    }

    setEliminandoContacto(false);
  };

  // Función para limpiar contactos cuando se deselecciona usuario
  const limpiarContactos = () => {
    setContactos([]);
    // Cerrar modales si están abiertos
    if (modalContactoAbierto) {
      cerrarModalContacto();
    }
    if (modalEliminarContacto) {
      cancelarEliminarContacto();
    }
  };

  // ======================= RETURN DEL HOOK =======================
  return {
    // Estados
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
    
    // Funciones
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
  };
}