import db from '../models/index.js';
const { Producto } = db;

class productoDAO {
    constructor() { }

    async crearProducto(nombre, precio, cantidad) {
        try {
            const producto = await Producto.create({ nombre, precio, cantidad });
            return producto;
        } catch (error) {
            console.error("Error al crear producto:", error);
            // Propagar el error o devolver null/un objeto de error
            throw new Error("No se pudo crear el producto en la base de datos.");
        }
    }

    async obtenerProducto(id) {
        try {
            const producto = await Producto.findByPk(id);
            return producto;
        } catch (error) {
            console.error(`Error al obtener producto con ID ${id}:`, error);
            throw new Error("No se pudo obtener el producto.");
        }
    }

    async obtenerTodosLosProductos() {
        try {
            const productos = await Producto.findAll();
            return productos;
        } catch (error) {
            console.error("Error al obtener todos los productos:", error);
            throw new Error("No se pudieron obtener los productos.");
        }
    }

    async actualizarProducto(id, nombre, precio, cantidad) {
        try {
            await Producto.update({ nombre, precio, cantidad }, { where: { id } });
            const procutoActualizado = await Producto.findByPk(id);
            return procutoActualizado;

        } catch (error) {
            console.error(`Error al actualizar producto con ID ${id}:`, error);
            throw new Error("No se pudo actualizar el producto.");
        }
    }

    async eliminarProducto(id) {
        try {
            // ¡Se debe usar AWAIT para resolver la promesa!
            const producto = await Producto.findByPk(id);

            if (!producto) {
                // El error debe ser lanzado como una instancia de Error
                throw new Error("Producto no encontrado");
            }

            await producto.destroy();
            return { mensaje: 'Producto eliminado con éxito' }; // Retornar un objeto es más consistente

        } catch (error) {
            // Si lanzaste un error específico, es mejor dejar que el código lo propague
            if (error.message === "Producto no encontrado") {
                throw error;
            }
            console.error(`Error al eliminar producto con ID ${id}:`, error);
            throw new Error("No se pudo eliminar el producto.");
        }
    }
}

export default new productoDAO();