import { DataTypes } from "sequelize";

import sequelize from "../config/config.js";

const Autor = sequelize.define("Autor", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
},{
    tableName: "autores",
    timestamps: false
});

export default Autor;
