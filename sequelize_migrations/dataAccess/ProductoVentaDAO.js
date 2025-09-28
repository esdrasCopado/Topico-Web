import db from '../models/index.js';
const  { ProductoVenta } = db;

class ProductoVentaDAO {
    constructor() { }

    async crearProductoVenta(idventa, idproducto, cantidadvendida, subtotal, precioVenta) {
        try {
            const productoVenta = await ProductoVenta.create({
                idventa,
                idproducto,
                cantidadvendida,
                subtotal,
                precioVenta,
            });
            return productoVenta;
        } catch (error) {
            console.error("Error al crear ProductoVenta:", error);
            throw new Error("No se pudo crear el registro de ProductoVenta.");
        }
    }

    async obtenerProductosVenta() {
        try {
            const productosVenta = await ProductoVenta.findAll();
            return productosVenta;
        } catch (error) {
            console.error("Error al obtener todos los ProductoVenta:", error);
            throw new Error("No se pudieron obtener los registros de ProductoVenta.");
        }
    }

    async obtenerProductoVentaPorId(id) {
        try {
            const productoVenta = await ProductoVenta.findByPk(id);
            return productoVenta;
        } catch (error) {
            console.error(`Error al obtener ProductoVenta con ID ${id}:`, error);
            throw new Error("No se pudo obtener el registro de ProductoVenta.");
        }
    }

    async actualizarProductoVenta(id, idventa, idproducto, cantidadvendida, subtotal, precioVenta) {
        try {

            ProductoVenta.update({ idventa, idproducto, cantidadvendida, subtotal, precioVenta }, { where: { id } });

            const productoVentaActualizado = await ProductoVenta.findByPk(id);
            return productoVentaActualizado;
        } catch (error) {
            console.error(`Error al actualizar ProductoVenta con ID ${id}:`, error);
            throw new Error("No se pudo actualizar el registro de ProductoVenta.");
        }
    }

    async eliminarProductoVenta(id) {
        try {
            const productoVenta = await ProductoVenta.findByPk(id);
            if (!productoVenta) {
                // Uniformidad y claridad en el error
                throw new Error("ProductoVenta no encontrado");
            }

            await productoVenta.destroy();
            return { mensaje: 'ProductoVenta eliminado con éxito' };

        } catch (error) {
            // Se puede simplificar si se lanza un error específico.
            // Si el error es el que lanzaste, lo relanzas. Si no, lanzas uno genérico.
            if (error.message === 'ProductoVenta no encontrado') {
                throw error;
            }
            console.error(`Error al eliminar ProductoVenta con ID ${id}:`, error);
            throw new Error("No se pudo eliminar el registro de ProductoVenta.");
        }
    }
}

export default new ProductoVentaDAO();