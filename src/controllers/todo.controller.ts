import type { Request, Response } from "express";
import { Todos } from "../models/todo.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { createTodoSchema, updateTodoSchema, todoIdSchema } from "../schemas/todo.schema.js";

export const getAllTodos = async (req: Request, res: Response) => {
  try {
    const todos = await Todos.findAll();
    ApiResponse.ok(todos, "Todos retrieved successfully").send(res);
  } catch (error) {
    const apiError = ApiError.serverError("Failed to retrieve todos");
    res.status(apiError.statusCode).json(apiError);
  }
};

export const addTodo = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = createTodoSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      const errors = validationResult.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      throw ApiError.validationError("Validation failed", errors);
    }

    const { Title, Description } = validationResult.data;

    const newTodo = await Todos.create({
      Title,
      Description,
      DateCreated: new Date(),
      DateUpdated: new Date(),
    });

    ApiResponse.created(newTodo, "Todo created successfully").send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error);
    } else {
      const apiError = ApiError.serverError("Failed to create todo");
      res.status(apiError.statusCode).json(apiError);
    }
  }
};

export const getTodosbyid = async (req: Request, res: Response) => {
  try {
    // Validate request params
    const paramValidation = todoIdSchema.safeParse(req.params);
    
    if (!paramValidation.success) {
      const errors = paramValidation.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      throw ApiError.validationError("Invalid ID parameter", errors);
    }

    const { id } = paramValidation.data;
    const todo = await Todos.findByPk(parseInt(id));

    if (!todo) {
      throw ApiError.notFound("Todo not found");
    }

    ApiResponse.ok(todo, "Todo retrieved successfully").send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error);
    } else {
      const apiError = ApiError.serverError("Failed to retrieve todo");
      res.status(apiError.statusCode).json(apiError);
    }
  }
};

export const updateTodobyid = async (req: Request, res: Response) => {
  try {
    // Validate request params
    const paramValidation = todoIdSchema.safeParse(req.params);
    
    if (!paramValidation.success) {
      const errors = paramValidation.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      throw ApiError.validationError("Invalid ID parameter", errors);
    }

    // Validate request body
    const bodyValidation = updateTodoSchema.safeParse(req.body);
    
    if (!bodyValidation.success) {
      const errors = bodyValidation.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      throw ApiError.validationError("Validation failed", errors);
    }

    const { id } = paramValidation.data;
    const { Title, Description, IsCompleted } = bodyValidation.data;

    const todo = await Todos.findByPk(parseInt(id));

    if (!todo) {
      throw ApiError.notFound("Todo not found");
    }

    await todo.update({
      ...(Title !== undefined && { Title }),
      ...(Description !== undefined && { Description }),
      ...(IsCompleted !== undefined && { IsCompleted }),
      DateUpdated: new Date(),
    });

    ApiResponse.ok(todo, "Todo updated successfully").send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error);
    } else {
      const apiError = ApiError.serverError("Failed to update todo");
      res.status(apiError.statusCode).json(apiError);
    }
  }
};

export const deleteTodobyid = async (req: Request, res: Response) => {
  try {
    // Validate request params
    const paramValidation = todoIdSchema.safeParse(req.params);
    
    if (!paramValidation.success) {
      const errors = paramValidation.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message
      }));
      throw ApiError.validationError("Invalid ID parameter", errors);
    }

    const { id } = paramValidation.data;
    const todo = await Todos.findByPk(parseInt(id));

    if (!todo) {
      throw ApiError.notFound("Todo not found");
    }

    await todo.destroy();

    ApiResponse.ok(null, "Todo deleted successfully").send(res);
  } catch (error) {
    if (error instanceof ApiError) {
      res.status(error.statusCode).json(error);
    } else {
      const apiError = ApiError.serverError("Failed to delete todo");
      res.status(apiError.statusCode).json(apiError);
    }
  }
};
