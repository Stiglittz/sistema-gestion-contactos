'use client';

import Modal from '../ui/Modal';

export default function UserForm({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onInputChange,
  isLoading,
  error,
  isEditMode
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? '✏️ Editar Usuario' : '👤 Crear Nuevo Usuario'}
      closeable={!isLoading}
      closeOnOverlay={!isLoading}
    >
      <form onSubmit={onSubmit}>
        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-700">🚫 {error}</p>
          </div>
        )}

        <div className="space-y-4">
          {/* Campo Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={onInputChange}
              placeholder="Ej: Juan Pérez"
              className="w-full px-3 py-2 border  text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
              required
            />
          </div>

          {/* Campo Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onInputChange}
              placeholder="Ej: juan@ejemplo.com"
              className="w-full px-3 py-2 border  text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
              required
            />
          </div>

          {/* Campo Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={onInputChange}
              placeholder="Ej: +52 81 1234 5678"
              className="w-full px-3 py-2 border  text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="mt-6 flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading 
              ? (isEditMode ? '⏳ Actualizando...' : '⏳ Creando...') 
              : (isEditMode ? '✅ Actualizar' : '✅ Crear Usuario')
            }
          </button>
        </div>
      </form>
    </Modal>
  );
}