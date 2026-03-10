import express from "express";
import {
  addTodo,
  deleteTodobyid,
  getAllTodos,
  getTodosbyid,
  updateTodobyid,
} from "../controllers/todo.controller.js";

export const todoRouter = express.Router();
todoRouter.get("/", getAllTodos);
todoRouter.post("/", addTodo);
todoRouter.get("/:id", getTodosbyid);
todoRouter.put("/:id", updateTodobyid);
todoRouter.delete("/:id", deleteTodobyid);
