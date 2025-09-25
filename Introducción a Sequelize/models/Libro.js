import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const Libro = sequelize.define("Libro", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  autorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  editorialId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: "libros",
  timestamps: false
});

export default Libro;
