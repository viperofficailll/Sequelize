import { it, describe, expect } from "vitest";
import request from "supertest";
import { App } from "../../src/app.js";

describe("Test the PUT Todos functionality", () => {
  let createdTodoId: number;

  // Helper function to create a todo for testing
  const createTestTodo = async () => {
    const response = await request(App)
      .post("/api/v1/todo")
      .send({
        Title: "Test Todo for Update",
        Description: "This todo will be updated",
      });
    return response.body.data.id;
  };

  it("should update a todo successfully", async () => {
    // arrange
    createdTodoId = await createTestTodo();
    const endpoint = `/api/v1/todo/${createdTodoId}`;
    const updatePayload = {
      Title: "Updated Todo Title",
      Description: "Updated description",
      IsCompleted: true,
    };

    // act
    const res = await request(App).put(endpoint).send(updatePayload);

    // assert
    // 1. Check status
    expect(res.status).toBe(200);
    
    // 2. Check message
    expect(res.body.message).toBe("Todo updated successfully");
    
    // 3. Check success
    expect(res.body.success).toBe(true);
    
    // Additional assertions
    expect(res.body.data).toBeDefined();
    expect(res.body.data.Title).toBe(updatePayload.Title);
    expect(res.body.data.Description).toBe(updatePayload.Description);
    expect(res.body.data.IsCompleted).toBe(updatePayload.IsCompleted);
    expect(res.body.data.id).toBe(createdTodoId);
    expect(res.body.data.UpdatedAt).toBeDefined();
  });

  it("should update only Title field", async () => {
    // arrange
    createdTodoId = await createTestTodo();
    const endpoint = `/api/v1/todo/${createdTodoId}`;
    const updatePayload = {
      Title: "Only Title Updated",
    };

    // act
    const res = await request(App).put(endpoint).send(updatePayload);

    // assert
    // 1. Check status
    expect(res.status).toBe(200);
    
    // 2. Check message
    expect(res.body.message).toBe("Todo updated successfully");
    
    // 3. Check success
    expect(res.body.success).toBe(true);
    
    // Additional assertions
    expect(res.body.data.Title).toBe(updatePayload.Title);
    expect(res.body.data.Description).toBe("This todo will be updated"); // Original value
    expect(res.body.data.IsCompleted).toBe(false); // Original value
  });

  it("should update only IsCompleted field", async () => {
    // arrange
    createdTodoId = await createTestTodo();
    const endpoint = `/api/v1/todo/${createdTodoId}`;
    const updatePayload = {
      IsCompleted: true,
    };

    // act
    const res = await request(App).put(endpoint).send(updatePayload);

    // assert
    // 1. Check status
    expect(res.status).toBe(200);
    
    // 2. Check message
    expect(res.body.message).toBe("Todo updated successfully");
    
    // 3. Check success
    expect(res.body.success).toBe(true);
    
    // Additional assertions
    expect(res.body.data.IsCompleted).toBe(true);
    expect(res.body.data.Title).toBe("Test Todo for Update"); // Original value
    expect(res.body.data.Description).toBe("This todo will be updated"); // Original value
  });

  it("should return 404 for non-existent todo", async () => {
    // arrange
    const nonExistentId = 99999;
    const endpoint = `/api/v1/todo/${nonExistentId}`;
    const updatePayload = {
      Title: "Updated Title",
    };

    // act
    const res = await request(App).put(endpoint).send(updatePayload);

    // assert
    // 1. Check status
    expect(res.status).toBe(404);
    
    // 2. Check message
    expect(res.body.message).toBe("Todo not found");
    
    // 3. Check success
    expect(res.body.success).toBe(false);
  });

  it("should return validation error for invalid ID", async () => {
    // arrange
    const invalidId = "invalid-id";
    const endpoint = `/api/v1/todo/${invalidId}`;
    const updatePayload = {
      Title: "Updated Title",
    };

    // act
    const res = await request(App).put(endpoint).send(updatePayload);

    // assert
    // 1. Check status
    expect(res.status).toBe(422);
    
    // 2. Check message
    expect(res.body.message).toBe("Invalid ID parameter");
    
    // 3. Check success
    expect(res.body.success).toBe(false);
    
    // Additional assertions
    expect(res.body.errors).toBeDefined();
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it("should return validation error for empty Title", async () => {
    // arrange
    createdTodoId = await createTestTodo();
    const endpoint = `/api/v1/todo/${createdTodoId}`;
    const updatePayload = {
      Title: "",
    };

    // act
    const res = await request(App).put(endpoint).send(updatePayload);

    // assert
    // 1. Check status
    expect(res.status).toBe(422);
    
    // 2. Check message
    expect(res.body.message).toBe("Validation failed");
    
    // 3. Check success
    expect(res.body.success).toBe(false);
    
    // Additional assertions
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.length).toBeGreaterThan(0);
  });

  it("should return validation error for invalid IsCompleted type", async () => {
    // arrange
    createdTodoId = await createTestTodo();
    const endpoint = `/api/v1/todo/${createdTodoId}`;
    const updatePayload = {
      IsCompleted: "not-a-boolean",
    };

    // act
    const res = await request(App).put(endpoint).send(updatePayload);

    // assert
    // 1. Check status
    expect(res.status).toBe(422);
    
    // 2. Check message
    expect(res.body.message).toBe("Validation failed");
    
    // 3. Check success
    expect(res.body.success).toBe(false);
    
    // Additional assertions
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors.some((error: any) => error.field === 'IsCompleted')).toBe(true);
  });

  it("should handle empty update payload", async () => {
    // arrange
    createdTodoId = await createTestTodo();
    const endpoint = `/api/v1/todo/${createdTodoId}`;
    const updatePayload = {};

    // act
    const res = await request(App).put(endpoint).send(updatePayload);

    // assert
    // 1. Check status
    expect(res.status).toBe(200);
    
    // 2. Check message
    expect(res.body.message).toBe("Todo updated successfully");
    
    // 3. Check success
    expect(res.body.success).toBe(true);
    
    // Additional assertions - values should remain unchanged
    expect(res.body.data.Title).toBe("Test Todo for Update");
    expect(res.body.data.Description).toBe("This todo will be updated");
    expect(res.body.data.IsCompleted).toBe(false);
  });
});