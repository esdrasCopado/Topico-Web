// config/database.js
const mongoose = require('mongoose');
require('dotenv').config();

/**
 * Conectar a MongoDB usando las variables de entorno
 */
const conectarDB = async () => {
  try {
    // Opciones de conexión recomendadas
    const opciones = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    // Obtener URI desde variables de entorno
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('  MONGODB_URI no está definido en las variables de entorno');
    }

    console.log('  Conectando a MongoDB...');
    console.log(`  Host: ${process.env.MONGO_HOST || 'localhost'}:${process.env.MONGO_PORT || '27017'}`);
    console.log(`  Base de datos: ${process.env.MONGO_DATABASE || 'mydatabase'}`);

    const conexion = await mongoose.connect(mongoURI, opciones);

    console.log(`✅MongoDB conectado exitosamente`);
    console.log(` Host: ${conexion.connection.host}`);
    console.log(` Base de datos: ${conexion.connection.name}`);
    
    // Eventos de conexión para monitoreo
    mongoose.connection.on('error', (err) => {
      console.error(' Error de MongoDB:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('  MongoDB desconectado');
    });

    mongoose.connection.on('reconnected', () => {
      console.log(' MongoDB reconectado');
    });

    // Manejo de cierre graceful cuando la aplicación se detiene
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log(' Conexión a MongoDB cerrada por terminación de la aplicación');
        process.exit(0);
      } catch (err) {
        console.error(' Error al cerrar la conexión:', err);
        process.exit(1);
      }
    });

    // También manejar SIGTERM (usado por Docker y servicios)
    process.on('SIGTERM', async () => {
      try {
        await mongoose.connection.close();
        console.log(' Conexión a MongoDB cerrada por SIGTERM');
        process.exit(0);
      } catch (err) {
        console.error(' Error al cerrar la conexión:', err);
        process.exit(1);
      }
    });

  } catch (error) {
    console.error('  Error al conectar a MongoDB:', error.message);
    console.error('  Verifica que:');
    console.error('   1. MongoDB esté corriendo (docker-compose up -d)');
    console.error('   2. Las credenciales en .env sean correctas');
    console.error('   3. El puerto 27017 esté disponible');
    process.exit(1);
  }
};

/**
 * Cerrar la conexión a MongoDB
 */
const desconectarDB = async () => {
  try {
    await mongoose.connection.close();
    console.log(' Conexión a MongoDB cerrada correctamente');
  } catch (error) {
    console.error(' Error al cerrar la conexión:', error.message);
    throw error;
  }
};

/**
 * Verificar si la conexión está activa
 */
const verificarConexion = () => {
  const estado = mongoose.connection.readyState;
  const estados = {
    0: 'Desconectado',
    1: 'Conectado',
    2: 'Conectando',
    3: 'Desconectando'
  };
  
  console.log(` Estado de conexión: ${estados[estado]}`);
  return estado === 1;
};

module.exports = {
  conectarDB,
  desconectarDB,
  verificarConexion
};