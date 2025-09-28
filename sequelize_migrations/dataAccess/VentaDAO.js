import db from '../models/index.js';
const  { Venta } = db;

class VentaDAO {
    constructor() {}

    async crearVenta(total, iva) {
        try {
            const venta = await Venta.create({ total, iva });
            return venta;
        } catch (error) {
            console.error("Error al crear la venta:", error);
            throw new Error("No se pudo crear la venta.");
        }
    }

    async obtenerVentas() {
        try {
            const ventas = await Venta.findAll();
            return ventas;
        } catch (error) {
            console.error("Error al obtener las ventas:", error);
            throw new Error("No se pudieron obtener las ventas.");
        }
    }

    async obtenerVentaPorId(id) {
        try {
            const venta = await Venta.findByPk(id);
            return venta;
        } catch (error) {
            console.error(`Error al obtener venta con ID ${id}:`, error);
            throw new Error("No se pudo obtener la venta.");
        }
    }

    async actualizarVenta(id, total, iva) {
        try {
            await Venta.update({total,iva}, {where: { id }});
            const ventaActualizada = Venta.findByPk(id);
            return ventaActualizada;
        } catch (error) {
            console.error(`Error al actualizar venta con ID ${id}:`, error);
            throw new Error("No se pudo actualizar la venta.");
        }
    }

    async eliminarVenta(id) {
        try {
            const venta = await Venta.findByPk(id);
            if(!venta){
                throw new Error("Venta no encontrada")
            }

            await venta.destroy();
            return 'venta eliminada';

        } catch (error) {
            console.error(`Error al eliminar venta con ID ${id}:`, error);
            throw new Error("No se pudo eliminar la venta.");
        }
    }
    
}

export default new VentaDAO();