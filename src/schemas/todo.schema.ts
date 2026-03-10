import { z } from "zod";

// Schema for creating a new todo
export const createTodoSchema = z.object({
  Title: z.string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  Description: z.string().optional(),
});

// Schema for updating a todo
export const updateTodoSchema = z.object({
  Title: z.string()
    .min(1, "Title cannot be empty")
    .max(255, "Title must be less than 255 characters")
    .optional(),
  Description: z.string().optional(),
  IsCompleted: z.boolean().optional(),
});

// Schema for todo ID parameter
export const todoIdSchema = z.object({
  id: z.string().regex(/^\d+$/, "ID must be a valid number"),
});

// Type exports
export type CreateTodoRequest = z.infer<typeof createTodoSchema>;
export type UpdateTodoRequest = z.infer<typeof updateTodoSchema>;
export type TodoIdParams = z.infer<typeof todoIdSchema>;