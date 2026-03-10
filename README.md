# Node.js + Sequelize + MySQL2

A simple backend setup using **Node.js**, **Sequelize ORM**, and **MySQL2** for connecting and interacting with a MySQL database.

---

## 📦 Installation

Install the required dependencies:

```bash
npm install --save sequelize
npm install --save mysql2

```

## Creating Connection

```js
import { Sequelize } from "sequelize";
export const dbconn = async () => {
  const sequelize = new Sequelize(
    `${process.env.DATABASE_NAME}`,
    `${process.env.DATABASE_USER}`,
    `${process.env.DATABASE_PASSWORD}`,
    {
      host: "localhost",
      dialect: "mysql",
    },
  );
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
```

# Creating a model

```ts
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
```
# after doing creating the model you have to sync to the db

```ts
import { App } from "./app.js";
import { dbconn } from "./config/dbconn.js";
import { Todos } from "./models/todo.model.js";
const PORT = process.env.PORT;

Todos.sync();
App.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
  dbconn();
});

```
## 🔄 Model Synchronization

Sequelize provides `sync()` methods to align your model definitions with the actual database tables.

### Sync Options

| Method | Behavior |
|--------|----------|
| `User.sync()` | Creates the table **if it doesn't exist**; does nothing if it already exists |
| `User.sync({ force: true })` | **Drops** the existing table and recreates it from scratch |
| `User.sync({ alter: true })` | **Inspects** the current table state and applies only the necessary changes to match the model |

### Usage Examples
```js