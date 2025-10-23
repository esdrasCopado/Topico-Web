# Usando Transacciones

Sistema de gestión de ventas con MySQL que implementa transacciones para garantizar la integridad de los datos. Utiliza el patrón DAO (Data Access Object) para manejar operaciones CRUD sobre productos y ventas, con control automático de inventario mediante transacciones.

## 📥 Cómo descargar solo este proyecto

Puedes descargar únicamente esta carpeta del repositorio usando alguna de estas opciones:

### Opción 1: Git Sparse Checkout (Recomendado)

```bash
# Crear un nuevo directorio
mkdir usando-transacciones
cd usando-transacciones

# Inicializar repositorio git
git init

# Agregar el repositorio remoto
git remote add origin https://github.com/esdrasCopado/Topico-Web.git

# Habilitar sparse-checkout
git config core.sparseCheckout true

# Especificar la carpeta que quieres descargar
echo "Usando transacciones/*" >> .git/info/sparse-checkout

# Descargar los archivos
git pull origin main
```

### Opción 2: Clonar el repositorio completo

```bash
# Clonar el repositorio completo
git clone https://github.com/esdrasCopado/Topico-Web.git

# Navegar a la carpeta
cd Topico-Web/Usando\ transacciones
```

### Opción 3: Descargar desde GitHub

1. Ve al repositorio: https://github.com/esdrasCopado/Topico-Web
2. Navega a la carpeta `Usando transacciones`
3. Descarga los archivos manualmente o usa [DownGit](https://minhaskamal.github.io/DownGit)

## 🚀 Instalación

Una vez descargado el proyecto:

```bash
# Navegar al directorio del proyecto
cd "Usando transacciones"

# Instalar las dependencias
npm install
```

## ⚙️ Configuración

### 1. Configurar la base de datos

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=ventas_db
```

### 2. Crear la base de datos y tablas

Ejecuta los siguientes comandos SQL en tu servidor MySQL:

```sql
-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS ventas_db;
USE ventas_db;

-- Tabla de productos
CREATE TABLE IF NOT EXISTS producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    cantidad INT NOT NULL DEFAULT 0
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0,
    iva DECIMAL(10, 2) NOT NULL DEFAULT 0,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla relación producto-venta
CREATE TABLE IF NOT EXISTS productoventa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidadVendida INT NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    precioVenta DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (venta_id) REFERENCES venta(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES producto(id) ON DELETE CASCADE
);
```

## 📊 Estructura del Proyecto

```
Usando transacciones/
├── config/
│   └── db.js              # Configuración de conexión a MySQL
├── models/
│   ├── Producto.js        # Modelo de Producto
│   ├── Venta.js           # Modelo de Venta
│   └── ProductoVenta.js   # Modelo de ProductoVenta
├── daos/
│   ├── ProductoDAO.js     # DAO para operaciones CRUD de Producto
│   ├── VentaDAO.js        # DAO para operaciones CRUD de Venta
│   └── ProductoVentaDAO.js # DAO con transacciones para ProductoVenta
├── index.js               # Archivo principal con ejemplos de uso
├── package.json
└── README.md
```

## 🎯 Uso

El archivo `index.js` contiene ejemplos de uso de todas las operaciones. Para ejecutar los ejemplos:

```bash
node index.js
```

### Ejemplos de operaciones disponibles:

#### Productos
```javascript
// Crear producto
const prod = await ProductoDAO.create({ 
    nombre: 'Laptop', 
    precio: 15000, 
    cantidad: 10 
});

// Listar todos los productos
const productos = await ProductoDAO.getAll();

// Actualizar producto
await ProductoDAO.update(id, {
    nombre: 'Laptop Gamer',
    precio: 18000,
    cantidad: 8
});

// Eliminar producto
await ProductoDAO.delete(id);
```

#### Ventas
```javascript
// Crear venta
const venta = await VentaDAO.create({ total: 0, iva: 0 });

// Actualizar venta
await VentaDAO.update(ventaId, { total: 2000, iva: 320 });
```

#### Producto-Venta (con Transacciones)
```javascript
// Crear producto-venta con transacción automática
// Reduce el inventario del producto automáticamente
const pv = await ProductoVentaDAO.create({
    idVenta: ventaId,
    idProducto: productoId,
    cantidadVendida: 2,
    precioVenta: 500
});
```

## 🔐 Características de Transacciones

El sistema implementa transacciones en `ProductoVentaDAO.create()` para:

1. **Registrar la venta**: Inserta el registro en `productoventa`
2. **Actualizar inventario**: Reduce la cantidad del producto vendido
3. **Garantizar atomicidad**: Si alguna operación falla, se hace rollback de todos los cambios

Esto asegura que:
- No se pueden vender más productos de los disponibles
- El inventario siempre está sincronizado con las ventas
- No hay inconsistencias en caso de errores

## 📦 Dependencias

- **dotenv**: ^17.2.2 - Gestión de variables de entorno
- **mysql2**: ^3.15.0 - Cliente MySQL con soporte para Promises

## 👨‍💻 Autor

Esdras Copado

## 📄 Licencia

ISC
