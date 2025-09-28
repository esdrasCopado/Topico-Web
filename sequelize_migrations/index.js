import productoDAO from './dataAccess/productoDAO.js';
import VentaDAO  from './dataAccess/VentaDAO.js';
import ProductoVentaDAO from './dataAccess/ProductoVentaDAO.js';
import db from './models/index.js';

// Funcion asincronica para realizar transacciones
async function realizarTransacciones() {
    try {
    // Sincronizar los modelos con la base de datos
    await db.sequelize.sync();

        // Crear un producto
        const productoCreado = await productoDAO.crearProducto('Producto 1', 10.99, 50);
        console.log('Producto creado:', productoCreado.toJSON());

        // Crear una venta
        const ventaCreada = await VentaDAO.crearVenta(100.0, 15.0);
        console.log('Venta creada:', ventaCreada.toJSON());

        // Crear un ProductoVenta asociado a la venta y al producto
        const productoVenta = await ProductoVentaDAO.crearProductoVenta(
            ventaCreada.id, // ID de la venta
            productoCreado.id, // ID del producto
            3, // Cantidad vendida
            32.97, // Subtotal
            10.99 // Precio de venta
        );
        console.log('ProductoVenta creado:', productoVenta.toJSON());

        // Leer productos y ventas
        let productos = await productoDAO.obtenerTodosLosProductos();
        console.log('Productos:', productos);

        let ventas = await VentaDAO.obtenerVentas();
        console.log('Ventas:', ventas);

        // Actualizar un producto
        await productoDAO.actualizarProducto(productoCreado.id, 'Producto Actualizado', 15.99, 40);
        console.log('Producto actualizado');

        // Eliminar el ProductoVenta primero, luego la venta
        await ProductoVentaDAO.eliminarProductoVenta(productoVenta.id);
        console.log('ProductoVenta eliminado');

        await VentaDAO.eliminarVenta(ventaCreada.id);
        console.log('Venta eliminada');

        // Obtener las ventas nuevamente
        let ventasActualizadas = await VentaDAO.obtenerVentas();
        console.log('Ventas actualizadas:', ventasActualizadas);

    } catch (error) {
        console.error('Error en las transacciones:', error);
    } finally {
    // Cierra la conexión a la base de datos cuando todas las transacciones han terminado
    await db.sequelize.close();
    }
}

// Ejecuta las transacciones
realizarTransacciones();