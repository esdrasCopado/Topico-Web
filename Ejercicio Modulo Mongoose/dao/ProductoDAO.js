// dao/ProductoDAO.js
const Producto = require('../models/Producto');

/**
 * Data Access Object para la entidad Producto
 * Maneja todas las operaciones CRUD y consultas relacionadas con productos
 */
class ProductoDAO {
  
  /**
   * Crear un nuevo producto en la base de datos
   * @param {Object} datosProducto - Datos del producto a crear
   * @param {String} datosProducto.nombre - Nombre del producto
   * @param {Number} datosProducto.precio - Precio del producto
   * @param {Number} datosProducto.cantidad - Cantidad en stock
   * @returns {Promise<Object>} Producto creado
   * @throws {Error} Si hay un error en la validación o creación
   * 
   * @example
   * const producto = await ProductoDAO.crear({
   *   nombre: "Laptop Dell",
   *   precio: 15000,
   *   cantidad: 50
   * });
   */
  async crear(datosProducto) {
    try {
      const producto = new Producto(datosProducto);
      const productoGuardado = await producto.save();
      
      console.log(` Producto creado: ${productoGuardado.nombre} (ID: ${productoGuardado._id})`);
      return productoGuardado;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const mensajes = Object.values(error.errors).map(err => err.message);
        throw new Error(`Error de validación: ${mensajes.join(', ')}`);
      }
      throw new Error(`Error al crear producto: ${error.message}`);
    }
  }

  /**
   * Obtener todos los productos de la base de datos
   * @param {Object} filtros - Filtros opcionales para la consulta
   * @param {String} filtros.nombre - Filtrar por nombre
   * @param {Number} filtros.precioMin - Precio mínimo
   * @param {Number} filtros.precioMax - Precio máximo
   * @returns {Promise<Array>} Lista de productos ordenados por nombre
   * @throws {Error} Si hay un error en la consulta
   * 
   * @example
   * // Obtener todos los productos
   * const productos = await ProductoDAO.obtenerTodos();
   * 
   * // Obtener productos con filtros
   * const productos = await ProductoDAO.obtenerTodos({ 
   *   precioMin: 1000, 
   *   precioMax: 5000 
   * });
   */
  async obtenerTodos(filtros = {}) {
    try {
      const query = {};
      
      // Aplicar filtros si existen
      if (filtros.nombre) {
        query.nombre = { $regex: filtros.nombre, $options: 'i' };
      }
      
      if (filtros.precioMin !== undefined || filtros.precioMax !== undefined) {
        query.precio = {};
        if (filtros.precioMin !== undefined) {
          query.precio.$gte = filtros.precioMin;
        }
        if (filtros.precioMax !== undefined) {
          query.precio.$lte = filtros.precioMax;
        }
      }
      
      const productos = await Producto.find(query).sort({ nombre: 1 });
      console.log(` Se obtuvieron ${productos.length} productos`);
      return productos;
    } catch (error) {
      throw new Error(`Error al obtener productos: ${error.message}`);
    }
  }

  /**
   * Obtener un producto específico por su ID
   * @param {String} id - ID del producto (ObjectId de MongoDB)
   * @returns {Promise<Object>} Producto encontrado
   * @throws {Error} Si el producto no existe o hay error en la consulta
   * 
   * @example
   * const producto = await ProductoDAO.obtenerPorId("507f1f77bcf86cd799439011");
   */
  async obtenerPorId(id) {
    try {
      const producto = await Producto.findById(id);
      
      if (!producto) {
        throw new Error(`Producto con ID ${id} no encontrado`);
      }
      
      console.log(` Producto encontrado: ${producto.nombre}`);
      return producto;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new Error(`ID de producto inválido: ${id}`);
      }
      throw new Error(`Error al obtener producto: ${error.message}`);
    }
  }

  /**
   * Buscar productos por nombre (búsqueda flexible)
   * @param {String} nombre - Nombre o parte del nombre del producto
   * @returns {Promise<Array>} Lista de productos que coinciden con la búsqueda
   * @throws {Error} Si hay un error en la consulta
   * 
   * @example
   * // Busca productos que contengan "laptop" en el nombre
   * const productos = await ProductoDAO.buscarPorNombre("laptop");
   */
  async buscarPorNombre(nombre) {
    try {
      if (!nombre || nombre.trim() === '') {
        throw new Error('El nombre de búsqueda no puede estar vacío');
      }
      
      const productos = await Producto.find({ 
        nombre: { $regex: nombre.trim(), $options: 'i' } 
      }).sort({ nombre: 1 });
      
      console.log(` Se encontraron ${productos.length} productos con "${nombre}"`);
      return productos;
    } catch (error) {
      throw new Error(`Error al buscar productos: ${error.message}`);
    }
  }

  /**
   * Actualizar los datos de un producto existente
   * @param {String} id - ID del producto a actualizar
   * @param {Object} datosActualizacion - Datos a actualizar
   * @param {String} datosActualizacion.nombre - Nuevo nombre (opcional)
   * @param {Number} datosActualizacion.precio - Nuevo precio (opcional)
   * @param {Number} datosActualizacion.cantidad - Nueva cantidad (opcional)
   * @returns {Promise<Object>} Producto actualizado
   * @throws {Error} Si el producto no existe o hay error en la actualización
   * 
   * @example
   * const productoActualizado = await ProductoDAO.actualizar(
   *   "507f1f77bcf86cd799439011",
   *   { precio: 14500, cantidad: 45 }
   * );
   */
  async actualizar(id, datosActualizacion) {
    try {
      const producto = await Producto.findByIdAndUpdate(
        id,
        datosActualizacion,
        { 
          new: true,              // Retorna el documento actualizado
          runValidators: true     // Ejecuta las validaciones del schema
        }
      );
      
      if (!producto) {
        throw new Error(`Producto con ID ${id} no encontrado`);
      }
      
      console.log(`  Producto actualizado: ${producto.nombre}`);
      return producto;
    } catch (error) {
      if (error.name === 'ValidationError') {
        const mensajes = Object.values(error.errors).map(err => err.message);
        throw new Error(`Error de validación: ${mensajes.join(', ')}`);
      }
      if (error.name === 'CastError') {
        throw new Error(`ID de producto inválido: ${id}`);
      }
      throw new Error(`Error al actualizar producto: ${error.message}`);
    }
  }

  /**
   * Actualizar el stock de un producto (aumentar o disminuir)
   * @param {String} id - ID del producto
   * @param {Number} cantidad - Cantidad a agregar (positiva) o restar (negativa)
   * @returns {Promise<Object>} Producto con stock actualizado
   * @throws {Error} Si no hay stock suficiente o hay error en la operación
   * 
   * @example
   * // Agregar 10 unidades al stock
   * await ProductoDAO.actualizarStock("507f1f77bcf86cd799439011", 10);
   * 
   * // Restar 5 unidades del stock
   * await ProductoDAO.actualizarStock("507f1f77bcf86cd799439011", -5);
   */
  async actualizarStock(id, cantidad) {
    try {
      const producto = await Producto.findById(id);
      
      if (!producto) {
        throw new Error(`Producto con ID ${id} no encontrado`);
      }

      const nuevaCantidad = producto.cantidad + cantidad;
      
      if (nuevaCantidad < 0) {
        throw new Error(
          `Stock insuficiente para ${producto.nombre}. ` +
          `Disponible: ${producto.cantidad}, Solicitado: ${Math.abs(cantidad)}`
        );
      }

      producto.cantidad = nuevaCantidad;
      const productoActualizado = await producto.save();
      
      const operacion = cantidad >= 0 ? 'agregadas' : 'restadas';
      console.log(
        ` Stock actualizado: ${producto.nombre} - ` +
        `${Math.abs(cantidad)} unidades ${operacion}. ` +
        `Nuevo stock: ${nuevaCantidad}`
      );
      
      return productoActualizado;
    } catch (error) {
      throw new Error(`Error al actualizar stock: ${error.message}`);
    }
  }

  /**
   * Eliminar un producto de la base de datos
   * @param {String} id - ID del producto a eliminar
   * @returns {Promise<Object>} Producto eliminado
   * @throws {Error} Si el producto no existe o hay error en la eliminación
   * 
   * @example
   * const productoEliminado = await ProductoDAO.eliminar("507f1f77bcf86cd799439011");
   */
  async eliminar(id) {
    try {
      const producto = await Producto.findByIdAndDelete(id);
      
      if (!producto) {
        throw new Error(`Producto con ID ${id} no encontrado`);
      }
      
      console.log(`  Producto eliminado: ${producto.nombre}`);
      return producto;
    } catch (error) {
      if (error.name === 'CastError') {
        throw new Error(`ID de producto inválido: ${id}`);
      }
      throw new Error(`Error al eliminar producto: ${error.message}`);
    }
  }

  /**
   * Verificar si hay stock disponible suficiente
   * @param {String} id - ID del producto
   * @param {Number} cantidadRequerida - Cantidad que se necesita
   * @returns {Promise<Boolean>} true si hay stock suficiente, false si no
   * @throws {Error} Si el producto no existe o hay error en la consulta
   * 
   * @example
   * const hayStock = await ProductoDAO.verificarDisponibilidad("507f1f77bcf86cd799439011", 10);
   * if (hayStock) {
   *   console.log("Hay suficiente stock");
   * }
   */
  async verificarDisponibilidad(id, cantidadRequerida) {
    try {
      const producto = await this.obtenerPorId(id);
      const disponible = producto.cantidad >= cantidadRequerida;
      
      console.log(
        ` Verificación de stock: ${producto.nombre} - ` +
        `Disponible: ${producto.cantidad}, Requerido: ${cantidadRequerida} - ` +
        `${disponible ? ' Suficiente' : '❌ Insuficiente'}`
      );
      
      return disponible;
    } catch (error) {
      throw new Error(`Error al verificar disponibilidad: ${error.message}`);
    }
  }

  /**
   * Obtener productos con stock bajo (menor al umbral especificado)
   * @param {Number} umbral - Cantidad mínima de stock (por defecto 10)
   * @returns {Promise<Array>} Lista de productos con stock bajo
   * @throws {Error} Si hay un error en la consulta
   * 
   * @example
   * // Obtener productos con menos de 10 unidades
   * const stockBajo = await ProductoDAO.obtenerStockBajo();
   * 
   * // Obtener productos con menos de 20 unidades
   * const stockBajo = await ProductoDAO.obtenerStockBajo(20);
   */
  async obtenerStockBajo(umbral = 10) {
    try {
      const productos = await Producto.find({ 
        cantidad: { $lt: umbral } 
      }).sort({ cantidad: 1 });
      
      console.log(
        `  Se encontraron ${productos.length} productos ` +
        `con stock menor a ${umbral} unidades`
      );
      
      return productos;
    } catch (error) {
      throw new Error(`Error al obtener productos con stock bajo: ${error.message}`);
    }
  }

  /**
   * Obtener productos por rango de precio
   * @param {Number} precioMin - Precio mínimo
   * @param {Number} precioMax - Precio máximo
   * @returns {Promise<Array>} Lista de productos en el rango de precio
   * @throws {Error} Si hay un error en la consulta
   * 
   * @example
   * const productos = await ProductoDAO.obtenerPorRangoPrecio(1000, 5000);
   */
  async obtenerPorRangoPrecio(precioMin, precioMax) {
    try {
      const productos = await Producto.find({
        precio: {
          $gte: precioMin,
          $lte: precioMax
        }
      }).sort({ precio: 1 });
      
      console.log(
        ` Se encontraron ${productos.length} productos ` +
        `entre $${precioMin} y $${precioMax}`
      );
      
      return productos;
    } catch (error) {
      throw new Error(`Error al obtener productos por rango de precio: ${error.message}`);
    }
  }

  /**
   * Contar el total de productos en la base de datos
   * @param {Object} filtros - Filtros opcionales
   * @returns {Promise<Number>} Cantidad total de productos
   * @throws {Error} Si hay un error en la consulta
   * 
   * @example
   * const total = await ProductoDAO.contarProductos();
   */
  async contarProductos(filtros = {}) {
    try {
      const cantidad = await Producto.countDocuments(filtros);
      console.log(` Total de productos: ${cantidad}`);
      return cantidad;
    } catch (error) {
      throw new Error(`Error al contar productos: ${error.message}`);
    }
  }

  /**
   * Obtener el valor total del inventario
   * @returns {Promise<Number>} Valor total del inventario (precio * cantidad)
   * @throws {Error} Si hay un error en el cálculo
   * 
   * @example
   * const valorTotal = await ProductoDAO.obtenerValorInventario();
   * console.log(`Valor del inventario: $${valorTotal}`);
   */
  async obtenerValorInventario() {
    try {
      const productos = await Producto.find();
      const valorTotal = productos.reduce((total, producto) => {
        return total + (producto.precio * producto.cantidad);
      }, 0);
      
      console.log(` Valor total del inventario: $${valorTotal.toFixed(2)}`);
      return valorTotal;
    } catch (error) {
      throw new Error(`Error al calcular valor del inventario: ${error.message}`);
    }
  }
}

// Exportar una instancia única del DAO (Singleton pattern)
module.exports = new ProductoDAO();