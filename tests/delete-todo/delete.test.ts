import { it, describe, expect } from "vitest";
import request from "supertest";
import { App } from "../../src/app.js";

describe("Test the DELETE Todos functionality", () => {
  let createdTodoId: number;

  // Helper function to create a todo for testing
  const createTestTodo = async () => {
    const response = await request(App)
      .post("/api/v1/todo")
      .send({
        Title: "Test Todo for Delete",
        Description: "This todo will be deleted",
      });
    return response.body.data.id;
  };

  it("should delete a todo successfully", async () => {
    // arrange
    createdTodoId = await createTestTodo();
    const endpoint = `/api/v1/todo/${createdTodoId}`;

    // act
    const res = await request(App).delete(endpoint);

    // assert
    // 1. Check status
    expect(res.status).toBe(200);
    
    // 2. Check message
    expect(res.body.message).toBe("Todo deleted successfully");
    
    // 3. Check success
    expect(res.body.success).toBe(true);
    
    // Additional assertions
    expect(res.body.data).toBeNull();
  });

  it("should verify todo is actually deleted", async () => {
    // arrange
    createdTodoId = await createTestTodo();
    const endpoint = `/api/v1/todo/${createdTodoId}`;

    // act - delete the todo
    await request(App).delete(endpoint);

    // act - try to get the deleted todo
    const getRes = await request(App).get(endpoint);

    // assert - should return 404
    expect(getRes.status).toBe(404);
    expect(getRes.body.message).toBe("Todo not found");
    expect(getRes.body.success).toBe(false);
  });

  it("should return 404 for non-existent todo", async () => {
    // arrange
    const nonExistentId = 99999;
    const endpoint = `/api/v1/todo/${nonExistentId}`;

    // act
    const res = await request(App).delete(endpoint);

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

    // act
    const res = await request(App).delete(endpoint);

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
    expect(res.body.errors.some((error: any) => error.field === 'id')).toBe(true);
  });

  it("should return validation error for non-numeric ID", async () => {
    // arrange
    const nonNumericId = "abc123";
    const endpoint = `/api/v1/todo/${nonNumericId}`;

    // act
    const res = await request(App).delete(endpoint);

    // assert
    // 1. Check status
    expect(res.status).toBe(422);
    
    // 2. Check message
    expect(res.body.message).toBe("Invalid ID parameter");
    
    // 3. Check success
    expect(res.body.success).toBe(false);
    
    // Additional assertions
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].message).toContain("ID must be a valid positive number");
  });

  it("should handle multiple delete attempts on same todo", async () => {
    // arrange
    createdTodoId = await createTestTodo();
    const endpoint = `/api/v1/todo/${createdTodoId}`;

    // act - first delete (should succeed)
    const firstDeleteRes = await request(App).delete(endpoint);

    // assert - first delete successful
    expect(firstDeleteRes.status).toBe(200);
    expect(firstDeleteRes.body.message).toBe("Todo deleted successfully");
    expect(firstDeleteRes.body.success).toBe(true);

    // act - second delete attempt (should fail)
    const secondDeleteRes = await request(App).delete(endpoint);

    // assert - second delete should return 404
    expect(secondDeleteRes.status).toBe(404);
    expect(secondDeleteRes.body.message).toBe("Todo not found");
    expect(secondDeleteRes.body.success).toBe(false);
  });

  it("should handle deletion with zero ID", async () => {
    // arrange
    const zeroId = 0;
    const endpoint = `/api/v1/todo/${zeroId}`;

    // act
    const res = await request(App).delete(endpoint);

    // assert
    // 1. Check status
    expect(res.status).toBe(422);
    
    // 2. Check message
    expect(res.body.message).toBe("Invalid ID parameter");
    
    // 3. Check success
    expect(res.body.success).toBe(false);
  });

  it("should handle deletion with negative ID", async () => {
    // arrange
    const negativeId = -1;
    const endpoint = `/api/v1/todo/${negativeId}`;

    // act
    const res = await request(App).delete(endpoint);

    // assert
    // 1. Check status
    expect(res.status).toBe(422);
    
    // 2. Check message
    expect(res.body.message).toBe("Invalid ID parameter");
    
    // 3. Check success
    expect(res.body.success).toBe(false);
  });
});