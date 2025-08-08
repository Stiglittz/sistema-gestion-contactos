import mongoose from 'mongoose';

const UsuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [50, 'El nombre no puede tener más de 50 caracteres']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  telefono: {
    type: String,
    trim: true,
    maxlength: [15, 'El teléfono no puede tener más de 15 caracteres']
  }
}, {
  timestamps: true // Agrega createdAt y updatedAt automáticamente
});

// Evitar re-compilación del modelo en desarrollo
export default mongoose.models.Usuario || mongoose.model('Usuario', UsuarioSchema);