import conectarDB from '../../lib/mongodb';
import Usuario from '../../models/Usuario';

export function validarUsuario(body) {
  const { nombre, email, telefono } = body;

  if (!nombre || !email) return { valido: false, mensaje: 'Nombre y email son requeridos' };

  // Detecta etiquetas HTML peligrosas
  const patronesMaliciosos = /<script>|<img|onerror=|onload=/i;
  if (patronesMaliciosos.test(nombre) || patronesMaliciosos.test(email) || patronesMaliciosos.test(telefono)) {
    return { valido: false, mensaje: 'Input contiene caracteres o código inválido' };
  }

  // Sanitizar
  const nombreSanitizado = nombre.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const emailSanitizado = email.trim().toLowerCase();
  const telefonoSanitizado = telefono ? telefono.trim() : '';

  return { valido: true, data: { nombre: nombreSanitizado, email: emailSanitizado, telefono: telefonoSanitizado } };
}


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
    const body = await request.json();
    const validacion = validarUsuario(body);
      
    if (!validacion.valido) {
      return Response.json({ success: false, message: validacion.mensaje }, { status: 400 });
    }
    
    const nuevoUsuario = new Usuario(validacion.data);
    const usuarioGuardado = await nuevoUsuario.save();


    return Response.json({ success: true, message: "Usuario creado exitosamente", data: usuarioGuardado }, { status: 201 });
    
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