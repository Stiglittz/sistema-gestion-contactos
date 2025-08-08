'use client';

import { useState, useEffect, useCallback } from 'react';

export function useUsuarios() {
  // Estados principales
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados para crear/editar
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: ''
  });
  const [enviandoForm, setEnviandoForm] = useState(false);
  const [errorForm, setErrorForm] = useState('');

  // Estados para eliminar
  const [modalEliminar, setModalEliminar] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [eliminandoUsuario, setEliminandoUsuario] = useState(false);

  // Cargar usuarios al montar
  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Función para cargar usuarios
  const cargarUsuarios = useCallback(async () => {
    try {
      const response = await fetch('/api/usuarios');
      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setUsuarios(data.data);
      } else {
        console.error('Error en la respuesta de la API:', data);
        setUsuarios([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      setUsuarios([]);
      setLoading(false);
    }
  }, []);

  // Función para seleccionar usuario
  const seleccionarUsuario = useCallback((usuario) => {
    setUsuarioSeleccionado(usuario);
  }, []);

  // Funciones para modal crear/editar
  const abrirModal = useCallback(() => {
    setModoEdicion(false);
    setUsuarioAEditar(null);
    setModalAbierto(true);
    setFormData({ nombre: '', email: '', telefono: '' });
    setErrorForm('');
  }, []);

  const abrirModalEditar = useCallback((usuario) => {
    setModoEdicion(true);
    setUsuarioAEditar(usuario);
    setModalAbierto(true);
    setFormData({
      nombre: usuario.nombre || '',
      email: usuario.email || '',
      telefono: usuario.telefono || ''
    });
    setErrorForm('');
  }, []);

  const cerrarModal = useCallback(() => {
    setModalAbierto(false);
    setModoEdicion(false);
    setUsuarioAEditar(null);
    setFormData({ nombre: '', email: '', telefono: '' });
    setErrorForm('');
  }, []);

  const manejarCambioInput = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // Función para guardar usuario
  const guardarUsuario = useCallback(async (e) => {
    e.preventDefault();
    setErrorForm('');
    
    // Validaciones básicas
    if (!formData.nombre.trim()) {
      setErrorForm('El nombre es requerido');
      return;
    }
    if (!formData.email.trim()) {
      setErrorForm('El email es requerido');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorForm('El email no tiene un formato válido');
      return;
    }

    setEnviandoForm(true);

    try {
      const url = modoEdicion 
        ? `/api/usuarios/${usuarioAEditar._id}` 
        : '/api/usuarios';
      
      const method = modoEdicion ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success || response.ok) {
        await cargarUsuarios(); // Recargar la lista
        
        // Si estamos editando el usuario seleccionado, actualizar la selección
        if (modoEdicion && usuarioSeleccionado?._id === usuarioAEditar._id) {
          const usuariosActualizados = await fetch('/api/usuarios').then(res => res.json());
          const usuarioActualizado = usuariosActualizados.data.find(u => u._id === usuarioAEditar._id);
          if (usuarioActualizado) {
            setUsuarioSeleccionado(usuarioActualizado);
          }
        }
        
        cerrarModal();
      } else {
        setErrorForm(data.message || `Error ${modoEdicion ? 'actualizando' : 'creando'} el usuario`);
      }
    } catch (error) {
      console.error(`Error ${modoEdicion ? 'actualizando' : 'creando'} usuario:`, error);
      setErrorForm('Error de conexión. Intenta nuevamente.');
    }

    setEnviandoForm(false);
  }, [formData, modoEdicion, usuarioAEditar, usuarioSeleccionado, cargarUsuarios, cerrarModal]);

  // Funciones para eliminar
  const confirmarEliminar = useCallback((usuario) => {
    setUsuarioAEliminar(usuario);
    setModalEliminar(true);
  }, []);

  const cancelarEliminar = useCallback(() => {
    setModalEliminar(false);
    setUsuarioAEliminar(null);
  }, []);

  const eliminarUsuario = useCallback(async () => {
    if (!usuarioAEliminar) return;

    setEliminandoUsuario(true);

    try {
      const response = await fetch(`/api/usuarios/${usuarioAEliminar._id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        await cargarUsuarios(); // Recargar la lista
        
        // Si el usuario eliminado era el seleccionado, limpiar selección
        if (usuarioSeleccionado?._id === usuarioAEliminar._id) {
          setUsuarioSeleccionado(null);
        }
        
        setModalEliminar(false);
        setUsuarioAEliminar(null);
      } else {
        console.error('Error eliminando usuario:', data);
        alert('Error eliminando el usuario: ' + (data.message || 'Error desconocido'));
      }
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      alert('Error de conexión. Intenta nuevamente.');
    }

    setEliminandoUsuario(false);
  }, [usuarioAEliminar, usuarioSeleccionado, cargarUsuarios]);

  // Retornar todo lo que necesita el componente
  return {
    // Estados principales
    usuarios,
    usuarioSeleccionado,
    loading,
    
    // Estados de modales
    modalAbierto,
    modoEdicion,
    usuarioAEditar,
    modalEliminar,
    usuarioAEliminar,
    
    // Estados de formulario
    formData,
    enviandoForm,
    errorForm,
    eliminandoUsuario,
    
    // Funciones principales
    seleccionarUsuario,
    cargarUsuarios,
    
    // Funciones de modal crear/editar
    abrirModal,
    abrirModalEditar,
    cerrarModal,
    manejarCambioInput,
    guardarUsuario,
    
    // Funciones de eliminar
    confirmarEliminar,
    cancelarEliminar,
    eliminarUsuario
  };
}