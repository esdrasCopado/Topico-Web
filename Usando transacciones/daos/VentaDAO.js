import pool from '../config/db.js';
import { Venta } from '../models/Venta.js';

export class VentaDAO {
    static async create(venta) {
        const sql = 'INSERT INTO venta (total, iva) VALUES (?, ?)';
        const params = [venta.total, venta.iva];
        const [result] = await pool.query(sql, params);
        return result.insertId;
    }
    static async getAll() {
        const sql = 'SELECT * FROM venta';
        const [rows] = await pool.query(sql);
        return rows;
    }
    static async getById(id) {
        const sql = 'SELECT * FROM venta WHERE id = ?';
        const [rows] = await pool.query(sql, [id]);
        if (rows.length === 0) return null;
        const row = rows[0];
        return row
    }
    static async update(id, venta) {
        const sql = 'UPDATE venta SET total = ?, iva = ? WHERE id = ?';
        const params = [venta.total, venta.iva, id];
        const [result] = await pool.query(sql, params);
        return result.affectedRows;
    }
    static async delete(id) {
        const [result] = await pool.query('DELETE FROM venta WHERE id = ?', [id]);
        return result.affectedRows;
    }
}