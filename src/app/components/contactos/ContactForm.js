export default function ContactForm({
  isOpen,
  onClose,
  onSubmit,
  formData,
  onInputChange,
  isLoading,
  error,
  isEditMode,
  usuario
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header del modal */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {isEditMode ? '✏️ Editar Contacto' : '📞 Agregar Nuevo Contacto'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              disabled={isLoading}
            >
              ×
            </button>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={onSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">🚫 {error}</p>
            </div>
          )}

          {/* Información del usuario */}
          {usuario && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                <strong>👤 Usuario:</strong> {usuario.nombre}
              </p>
            </div>
          )}

          <div className="space-y-4">
            {/* Campo Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Contacto *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={onInputChange}
                placeholder="Ej: María González"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                disabled={isLoading}
              />
            </div>

            {/* Campo Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={onInputChange}
                placeholder="Ej: +52 81 1234 5678"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                disabled={isLoading}
              />
            </div>

            {/* Campo Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (opcional)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                placeholder="Ej: maria@ejemplo.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
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
              className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading 
                ? (isEditMode ? '⏳ Actualizando...' : '⏳ Creando...') 
                : (isEditMode ? '✅ Actualizar' : '✅ Agregar Contacto')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}