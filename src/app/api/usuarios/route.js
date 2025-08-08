import conectarDB from '../../lib/mongodb';
import Usuario from '../../models/Usuario';

// GET /api/usuarios - Obtener todos los usuarios
export async function GET() {
  try {
    // Conectar a la base de datos
    await conectarDB();
    
    // Obtener usuarios de MongoDB
    const usuarios = await Usuario.find({});
    
    return Response.json({
      success: true,
      message: "Conexión a MongoDB exitosa",
      count: usuarios.length,
      data: usuarios
    });
  } catch (error) {
    console.error('Error en GET /api/usuarios:', error);
    return Response.json(
      { 
        success: false, 
        message: "Error conectando a la base de datos",
        error: error.message 
      },
      { status: 500 }
    );
  }
}

// POST /api/usuarios - Crear nuevo usuario
export async function POST(request) {
  try {
    // Conectar a la base de datos
    await conectarDB();
    
    // Obtener datos del body
    const body = await request.json();
    const { nombre, email, telefono } = body;
    
    // Validar campos requeridos
    if (!nombre || !email) {
      return Response.json(
        { 
          success: false, 
          message: "Nombre y email son requeridos" 
        },
        { status: 400 }
      );
    }
    
    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      telefono
    });
    
    // Guardar en la base de datos
    const usuarioGuardado = await nuevoUsuario.save();
    
    return Response.json({
      success: true,
      message: "Usuario creado exitosamente",
      data: usuarioGuardado
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error en POST /api/usuarios:', error);
    
    // Manejo especial para email duplicado
    if (error.code === 11000) {
      return Response.json(
        { 
          success: false, 
          message: "Este email ya está registrado" 
        },
        { status: 400 }
      );
    }
    
    return Response.json(
      { 
        success: false, 
        message: "Error creando usuario",
        error: error.message 
      },
      { status: 500 }
    );
  }
}