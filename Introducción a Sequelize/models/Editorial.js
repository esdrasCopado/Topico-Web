import { DataTypes } from "sequelize";
import sequelize from "../config/config.js";

const Editorial = sequelize.define("Editorial", {
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
    tableName: "editoriales",
    timestamps: false
});

export default Editorial;