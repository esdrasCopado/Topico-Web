// dao/VentaDAO.js
const Venta = require('../models/Venta');
const ProductoDAO = require('./ProductoDAO');

/**
 * Data Access Object para la entidad Venta
 * Maneja todas las operaciones CRUD y consultas relacionadas con ventas
 * Incluye gestión automática de inventario
 */
class VentaDAO {
  
  /**
   * Crear una nueva venta en la base de datos
   * Valida stock disponible y actualiza inventario automáticamente
   * @param {Object} datosVenta - Datos de la venta
   * @param {Number} datosVenta.total - Total de la venta
   * @param {Number} datosVenta.iva - IVA de la venta
   * @param {Array} datosVenta.procductos - Array de productos vendidos
   * @returns {Promise<Object>} Venta creada
   * @throws {Error} Si no hay stock suficiente o hay error en la validación
   * 
   * @example
   * const venta = await VentaDAO.crear({
   *   total: 30000,
   *   iva: 4800,
   *   procductos: [{
   *     productoId: "507f1f77bcf86cd799439011",
   *     cantidadVendida: 2,
   *     precioVenta: 15000,
   *     subtotal: 30000
   *   }]
   * });
   */
  async crear(datosVenta) {
    try {
      console.log('🛒 Iniciando proceso de venta...');
      
      // Validar que haya productos en la venta
      if (!datosVenta.procductos || datosVenta.procductos.length === 0) {
        throw new Error('La venta debe incluir al menos un producto');
      }

      // Validar disponibilidad de stock para todos los productos
      console.log(' Verificando disponibilidad de stock...');
      for (const item of datosVenta.procductos) {
        const disponible = await ProductoDAO.verificarDisponibilidad(
          item.productoId,
          item.cantidadVendida
        );
        
        if (!disponible) {
          const producto = await ProductoDAO.obtenerPorId(item.productoId);
          throw new Error(
            `Stock insuficiente para ${producto.nombre}. ` +
            `Disponible: ${producto.cantidad}, Solicitado: ${item.cantidadVendida}`
          );
        }
      }

      // Crear la venta
      const venta = new Venta(datosVenta);
      const ventaGuardada = await venta.save();
      console.log(` Venta registrada con ID: ${ventaGuardada._id}`);

      // Actualizar el stock de los productos vendidos
      console.log(' Actualizando inventario...');
      for (const item of datosVenta.procductos) {
        await ProductoDAO.actualizarStock(
          item.productoId,
          -item.cantidadVendida  // Negativo para restar del stock
        );
      }

      console.log(`💰 Venta completada. Total: $${ventaGuardada.total}`);
      return ventaGuardada;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const mensajes = Object.values(error.errors).map(err => err.message);
        throw new Error(`Error de validación: ${mensajes.join(', ')}`);
      }
      throw new Error(`Error al crear venta: ${error.message}`);
    }
  }

  /**
   * Obtener todas las ventas de la base de datos
   * @param {Object} filtros - Filtros opcionales
   * @returns {Promise<Array>} Lista de ventas con productos populados
   * @throws {Error} Si hay un error en la consulta
   * 
   * @example
   * const ventas = await VentaDAO.obtenerTodas();
   */
  async obtenerTodas(filtros = {}) {
    try {
      const ventas = await Venta.find(filtros)
        .populate('procductos.productoId', 'nombre precio')
        .sort({ createdAt: -1 });
      
      console.log(` Se obtuvieron ${ventas.length} ventas`);
      return ventas;
    } catch (error) {
      throw new Error(`Error al obtener ventas: ${error.message}`);
    }
  }

  /**
   * Obtener una venta específica por su ID
   * @param {String} id - ID de la venta
   * @returns {Promise<Object>} Venta encontrada con productos populados
   * @throws {Error} Si la venta no existe o hay error en la consulta
   * 
   * @example
   * const venta = await VentaDAO.obtenerPorId("507f1f77bcf86cd799439011");
   */
  async obtenerPorId(id) {
    try {
      const venta = await Venta.findById(id)
        .populate('procductos.productoId', 'nombre precio cantidad');
      
      if (!venta) {
        throw new Error(`Venta con ID ${id} no encontrada`);
      }
      
      console.log(` Venta encontrada: ID ${id} - Total: $${venta.total}`);
      return venta;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new Error(`ID de venta inválido: ${id}`);
      }
      throw new Error(`Error al obtener venta: ${error.message}`);
    }
  }

  /**
   * Obtener ventas por rango de fechas
   * @param {Date} fechaInicio - Fecha de inicio del rango
   * @param {Date} fechaFin - Fecha de fin del rango
   * @returns {Promise<Array>} Lista de ventas en el rango especificado
   * @throws {Error} Si hay un error en la consulta
   * 
   * @example
   * const inicio = new Date('2025-01-01');
   * const fin = new Date('2025-01-31');
   * const ventas = await VentaDAO.obtenerPorRangoFechas(inicio, fin);
   */
  async obtenerPorRangoFechas(fechaInicio, fechaFin) {
    try {
      const ventas = await Venta.find({
        createdAt: {
          $gte: fechaInicio,
          $lte: fechaFin
        }
      })
      .populate('procductos.productoId', 'nombre precio')
      .sort({ createdAt: -1 });
      
      console.log(
        ` Se encontraron ${ventas.length} ventas entre ` +
        `${fechaInicio.toLocaleDateString()} y ${fechaFin.toLocaleDateString()}`
      );
      
      return ventas;
    } catch (error) {
      throw new Error(`Error al obtener ventas por fecha: ${error.message}`);
    }
  }

  /**
   * Obtener ventas del día actual
   * @returns {Promise<Array>} Lista de ventas de hoy
   * @throws {Error} Si hay un error en la consulta
   * 
   * @example
   * const ventasHoy = await VentaDAO.obtenerVentasHoy();
   */
  async obtenerVentasHoy() {
    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const finDelDia = new Date();
      finDelDia.setHours(23, 59, 59, 999);
      
      return await this.obtenerPorRangoFechas(hoy, finDelDia);
    } catch (error) {
      throw new Error(`Error al obtener ventas de hoy: ${error.message}`);
    }
  }

  /**
   * Actualizar una venta existente
   * Restaura el stock original y aplica el nuevo stock
   * @param {String} id - ID de la venta a actualizar
   * @param {Object} datosActualizacion - Datos a actualizar
   * @returns {Promise<Object>} Venta actualizada
   * @throws {Error} Si la venta no existe o hay error en la actualización
   * 
   * @example
   * const ventaActualizada = await VentaDAO.actualizar(
   *   "507f1f77bcf86cd799439011",
   *   { iva: 5000 }
   * );
   */
  async actualizar(id, datosActualizacion) {
    try {
      console.log(`  Actualizando venta ${id}...`);
      
      // Obtener la venta original para restaurar el stock
      const ventaOriginal = await this.obtenerPorId(id);

      // Restaurar el stock de los productos de la venta original
      console.log(' Restaurando stock original...');
      for (const item of ventaOriginal.procductos) {
        await ProductoDAO.actualizarStock(
          item.productoId._id,
          item.cantidadVendida  // Positivo para devolver al stock
        );
      }

      // Si se están actualizando los productos, validar disponibilidad
      if (datosActualizacion.procductos) {
        console.log(' Validando nuevo stock...');
        
        for (const item of datosActualizacion.procductos) {
          const disponible = await ProductoDAO.verificarDisponibilidad(
            item.productoId,
            item.cantidadVendida
          );
          
          if (!disponible) {
            // Restaurar stock antes de lanzar error
            console.log('  Stock insuficiente, revirtiendo cambios...');
            for (const itemOriginal of ventaOriginal.procductos) {
              await ProductoDAO.actualizarStock(
                itemOriginal.productoId._id,
                -itemOriginal.cantidadVendida
              );
            }
            
            const producto = await ProductoDAO.obtenerPorId(item.productoId);
            throw new Error(
              `Stock insuficiente para ${producto.nombre}. ` +
              `Disponible: ${producto.cantidad}, Solicitado: ${item.cantidadVendida}`
            );
          }
        }

        // Descontar el nuevo stock
        console.log(' Aplicando nuevo stock...');
        for (const item of datosActualizacion.procductos) {
          await ProductoDAO.actualizarStock(
            item.productoId,
            -item.cantidadVendida
          );
        }
      } else {
        // Si no se actualizan productos, restaurar el stock original
        console.log(' Manteniendo productos originales...');
        for (const itemOriginal of ventaOriginal.procductos) {
          await ProductoDAO.actualizarStock(
            itemOriginal.productoId._id,
            -itemOriginal.cantidadVendida
          );
        }
      }

      const venta = await Venta.findByIdAndUpdate(
        id,
        datosActualizacion,
        { 
          new: true,
          runValidators: true
        }
      ).populate('procductos.productoId', 'nombre precio');
      
      if (!venta) {
        throw new Error(`Venta con ID ${id} no encontrada`);
      }
      
      console.log(` Venta actualizada exitosamente`);
      return venta;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const mensajes = Object.values(error.errors).map(err => err.message);
        throw new Error(`Error de validación: ${mensajes.join(', ')}`);
      }
      throw new Error(`Error al actualizar venta: ${error.message}`);
    }
  }

  /**
   * Eliminar una venta de la base de datos
   * Restaura automáticamente el stock de los productos
   * @param {String} id - ID de la venta a eliminar
   * @returns {Promise<Object>} Venta eliminada
   * @throws {Error} Si la venta no existe o hay error en la eliminación
   * 
   * @example
   * const ventaEliminada = await VentaDAO.eliminar("507f1f77bcf86cd799439011");
   */
  async eliminar(id) {
    try {
      console.log(`  Eliminando venta ${id}...`);
      
      const venta = await this.obtenerPorId(id);
      
      if (!venta) {
        throw new Error(`Venta con ID ${id} no encontrada`);
      }

      // Restaurar el stock de los productos
      console.log(' Restaurando stock al inventario...');
      for (const item of venta.procductos) {
        await ProductoDAO.actualizarStock(
          item.productoId._id,
          item.cantidadVendida  // Positivo para devolver al stock
        );
      }

      await Venta.findByIdAndDelete(id);
      
      console.log(` Venta eliminada y stock restaurado`);
      return venta;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new Error(`ID de venta inválido: ${id}`);
      }
      throw new Error(`Error al eliminar venta: ${error.message}`);
    }
  }

  /**
   * Obtener estadísticas generales de ventas
   * @param {Date} fechaInicio - Fecha de inicio (opcional)
   * @param {Date} fechaFin - Fecha de fin (opcional)
   * @returns {Promise<Object>} Objeto con estadísticas de ventas
   * @throws {Error} Si hay un error en el cálculo
   * 
   * @example
   * // Estadísticas de todas las ventas
   * const stats = await VentaDAO.obtenerEstadisticas();
   * 
   * // Estadísticas de un periodo específico
   * const stats = await VentaDAO.obtenerEstadisticas(
   *   new Date('2025-01-01'),
   *   new Date('2025-01-31')
   * );
   */
  async obtenerEstadisticas(fechaInicio = null, fechaFin = null) {
    try {
      const filtro = {};
      
      if (fechaInicio && fechaFin) {
        filtro.createdAt = { $gte: fechaInicio, $lte: fechaFin };
      }

      const ventas = await Venta.find(filtro);

      const estadisticas = {
        totalVentas: ventas.length,
        montoTotal: 0,
        ivaTotal: 0,
        promedioVenta: 0,
        productosVendidos: 0,
        ventaMasAlta: 0,
        ventaMasBaja: ventas.length > 0 ? Infinity : 0
      };

      // Calcular estadísticas
      ventas.forEach(venta => {
        estadisticas.montoTotal += venta.total;
        estadisticas.ivaTotal += venta.iva;
        
        if (venta.total > estadisticas.ventaMasAlta) {
          estadisticas.ventaMasAlta = venta.total;
        }
        if (venta.total < estadisticas.ventaMasBaja) {
          estadisticas.ventaMasBaja = venta.total;
        }
        
        venta.procductos.forEach(item => {
          estadisticas.productosVendidos += item.cantidadVendida;
        });
      });

      estadisticas.promedioVenta = estadisticas.totalVentas > 0 
        ? estadisticas.montoTotal / estadisticas.totalVentas 
        : 0;

      if (estadisticas.ventaMasBaja === Infinity) {
        estadisticas.ventaMasBaja = 0;
      }

      console.log('Estadísticas calculadas:');
      console.log(`   - Total de ventas: ${estadisticas.totalVentas}`);
      console.log(`   - Monto total: $${estadisticas.montoTotal.toFixed(2)}`);
      console.log(`   - Promedio por venta: $${estadisticas.promedioVenta.toFixed(2)}`);

      return estadisticas;
    } catch (error) {
      throw new Error(`Error al obtener estadísticas: ${error.message}`);
    }
  }

  /**
   * Obtener los productos más vendidos
   * @param {Number} limite - Número de productos a retornar (default: 10)
   * @returns {Promise<Array>} Lista de productos ordenados por cantidad vendida
   * @throws {Error} Si hay un error en la agregación
   * 
   * @example
   * // Top 10 productos más vendidos
   * const top10 = await VentaDAO.obtenerProductosMasVendidos();
   * 
   * // Top 5 productos más vendidos
   * const top5 = await VentaDAO.obtenerProductosMasVendidos(5);
   */
  async obtenerProductosMasVendidos(limite = 10) {
    try {
      const resultado = await Venta.aggregate([
        { $unwind: '$procductos' },
        {
          $group: {
            _id: '$procductos.productoId',
            totalVendido: { $sum: '$procductos.cantidadVendida' },
            ingresoTotal: { $sum: '$procductos.subtotal' },
            vecesVendido: { $sum: 1 }
          }
        },
        { $sort: { totalVendido: -1 } },
        { $limit: limite }
      ]);

      // Poblar información del producto
      for (let item of resultado) {
        try {
          const producto = await ProductoDAO.obtenerPorId(item._id);
          item.producto = {
            _id: producto._id,
            nombre: producto.nombre,
            precio: producto.precio,
            stockActual: producto.cantidad
          };
        } catch (error) {
          item.producto = {
            _id: item._id,
            nombre: 'Producto no encontrado',
            precio: 0,
            stockActual: 0
          };
        }
      }

      console.log(`🏆 Top ${resultado.length} productos más vendidos calculados`);
      return resultado;
    } catch (error) {
      throw new Error(`Error al obtener productos más vendidos: ${error.message}`);
    }
  }

  /**
   * Obtener el total de ventas por día
   * @param {Number} dias - Número de días a consultar (default: 7)
   * @returns {Promise<Array>} Array con totales por día
   * @throws {Error} Si hay un error en la consulta
   * 
   * @example
   * const ventasUltimos7Dias = await VentaDAO.obtenerVentasPorDia();
   * const ventasUltimos30Dias = await VentaDAO.obtenerVentasPorDia(30);
   */
  async obtenerVentasPorDia(dias = 7) {
    try {
      const fechaInicio = new Date();
      fechaInicio.setDate(fechaInicio.getDate() - dias);
      fechaInicio.setHours(0, 0, 0, 0);

      const resultado = await Venta.aggregate([
        {
          $match: {
            createdAt: { $gte: fechaInicio }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            totalVentas: { $sum: 1 },
            montoTotal: { $sum: "$total" },
            ivaTotal: { $sum: "$iva" }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      console.log(`ventas de los últimos ${dias} días calculadas`);
      return resultado;
    } catch (error) {
      throw new Error(`Error al obtener ventas por día: ${error.message}`);
    }
  }

  /**
   * Contar el total de ventas
   * @param {Object} filtros - Filtros opcionales
   * @returns {Promise<Number>} Cantidad total de ventas
   * @throws {Error} Si hay un error en la consulta
   * 
   * @example
   * const totalVentas = await VentaDAO.contarVentas();
   */
  async contarVentas(filtros = {}) {
    try {
      const cantidad = await Venta.countDocuments(filtros);
      console.log(`📊 Total de ventas registradas: ${cantidad}`);
      return cantidad;
    } catch (error) {
      throw new Error(`Error al contar ventas: ${error.message}`);
    }
  }

  /**
   * Obtener el ticket promedio de ventas
   * @param {Date} fechaInicio - Fecha de inicio (opcional)
   * @param {Date} fechaFin - Fecha de fin (opcional)
   * @returns {Promise<Number>} Ticket promedio
   * @throws {Error} Si hay un error en el cálculo
   * 
   * @example
   * const ticketPromedio = await VentaDAO.obtenerTicketPromedio();
   */
  async obtenerTicketPromedio(fechaInicio = null, fechaFin = null) {
    try {
      const estadisticas = await this.obtenerEstadisticas(fechaInicio, fechaFin);
      console.log(`🎫 Ticket promedio: $${estadisticas.promedioVenta.toFixed(2)}`);
      return estadisticas.promedioVenta;
    } catch (error) {
      throw new Error(`Error al obtener ticket promedio: ${error.message}`);
    }
  }
}

// Exportar una instancia única del DAO (Singleton pattern)
module.exports = new VentaDAO();