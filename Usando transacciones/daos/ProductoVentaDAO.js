import pool from '../config/db.js';

export class ProductoVentaDAO {
    static async create(data) {
        const conn = await pool.getConnection();
        try {
            await conn.beginTransaction();

            const subtotal = data.cantidadVendida * data.precioVenta;
            
            const [insertResult] = await conn.query(
                'INSERT INTO productoventa (venta_id, producto_id, cantidadVendida, subtotal, precioVenta) VALUES (?, ?, ?, ?, ?)', 
                [data.idVenta, data.idProducto, data.cantidadVendida, subtotal, data.precioVenta]
            );

            await conn.query(
                'UPDATE producto SET cantidad = cantidad - ? WHERE id = ? AND cantidad >= ?', 
                [data.cantidadVendida, data.producto_id, data.cantidadVendida]
            );

            await conn.commit();
            return { insertId: insertResult.insertId, subtotal };

        }catch (error) {
            await conn.rollback();
            throw error;
        }finally {
            conn.release();
        }
    }

    static async obtenerPorVenta(ventaId) {
        const sql = 'SELECT * FROM productoventa WHERE venta_id = ?';
        const [rows] = await pool.query(sql, [ventaId]);
        return rows;
    }
    static async eliminarPorVenta(ventaId) {
        const sql = 'DELETE FROM productoventa WHERE venta_id = ?';
        await pool.query(sql, [ventaId]);
    }
}