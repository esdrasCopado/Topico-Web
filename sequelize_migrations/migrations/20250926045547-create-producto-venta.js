'use strict';
/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('ProductoVenta', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    idventa: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Venta',
        key: 'id'
      },
    },
    idproducto: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Productos',
        key: 'id',
      },
    },
    cantidadvendida: {
      type: Sequelize.INTEGER
    },
    subtotal: {
      type: Sequelize.DECIMAL
    },
    precioVenta: {
      type: Sequelize.DECIMAL
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('ProductoVenta');
}