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





# Sequelize CLI — Setup & Migrations Guide

## 1. Install Dependencies

```bash
npm install sequelize mysql2 dotenv
npm install --save-dev sequelize-cli
```

---

## 2. Create `.sequelizerc`

In your project root, create a `.sequelizerc` file to define folder paths:

```js
const path = require("path");

module.exports = {
  config:            path.resolve("config", "config.cjs"),
  "models-path":     path.resolve("models"),
  "seeders-path":    path.resolve("seeders"),
  "migrations-path": path.resolve("migrations"),
};
```

---

## 3. Configure Database (`config/config.cjs`)

```js
require("dotenv").config({ path: "config.env" });

module.exports = {
  development: {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
```


## 5. Initialize Sequelize

```bash
npx sequelize init
```

This creates the `models/`, `migrations/`, and `seeders/` folders.

---

## 6. Migrations

### Generate a migration
```bash
npx sequelize migration:generate --name <migration-name>
```

### Run all pending migrations
```bash
npx sequelize db:migrate
```

### Undo migrations
```bash
npx sequelize db:migrate:undo                          # undo last
npx sequelize db:migrate:undo --name <migration-name> # undo specific
npx sequelize db:migrate:undo:all                      # undo all
```

---

## 7. Example — Create Table Migration

```js
// migrations/XXXXXX-create-todos.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TodosfromMigration", {
      id:          { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
      Title:       { type: Sequelize.STRING, allowNull: false },
      Description: { type: Sequelize.STRING, allowNull: true },
      IsCompleted: { type: Sequelize.BOOLEAN, allowNull: true, defaultValue: false },
      CreatedAt:   { type: Sequelize.DATE, allowNull: false },
      UpdatedAt:   { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("TodosfromMigration");
  },
};
```

---

## 8. Example — Add Column Migration

```js
// migrations/XXXXXX-addVerification.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("TodosfromMigration", "Verified", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("TodosfromMigration", "Verified");
  },
};
```

---

## Quick Reference

| Task                | Command                                           |
|---------------------|---------------------------------------------------|
| Install CLI         | `npm install --save-dev sequelize-cli`            |
| Init project        | `npx sequelize init`                              |
| Generate migration  | `npx sequelize migration:generate --name <name>`  |
| Run migrations      | `npx sequelize db:migrate`                        |
| Undo last migration | `npx sequelize db:migrate:undo`                   |
| Undo all migrations | `npx sequelize db:migrate:undo:all`               |