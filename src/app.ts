import express from "express";
import { todoRouter } from "./routes/todo.routes.js";
export const App = express();

App.use(express.json());
App.use("/api/v1/todo", todoRouter);
