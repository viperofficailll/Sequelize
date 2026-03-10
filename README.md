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

# 📝 Todo REST API

A simple, fully-typed REST API for managing todos — built with **Express**, **Sequelize**, and **Zod** schema validation.

---

## 📁 Project Structure

```
├── controllers/
│   └── todo.controller.ts       # Route handlers
├── models/
│   └── todo.model.ts            # Sequelize model
├── schemas/
│   └── todo.schema.ts           # Zod validation schemas
├── utils/
│   ├── apiResponse.ts           # Standardized success responses
│   └── apiError.ts              # Standardized error responses
└── routes/
    └── todo.routes.ts           # Express router
```

---

## 🚀 Base URL

```
/api/todos
```

---

## 📦 Data Model

| Field         | Type      | Description                        |
|---------------|-----------|------------------------------------|
| `id`          | `number`  | Auto-incremented primary key       |
| `Title`       | `string`  | Title of the todo (required)       |
| `Description` | `string`  | Optional description               |
| `IsCompleted` | `boolean` | Completion status (default: false) |
| `DateCreated` | `Date`    | Timestamp when created             |
| `DateUpdated` | `Date`    | Timestamp of last update           |

---

## 📡 Endpoints

---

### `GET /api/todos`
> Retrieve all todos.

**Response `200 OK`**
```json
{
  "status": 200,
  "message": "Todos retrieved successfully",
  "data": [
    {
      "id": 1,
      "Title": "Buy groceries",
      "Description": "Milk, eggs, bread",
      "IsCompleted": false,
      "DateCreated": "2026-03-10T08:00:00.000Z",
      "DateUpdated": "2026-03-10T08:00:00.000Z"
    }
  ]
}
```

---

### `POST /api/todos`
> Create a new todo.

**Request Body**

| Field         | Type     | Required | Constraints          |
|---------------|----------|----------|----------------------|
| `Title`       | `string` | ✅ Yes   | 1–255 characters     |
| `Description` | `string` | ❌ No    | —                    |

**Example Request**
```json
{
  "Title": "Buy groceries",
  "Description": "Milk, eggs, bread"
}
```

**Response `201 Created`**
```json
{
  "status": 201,
  "message": "Todo created successfully",
  "data": {
    "id": 1,
    "Title": "Buy groceries",
    "Description": "Milk, eggs, bread",
    "IsCompleted": false,
    "DateCreated": "2026-03-10T08:00:00.000Z",
    "DateUpdated": "2026-03-10T08:00:00.000Z"
  }
}
```

---

### `GET /api/todos/:id`
> Retrieve a single todo by its ID.

**Path Parameters**

| Parameter | Type     | Description              |
|-----------|----------|--------------------------|
| `id`      | `number` | Must be a valid integer  |

**Response `200 OK`**
```json
{
  "status": 200,
  "message": "Todo retrieved successfully",
  "data": {
    "id": 1,
    "Title": "Buy groceries",
    "Description": "Milk, eggs, bread",
    "IsCompleted": false,
    "DateCreated": "2026-03-10T08:00:00.000Z",
    "DateUpdated": "2026-03-10T08:00:00.000Z"
  }
}
```

---

### `PUT /api/todos/:id`
> Update an existing todo by its ID. All body fields are optional.

**Path Parameters**

| Parameter | Type     | Description              |
|-----------|----------|--------------------------|
| `id`      | `number` | Must be a valid integer  |

**Request Body** *(all fields optional)*

| Field         | Type      | Constraints                               |
|---------------|-----------|-------------------------------------------|
| `Title`       | `string`  | Non-empty if provided, max 255 characters |
| `Description` | `string`  | —                                         |
| `IsCompleted` | `boolean` | `true` or `false`                         |

**Example Request**
```json
{
  "Title": "Updated title",
  "IsCompleted": true
}
```

**Response `200 OK`**
```json
{
  "status": 200,
  "message": "Todo updated successfully",
  "data": {
    "id": 1,
    "Title": "Updated title",
    "Description": "Milk, eggs, bread",
    "IsCompleted": true,
    "DateCreated": "2026-03-10T08:00:00.000Z",
    "DateUpdated": "2026-03-10T09:30:00.000Z"
  }
}
```

---

### `DELETE /api/todos/:id`
> Delete a todo by its ID.

**Path Parameters**

| Parameter | Type     | Description              |
|-----------|----------|--------------------------|
| `id`      | `number` | Must be a valid integer  |

**Response `200 OK`**
```json
{
  "status": 200,
  "message": "Todo deleted successfully",
  "data": null
}
```

---

## ❌ Error Responses

All errors follow a consistent response shape.

---

### `400` — Validation Error
Returned when the request body or path params fail Zod schema validation.

```json
{
  "status": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "Title",
      "message": "Title is required"
    }
  ]
}
```

---

### `404` — Not Found
Returned when no todo matches the given ID.

```json
{
  "status": 404,
  "message": "Todo not found"
}
```

---

### `500` — Internal Server Error
Returned on unexpected failures.

```json
{
  "status": 500,
  "message": "Failed to retrieve todos"
}
```

---

## ✅ Validation Rules

| Field              | Rule                                          |
|--------------------|-----------------------------------------------|
| `id` (path param)  | Must match `/^\d+$/` — numeric string only    |
| `Title` (create)   | Required, 1–255 characters                    |
| `Title` (update)   | Optional; if provided, non-empty, max 255 chars |
| `Description`      | Optional string, no length constraint         |
| `IsCompleted`      | Optional boolean — `true` or `false` only     |

---

## 🔷 Zod Schemas

```typescript
// Create Todo
const createTodoSchema = z.object({
  Title: z.string().min(1).max(255),
  Description: z.string().optional(),
});

// Update Todo
const updateTodoSchema = z.object({
  Title: z.string().min(1).max(255).optional(),
  Description: z.string().optional(),
  IsCompleted: z.boolean().optional(),
});

// ID Param
const todoIdSchema = z.object({
  id: z.string().regex(/^\d+$/),
});
```

---

## 📊 Quick Reference

| Method   | Endpoint          | Description        | Body Required |
|----------|-------------------|--------------------|---------------|
| `GET`    | `/api/todos`      | Get all todos      | —             |
| `POST`   | `/api/todos`      | Create a todo      | ✅ Yes         |
| `GET`    | `/api/todos/:id`  | Get todo by ID     | —             |
| `PUT`    | `/api/todos/:id`  | Update todo by ID  | ❌ Optional    |
| `DELETE` | `/api/todos/:id`  | Delete todo by ID  | —             |