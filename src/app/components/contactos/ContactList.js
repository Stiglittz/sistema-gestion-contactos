import EmptyState from '../layout/EmptyState';

export default function ContactList({ 
  usuario,
  contactos,
  onAbrirModalContacto,
  onEditarContacto,
  onEliminarContacto
}) {
  if (!usuario) {
    return (
      <div className="h-full flex items-center justify-center">
        <EmptyState
          icon="📱"
          title="Selecciona un usuario"
          description="Elige un usuario de la lista para ver sus contactos"
          size="large"
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header del panel de contactos */}
      <div className="p-6 border-b bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              📞 Contactos de {usuario.nombre}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {contactos.length} contactos
            </p>
          </div>
          <button 
            onClick={onAbrirModalContacto}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium transition-colors"
          >
            + Agregar Contacto
          </button>
        </div>
      </div>

      {/* Lista de contactos */}
      <div className="flex-1 p-6">
        {contactos.length === 0 ? (
          <EmptyState
            icon="📋"
            title="Sin contactos"
            description={`${usuario.nombre} no tiene contactos registrados`}
            actionButton={
              <button 
                onClick={onAbrirModalContacto}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
              >
                Agregar primer contacto
              </button>
            }
            size="large"
          />
        ) : (
          <div className="grid gap-4">
            {contactos.map((contacto) => (
              <ContactCard
                key={contacto._id}
                contacto={contacto}
                onEditar={() => onEditarContacto(contacto)}
                onEliminar={() => onEliminarContacto(contacto)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Componente interno para cada tarjeta de contacto
function ContactCard({ contacto, onEditar, onEliminar }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 font-medium">
              {contacto.nombre?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">
              {contacto.nombre}
            </h4>
            <p className="text-sm text-gray-600">
              📱 {contacto.telefono}
            </p>
            {contacto.email && (
              <p className="text-sm text-gray-600">
                ✉️ {contacto.email}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={onEditar}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded transition-colors"
            title="Editar contacto"
          >
            ✏️
          </button>
          <button 
            onClick={onEliminar}
            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors"
            title="Eliminar contacto"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}