'use client';

import EmptyState from '../layout/EmptyState';

export default function UserList({
  usuarios,
  usuarioSeleccionado,
  onSeleccionarUsuario,
  onAbrirModal,
  onAbrirModalEditar,
  onConfirmarEliminar
}) {
  return (
    <aside className="w-full md:w-1/3 bg-white border-r md:border-r border-b md:border-b-0 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-base md:text-lg font-semibold text-gray-800">
            👥 Usuarios ({usuarios.length})
          </h2>
          <button 
            onClick={onAbrirModal}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            + Nuevo
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="p-4">
        {usuarios.length === 0 ? (
          <EmptyState
            icon="👤"
            title="No hay usuarios registrados"
            actionButton={
              <button 
                onClick={onAbrirModal}
                className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Crear primer usuario
              </button>
            }
            size="medium"
          />
        ) : (
          <div className="space-y-2">
            {usuarios.map((usuario) => (
              <UserCard
                key={usuario._id}
                usuario={usuario}
                isSelected={usuarioSeleccionado?._id === usuario._id}
                onSelect={() => onSeleccionarUsuario(usuario)}
                onEdit={() => onAbrirModalEditar(usuario)}
                onDelete={() => onConfirmarEliminar(usuario)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
}

// Componente interno para cada tarjeta de usuario
function UserCard({ usuario, isSelected, onSelect, onEdit, onDelete }) {
  return (
    <div
      className={`p-3 rounded-lg border transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 shadow-sm'
          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Avatar */}
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-medium text-sm">
            {usuario.nombre?.charAt(0).toUpperCase()}
          </span>
        </div>
        
        {/* Información del usuario */}
        <div 
          className="flex-1 min-w-0 cursor-pointer"
          onClick={onSelect}
        >
          <p className="font-medium text-gray-900 truncate">
            {usuario.nombre}
          </p>
          <p className="text-sm text-gray-500 truncate">
            {usuario.email}
          </p>
        </div>
        
        {/* Botones de acción */}
        <div className="flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-1.5 rounded transition-colors"
            title="Editar usuario"
          >
            ✏️
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
            title="Eliminar usuario"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}