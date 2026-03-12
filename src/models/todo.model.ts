import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/dbconn.js";

// Define the model lazily
let TodosModel: any = null;

const getTodosModel = () => {
  if (!TodosModel) {
    TodosModel = sequelize.define(
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
  }
  return TodosModel;
};

// Export a proxy that delegates to the lazy model
export const Todos = new Proxy({} as any, {
  get(target, prop) {
    const model = getTodosModel();
    const value = model[prop];
    return typeof value === 'function' ? value.bind(model) : value;
  }
});
