
// models/Producto.js
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre debe tener al menos 3 caracteres']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo']
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad es obligatoria'],
    min: [0, 'La cantidad no puede ser negativa'],
    validate: {
      validator: Number.isInteger,
      message: 'La cantidad debe ser un número entero'
    }
  }
}, {
  timestamps: true,
  versionKey: false
});

// Método virtual para calcular el valor total del inventario
productoSchema.virtual('valorInventario').get(function() {
  return this.precio * this.cantidad;
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;