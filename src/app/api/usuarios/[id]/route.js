import conectarDB from '../../../lib/mongodb';
import Usuario from '../../../models/Usuario';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    await conectarDB();
    
    const { id } = await params;
    
    // Validar que el ID sea un ObjectId válido
    if (!ObjectId.isValid(id)) {
      return Response.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      );
    }
    
    // Buscar el usuario en la base de datos
    const usuario = await Usuario.findById(id);
    
    // Verificar si se encontró el usuario
    if (!usuario) {
      return Response.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    // Retornar respuesta exitosa
    return Response.json({
      success: true,
      data: usuario
    });
    
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return Response.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    await conectarDB();
    
    const { id } = await params;
    
    // Validar que el ID sea un ObjectId válido
    if (!ObjectId.isValid(id)) {
      return Response.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      );
    }
    
    const datos = await request.json();
    
    // Validar datos requeridos
    if (!datos.nombre || !datos.email) {
      return Response.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      );
    }
    
    // Verificar si el email ya existe (excluyendo el usuario actual)
    const emailExistente = await Usuario.findOne({
      email: datos.email,
      _id: { $ne: id }
    });
    
    if (emailExistente) {
      return Response.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      );
    }
    
    // Actualizar usuario
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      id,
      datos,
      { new: true, runValidators: true }
    );
    
    if (!usuarioActualizado) {
      return Response.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      data: usuarioActualizado
    });
    
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return Response.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    await conectarDB();
    
    const { id } = await params;
    
    // Validar que el ID sea un ObjectId válido
    if (!ObjectId.isValid(id)) {
      return Response.json(
        { error: 'ID de usuario inválido' },
        { status: 400 }
      );
    }
    
    // Eliminar usuario
    const usuarioEliminado = await Usuario.findByIdAndDelete(id);
    
    if (!usuarioEliminado) {
      return Response.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }
    
    return Response.json({
      success: true,
      message: 'Usuario eliminado correctamente',
      data: usuarioEliminado
    });
    
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return Response.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}