export class ProductoVenta {
    constructor(id, producto_id, venta_id, cantidadVendida, subtotal, precioVenta) {
        this.id = id;
        this.producto_id = producto_id;
        this.venta_id = venta_id;
        this.cantidadVendida = cantidadVendida;
        this.subtotal = subtotal;
        this.precioVenta = precioVenta;
    }
}