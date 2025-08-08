'use client';

import Modal from './Modal';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  icon,
  itemName,
  itemSubtitle,
  warningMessage,
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  isLoading = false,
  confirmButtonColor = "red"
}) {
  const handleConfirm = () => {
    onConfirm();
  };

  const getButtonStyles = () => {
    const baseStyles = "flex-1 px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
    
    switch (confirmButtonColor) {
      case 'red':
        return `${baseStyles} bg-red-500 hover:bg-red-600 text-white`;
      case 'blue':
        return `${baseStyles} bg-blue-500 hover:bg-blue-600 text-white`;
      case 'green':
        return `${baseStyles} bg-green-500 hover:bg-green-600 text-white`;
      default:
        return `${baseStyles} bg-red-500 hover:bg-red-600 text-white`;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      closeable={!isLoading}
      closeOnOverlay={!isLoading}
    >
      <div className="mb-4">
        {/* Icono */}
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-red-600 text-2xl">{icon || '⚠️'}</span>
        </div>

        {/* Información del item */}
        <p className="text-center text-gray-700 mb-2">
          ¿Estás seguro de que deseas eliminar {itemName ? 'a:' : 'este elemento?'}
        </p>
        
        {itemName && (
          <>
            <p className="text-center font-semibold text-gray-900 text-lg">
              {itemName}
            </p>
            {itemSubtitle && (
              <p className="text-center text-sm text-gray-500 mt-1">
                {itemSubtitle}
              </p>
            )}
          </>
        )}
      </div>
      
      {/* Mensaje de advertencia */}
      {warningMessage && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>⚠️ Advertencia:</strong> {warningMessage}
          </p>
        </div>
      )}

      {/* Botones */}
      <div className="flex space-x-3">
        <button
          onClick={onClose}
          className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors"
          disabled={isLoading}
        >
          {cancelText}
        </button>
        <button
          onClick={handleConfirm}
          className={getButtonStyles()}
          disabled={isLoading}
        >
          {isLoading ? '⏳ Eliminando...' : `🗑️ ${confirmText}`}
        </button>
      </div>
    </Modal>
  );
}