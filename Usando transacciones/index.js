import pool from "./config/db.js";
import { ProductoDAO } from './daos/ProductoDAO.js';
import { VentaDAO } from './daos/VentaDAO.js';
import { ProductoVentaDAO } from './daos/ProductoVentaDAO.js';

function testConnection() {
    pool.getConnection()
        .then((connection) => {
            console.log('Database connection established.');
            connection.release();
        })
        .catch((error) => {
            console.error('Error connecting to the database:', error.message);
        });
}

// tests/productTests.js


async function runTestsProduct() {
    try {
        console.log('======== PRUEBAS DAO ========');
        console.log('');

        // --- PRODUCTOS ---
        console.log('--- Crear producto ---');
        const prod = await ProductoDAO.create({ nombre: 'Laptop', precio: 15000, cantidad: 10 });
        console.log('Producto creado:', prod);
        const prod2 = await ProductoDAO.create({ nombre: 'Laptop', precio: 15000, cantidad: 10 });
        console.log('Producto creado:', prod2);

        console.log('');
        console.log('--- Listar productos ---');
        const productos = await ProductoDAO.getAll();
        console.log(productos);

        console.log('');
        console.log('--- Actualizar producto ---');

        const updatedData = {
            nombre: 'Laptop Gamer',
            precio: 18000,
            cantidad: 8
        };

        // Pasa el id y el objeto con los datos, en el orden correcto
        await ProductoDAO.update(prod, updatedData);

        const productoActualizado = await ProductoDAO.getById(prod);
        console.log(productoActualizado);


        console.log('');
        console.log('--- Eliminar producto ---');
        await ProductoDAO.delete(prod2);
        const productosFinal = await ProductoDAO.getAll();
        console.log(productosFinal);

    } catch (err) {
        console.error('Error en pruebas:', err.message);
    } finally {
        // Cierra la conexión o finaliza el pool al terminar las pruebas
        if (pool) {
            pool.end();
        }
    }
}

async function runTestsVenta() {
    try {
        // --- VENTAS ---
        console.log('\n--- Crear venta ---');
        const venta = await VentaDAO.create({ total: 0, iva: 0 });
        console.log('Venta creada:', venta);

        console.log('\n--- Listar ventas ---');
        const ventas = await VentaDAO.getAll();
        console.log(ventas);

        console.log('\n--- Actualizar venta ---');
        await VentaDAO.update(venta, { total: 2000, iva: 320 });
        const ventaActualizada = await VentaDAO.getById(venta);
        console.log(ventaActualizada);

        console.log('\n--- Eliminar venta ---');
        await VentaDAO.delete(venta);
        const ventasFinal = await VentaDAO.getAll();
        console.log(ventasFinal);

    } catch (err) {
        console.error('Error en pruebas:', err.message);
    }
}

async function runTestsProductoVenta() {
    try {
        // --- PRODUCTO-VENTA ---
        console.log('\n--- Crear productoVenta con transacción ---');
        // Primero creamos producto y venta para usar sus IDs
        const p = await ProductoDAO.create({ nombre: 'Mouse', precio: 500, cantidad: 20 });
        const v = await VentaDAO.create({ total: 0, iva: 0 });

        const pv = await ProductoVentaDAO.create({
            idVenta: v,
            idProducto: p,
            cantidadVendida: 2,
            precioVenta: 500
        });

        console.log('ProductoVenta creado:', pv);

        console.log('\n--- Listar productoVenta ---');
        const listaPV = await ProductoVentaDAO.obtenerPorVenta(v);
        console.log(listaPV);
        pool.end();
    } catch (err) {
        pool.end();
        console.error('Error en pruebas:', err.message);
    }
}

runTestsProductoVenta();