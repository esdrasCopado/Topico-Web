import pool from '../config/db.js';
import { Producto } from '../models/Producto.js';

export class ProductoDAO {
    static async create(producto) {
        const sql = 'INSERT INTO producto (nombre, precio, cantidad) VALUES (?, ?, ?)';
        const params = [producto.nombre, producto.precio, producto.cantidad];
        const [result] = await pool.query(sql, params);
        return result.insertId;
    }
    static async getAll() {
        const sql = 'SELECT * FROM producto';
        const [rows] = await pool.query(sql);
        return rows;
    }
    static async getById(id) {
        const [rows] = await pool.query('SELECT * FROM producto WHERE id = ?', [id]);
        return rows[0];
    }
    static async update(id,producto) {
        const sql = 'UPDATE producto SET nombre = ?, precio = ?, cantidad = ? WHERE id = ?';
        const params = [producto.nombre, producto.precio, producto.cantidad, id];
        const [result] = await pool.execute(sql, params);
        return result.affectedRows;
    }
    static async delete(id) {
        const[result] = await pool.query('DELETE FROM producto WHERE id = ?', [id]);
        return result.affectedRows;
    }
}