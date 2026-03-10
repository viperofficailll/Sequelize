import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbconn.js";

export const Todos = sequelize.define(
  "Todos",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    IsCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    tableName: "TodosfromMigration",
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
  },
);
