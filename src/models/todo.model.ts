import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbconn.js";

export const Todos = sequelize.define(
  "Todos",
  {
    // Model attributes are defined here
    Title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING,
    },
    IsCompleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    DateCreated: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    DateUpdated: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    // Other model options go here
    // freezeTableName: true,
    tableName: "Todos",
  },
);

// `sequelize.define` also returns the model
console.log(Todos === sequelize.models.Todos); // true
