// ejemplos-uso.js
const mongoose = require('mongoose');
const ProductoDAO = require('./dao/ProductoDAO');
const VentaDAO = require('./dao/VentaDAO');

// Configuración de conexión a MongoDB
const conectarDB = async () => {
  try {
    await mongoose.connect('mongodb://myuser:mypassword@localhost:27017/sistema_ventas?authSource=admin', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(' Conexión exitosa a MongoDB');
  } catch (error) {
    console.error(' Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

// ========================================
// EJEMPLOS DE USO - PRODUCTOS
// ========================================

const ejemplosProductos = async () => {
  console.log('\n === EJEMPLOS DE PRODUCTOS ===\n');

  try {
    // 1. CREAR PRODUCTOS
    console.log('1️⃣ Creando productos...');
    const laptop = await ProductoDAO.crear({
      nombre: 'Laptop',
      precio: 15000,
      cantidad: 30000
    });
    console.log('    Laptop creada:', laptop._id);

    const mouse = await ProductoDAO.crear({
      nombre: 'Mouse Inalámbrico',
      precio: 350,
      cantidad: 150
    });
    console.log('    Mouse creado:', mouse._id);

    const teclado = await ProductoDAO.crear({
      nombre: 'Teclado Mecánico',
      precio: 1200,
      cantidad: 80
    });
    console.log('    Teclado creado:', teclado._id);

    // 2. OBTENER TODOS LOS PRODUCTOS
    console.log('\n2️⃣ Obteniendo todos los productos...');
    const productos = await ProductoDAO.obtenerTodos();
    console.log(`    Total de productos: ${productos.length}`);
    productos.forEach(p => {
      console.log(`   - ${p.nombre}: $${p.precio} (Stock: ${p.cantidad})`);
    });

    // 3. OBTENER PRODUCTO POR ID
    console.log('\n3️⃣ Obteniendo producto por ID...');
    const productoEncontrado = await ProductoDAO.obtenerPorId(laptop._id);
    console.log('    Producto encontrado:', productoEncontrado.nombre);

    // 4. BUSCAR PRODUCTOS POR NOMBRE
    console.log('\n4️⃣ Buscando productos por nombre...');
    const resultadoBusqueda = await ProductoDAO.buscarPorNombre('mouse');
    console.log(`    Productos encontrados: ${resultadoBusqueda.length}`);

    // 5. ACTUALIZAR PRODUCTO
    console.log('\n5️⃣ Actualizando precio del mouse...');
    const mouseActualizado = await ProductoDAO.actualizar(mouse._id, {
      precio: 380
    });
    console.log(`    Nuevo precio: $${mouseActualizado.precio}`);

    // 6. ACTUALIZAR STOCK
    console.log('\n6️⃣ Actualizando stock del teclado...');
    const tecladoConStock = await ProductoDAO.actualizarStock(teclado._id, 20);
    console.log(`    Nuevo stock: ${tecladoConStock.cantidad}`);

    // 7. VERIFICAR DISPONIBILIDAD
    console.log('\n7️⃣ Verificando disponibilidad...');
    const disponible = await ProductoDAO.verificarDisponibilidad(laptop._id, 5);
    console.log(`    ¿Hay 5 laptops disponibles? ${disponible ? 'Sí' : 'No'}`);

    // 8. OBTENER PRODUCTOS CON STOCK BAJO
    console.log('\n8️⃣ Productos con stock bajo (menos de 100 unidades)...');
    const stockBajo = await ProductoDAO.obtenerStockBajo(100);
    console.log(`    Productos con stock bajo: ${stockBajo.length}`);

    return { laptop, mouse, teclado };

  } catch (error) {
    console.error(' Error en ejemplos de productos:', error.message);
    throw error;
  }
};

// ========================================
// EJEMPLOS DE USO - VENTAS
// ========================================

const ejemplosVentas = async (productos) => {
  console.log('\n === EJEMPLOS DE VENTAS ===\n');

  try {
    // 1. CREAR VENTA
    console.log('1️⃣ Creando nueva venta...');
    const venta1 = await VentaDAO.crear({
      total: 30000,
      iva: 4800,
      procductos: [
        {
          productoId: productos.laptop._id,
          cantidadVendida: 2,
          precioVenta: 15000,
          subtotal: 30000
        }
      ]
    });
    console.log('    Venta creada:', venta1._id);
    console.log(`    Total: $${venta1.total}`);

    // 2. CREAR VENTA MÚLTIPLE
    console.log('\n2️ Creando venta con múltiples productos...');
    const venta2 = await VentaDAO.crear({
      total: 16550,
      iva: 2650,
      procductos: [
        {
          productoId: productos.laptop._id,
          cantidadVendida: 1,
          precioVenta: 15000,
          subtotal: 15000
        },
        {
          productoId: productos.mouse._id,
          cantidadVendida: 3,
          precioVenta: 380,
          subtotal: 1140
        },
        {
          productoId: productos.teclado._id,
          cantidadVendida: 1,
          precioVenta: 1200,
          subtotal: 1200
        }
      ]
    });
    console.log('    Venta múltiple creada:', venta2._id);

    // 3. OBTENER TODAS LAS VENTAS
    console.log('\n3️⃣ Obteniendo todas las ventas...');
    const ventas = await VentaDAO.obtenerTodas();
    console.log(`    Total de ventas: ${ventas.length}`);
    ventas.forEach((v, index) => {
      console.log(`   ${index + 1}. Total: $${v.total} (${v.procductos.length} productos)`);
    });

    // 4. OBTENER VENTA POR ID
    console.log('\n4️⃣ Obteniendo venta específica...');
    const ventaDetalle = await VentaDAO.obtenerPorId(venta1._id);
    console.log('    Venta encontrada');
    console.log(`    - Total: $${ventaDetalle.total}`);
    console.log(`    - IVA: $${ventaDetalle.iva}`);
    console.log(`    - Productos: ${ventaDetalle.procductos.length}`);

    // 5. OBTENER ESTADÍSTICAS
    console.log('\n5️⃣ Obteniendo estadísticas de ventas...');
    const estadisticas = await VentaDAO.obtenerEstadisticas();
    console.log('    Estadísticas:');
    console.log(`    - Total de ventas: ${estadisticas.totalVentas}`);
    console.log(`    - Monto total: $${estadisticas.montoTotal.toFixed(2)}`);
    console.log(`    - IVA total: $${estadisticas.ivaTotal.toFixed(2)}`);
    console.log(`    - Promedio por venta: $${estadisticas.promedioVenta.toFixed(2)}`);
    console.log(`    - Productos vendidos: ${estadisticas.productosVendidos}`);

    // 6. PRODUCTOS MÁS VENDIDOS
    console.log('\n6️⃣ Productos más vendidos...');
    const masVendidos = await VentaDAO.obtenerProductosMasVendidos(5);
    console.log('    Top productos:');
    masVendidos.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.producto.nombre}`);
      console.log(`      - Unidades vendidas: ${item.totalVendido}`);
      console.log(`      - Ingreso total: $${item.ingresoTotal.toFixed(2)}`);
    });

    // 7. OBTENER VENTAS POR RANGO DE FECHAS
    console.log('\n7️⃣ Ventas del día de hoy...');
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const finDelDia = new Date();
    finDelDia.setHours(23, 59, 59, 999);
    
    const ventasHoy = await VentaDAO.obtenerPorRangoFechas(hoy, finDelDia);
    console.log(`    Ventas de hoy: ${ventasHoy.length}`);

    // 8. ACTUALIZAR VENTA
    console.log('\n8️⃣ Actualizando venta (cambiar IVA)...');
    const ventaActualizada = await VentaDAO.actualizar(venta1._id, {
      iva: 5000
    });
    console.log(`    Nuevo IVA: $${ventaActualizada.iva}`);

    // 9. ELIMINAR VENTA (restaura stock)
    console.log('\n9️⃣ Eliminando venta (restaura inventario)...');
    await VentaDAO.eliminar(venta1._id);
    console.log('    Venta eliminada y stock restaurado');

    // Verificar que el stock se restauró
    const laptopActualizada = await ProductoDAO.obtenerPorId(productos.laptop._id);
    console.log(`    Stock actual de laptops: ${laptopActualizada.cantidad}`);

    return { venta2 };

  } catch (error) {
    console.error(' Error en ejemplos de ventas:', error.message);
    throw error;
  }
};

// ========================================
// EJEMPLOS DE VALIDACIONES Y ERRORES
// ========================================

const ejemplosValidaciones = async () => {
  console.log('\n  === EJEMPLOS DE VALIDACIONES ===\n');

  try {
    // 1. INTENTAR CREAR PRODUCTO SIN NOMBRE
    console.log('1️⃣ Intentando crear producto sin nombre...');
    try {
      await ProductoDAO.crear({
        precio: 1000,
        cantidad: 10
      });
    } catch (error) {
      console.log('    Error capturado correctamente:', error.message);
    }

    // 2. INTENTAR CREAR PRODUCTO CON PRECIO NEGATIVO
    console.log('\n2️⃣ Intentando crear producto con precio negativo...');
    try {
      await ProductoDAO.crear({
        nombre: 'Producto Inválido',
        precio: -500,
        cantidad: 10
      });
    } catch (error) {
      console.log('    Error capturado correctamente:', error.message);
    }

    // 3. INTENTAR VENDER MÁS PRODUCTOS DE LOS DISPONIBLES
    console.log('\n3️⃣ Intentando vender más productos que el stock...');
    try {
      const productos = await ProductoDAO.obtenerTodos();
      const primerProducto = productos[0];
      
      await VentaDAO.crear({
        total: 1000000,
        iva: 160000,
        procductos: [
          {
            productoId: primerProducto._id,
            cantidadVendida: primerProducto.cantidad + 1000,
            precioVenta: primerProducto.precio,
            subtotal: 1000000
          }
        ]
      });
    } catch (error) {
      console.log('    Error capturado correctamente:', error.message);
    }

    // 4. INTENTAR CREAR VENTA SIN PRODUCTOS
    console.log('\n4️⃣ Intentando crear venta sin productos...');
    try {
      await VentaDAO.crear({
        total: 1000,
        iva: 160,
        procductos: []
      });
    } catch (error) {
      console.log('    Error capturado correctamente:', error.message);
    }

    // 5. INTENTAR OBTENER PRODUCTO INEXISTENTE
    console.log('\n5️⃣ Intentando obtener producto inexistente...');
    try {
      await ProductoDAO.obtenerPorId('507f1f77bcf86cd799439011');
    } catch (error) {
      console.log('    Error capturado correctamente:', error.message);
    }

  } catch (error) {
    console.error(' Error en ejemplos de validaciones:', error.message);
  }
};

// ========================================
// EJECUTAR TODOS LOS EJEMPLOS
// ========================================

const ejecutarEjemplos = async () => {
  try {
    // Conectar a la base de datos
    await conectarDB();

    // Limpiar colecciones para empezar desde cero (opcional)
    console.log(' Limpiando base de datos...');
    await mongoose.connection.db.dropDatabase();
    console.log(' Base de datos limpia\n');

    // Ejecutar ejemplos
    const productos = await ejemplosProductos();
    await ejemplosVentas(productos);
    await ejemplosValidaciones();

    console.log('\n === TODOS LOS EJEMPLOS COMPLETADOS ===\n');

  } catch (error) {
    console.error('\n Error general:', error);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log(' Conexión cerrada');
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  ejecutarEjemplos();
}

module.exports = {
  ejemplosProductos,
  ejemplosVentas,
  ejemplosValidaciones,
  ejecutarEjemplos
};