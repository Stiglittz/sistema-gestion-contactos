import mongoose from 'mongoose';

const ContactoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [50, 'El nombre no puede tener más de 50 caracteres']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
  },
  telefono: {
    type: String,
    trim: true,
    maxlength: [15, 'El teléfono no puede tener más de 15 caracteres']
  },
  empresa: {
    type: String,
    trim: true,
    maxlength: [100, 'La empresa no puede tener más de 100 caracteres']
  },
  notas: {
    type: String,
    trim: true,
    maxlength: [500, 'Las notas no pueden tener más de 500 caracteres']
  },
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: [true, 'El usuario es requerido']
  }
}, {
  timestamps: true
});

// Evitar re-compilación del modelo en desarrollo
export default mongoose.models.Contacto || mongoose.model('Contacto', ContactoSchema);