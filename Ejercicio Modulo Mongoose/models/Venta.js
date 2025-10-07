// models/Venta.js
const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
  total: {
    type: Number,
    required: [true, 'El total es obligatorio'],
    min: [0, 'El total no puede ser negativo']
  },
  iva: {
    type: Number,
    required: [true, 'El IVA es obligatorio'],
    min: [0, 'El IVA no puede ser negativo']
  },
  procductos: [{
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: [true, 'El ID del producto es obligatorio']
    },
    cantidadVendida: {
      type: Number,
      required: [true, 'La cantidad vendida es obligatoria'],
      min: [1, 'Debe vender al menos 1 unidad'],
      validate: {
        validator: Number.isInteger,
        message: 'La cantidad vendida debe ser un número entero'
      }
    },
    precioVenta: {
      type: Number,
      required: [true, 'El precio de venta es obligatorio'],
      min: [0, 'El precio de venta no puede ser negativo']
    },
    subtotal: {
      type: Number,
      required: [true, 'El subtotal es obligatorio'],
      min: [0, 'El subtotal no puede ser negativo']
    }
  }]
}, {
  timestamps: true,
  versionKey: false
});

// Validación: El array de productos no puede estar vacío
ventaSchema.path('procductos').validate(function(value) {
  return value && value.length > 0;
}, 'La venta debe incluir al menos un producto');

// Método para calcular el total antes de guardar
ventaSchema.pre('save', function(next) {
  // Calcular subtotales
  this.procductos.forEach(item => {
    item.subtotal = item.cantidadVendida * item.precioVenta;
  });
  
  // Calcular total sin IVA
  const subtotalGeneral = this.procductos.reduce((sum, item) => sum + item.subtotal, 0);
  
  // Si no se especificó el total, calcularlo
  if (!this.total) {
    this.total = subtotalGeneral + this.iva;
  }
  
  next();
});

const Venta = mongoose.model('Venta', ventaSchema);

module.exports = Venta;