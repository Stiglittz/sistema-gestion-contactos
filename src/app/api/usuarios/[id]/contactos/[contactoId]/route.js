import conectarDB from '../../../../../lib/mongodb';
import Usuario from '../../../../../models/Usuario';
import Contacto from '../../../../../models/Contacto';
import { ObjectId } from 'mongodb';

// GET - Obtener un contacto específico
export async function GET(request, { params }) {
  try {
    await conectarDB();
    
    const { id, contactoId } = await params;
    
    // Validar IDs
    if (!ObjectId.isValid(id) || !ObjectId.isValid(contactoId)) {
      return Response.json(
        { error: 'ID de usuario o contacto inválido' },
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
    
    // Buscar el contacto específico del usuario
    const contacto = await Contacto.findOne({
      _id: contactoId,
      usuarioId: id
    });
    
    if (!contacto) {
      return Response.json(
        { error: 'Contacto no encontrado' },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      data: contacto
    });
    
  } catch (error) {
    console.error('Error al obtener contacto:', error);
    return Response.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar un contacto específico
export async function PUT(request, { params }) {
  try {
    await conectarDB();
    
    const { id, contactoId } = await params;
    
    // Validar IDs
    if (!ObjectId.isValid(id) || !ObjectId.isValid(contactoId)) {
      return Response.json(
        { error: 'ID de usuario o contacto inválido' },
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
    
    // Verificar si el email ya existe en otro contacto del mismo usuario
    if (datos.email) {
      const contactoExistente = await Contacto.findOne({
        usuarioId: id,
        email: datos.email,
        _id: { $ne: contactoId }
      });
      
      if (contactoExistente) {
        return Response.json(
          { error: 'Ya tienes otro contacto con este email' },
          { status: 409 }
        );
      }
    }
    
    // Actualizar el contacto
    const contactoActualizado = await Contacto.findOneAndUpdate(
      { _id: contactoId, usuarioId: id },
      datos,
      { new: true, runValidators: true }
    );
    
    if (!contactoActualizado) {
      return Response.json(
        { error: 'Contacto no encontrado' },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      data: contactoActualizado,
      message: 'Contacto actualizado exitosamente'
    });
    
  } catch (error) {
    console.error('Error al actualizar contacto:', error);
    
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

// DELETE - Eliminar un contacto específico
export async function DELETE(request, { params }) {
  try {
    await conectarDB();
    
    const { id, contactoId } = await params;
    
    // Validar IDs
    if (!ObjectId.isValid(id) || !ObjectId.isValid(contactoId)) {
      return Response.json(
        { error: 'ID de usuario o contacto inválido' },
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
    
    // Eliminar el contacto
    const contactoEliminado = await Contacto.findOneAndDelete({
      _id: contactoId,
      usuarioId: id
    });
    
    if (!contactoEliminado) {
      return Response.json(
        { error: 'Contacto no encontrado' },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      message: 'Contacto eliminado correctamente',
      data: contactoEliminado
    });
    
  } catch (error) {
    console.error('Error al eliminar contacto:', error);
    return Response.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}