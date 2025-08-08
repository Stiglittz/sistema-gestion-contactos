import conectarDB from '../../../../lib/mongodb';
import Usuario from '../../../../models/Usuario';
import Contacto from '../../../../models/Contacto';
import { ObjectId } from 'mongodb';

// GET - Obtener todos los contactos de un usuario
export async function GET(request, { params }) {
  try {
    await conectarDB();
    
    const { id } = await params;
    
    // Validar que el ID del usuario sea válido
    if (!ObjectId.isValid(id)) {
      return Response.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      );
    }
    
    // Verificar que el usuario existe
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return Response.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    // Obtener todos los contactos del usuario
    const contactos = await Contacto.find({ usuarioId: id }).sort({ createdAt: -1 });
    
    return Response.json({
      success: true,
      data: contactos,
      total: contactos.length,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre
      }
    });
    
  } catch (error) {
    console.error('Error al obtener contactos:', error);
    return Response.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear un nuevo contacto para el usuario
export async function POST(request, { params }) {
  try {
    await conectarDB();
    
    const { id } = await params;
    
    // Validar que el ID del usuario sea válido
    if (!ObjectId.isValid(id)) {
      return Response.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      );
    }
    
    // Verificar que el usuario existe
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return Response.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    const datos = await request.json();
    
    // Validar datos requeridos
    if (!datos.nombre || !datos.telefono) {
      return Response.json(
        { error: 'Nombre y teléfono son requeridos' },
        { status: 400 }
      );
    }
    
    // Verificar si ya existe un contacto con el mismo email para este usuario
    if (datos.email) {
      const contactoExistente = await Contacto.findOne({
        usuarioId: id,
        email: datos.email
      });
      
      if (contactoExistente) {
        return Response.json(
          { error: 'Ya tienes un contacto con este email' },
          { status: 409 }
        );
      }
    }
    
    // Crear el nuevo contacto
    const nuevoContacto = new Contacto({
      ...datos,
      usuarioId: id
    });
    
    const contactoGuardado = await nuevoContacto.save();
    
    return Response.json({
      success: true,
      data: contactoGuardado,
      message: 'Contacto creado exitosamente'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error al crear contacto:', error);
    
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(err => err.message);
      return Response.json(
        { error: 'Datos inválidos: ' + errores.join(', ') },
        { status: 400 }
      );
    }
    
    return Response.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}