import { it, describe, expect } from "vitest";
import request from "supertest";
import { App } from "../../src/app.js";

describe("Test the post Todos functionality", () => {
  it("should post the todo", async () => {
    // arrange ---> bring the necessary things
    const endpoint = "/api/v1/todo";
    const userPayload = {
      Title: "test for test",
      Description: "test for description",
    };

    // act --> execute
    const res = await request(App).post(endpoint).send(userPayload);

    // assert --> verify the results
    // 1. Check status
    expect(res.status).toBe(201);
    
    // 2. Check message
    expect(res.body.message).toBe("Todo created successfully");
    
    // 3. Check success
    expect(res.body.success).toBe(true);
    
    // Additional assertions for completeness
    expect(res.body.data).toBeDefined();
    expect(res.body.data.Title).toBe(userPayload.Title);
    expect(res.body.data.Description).toBe(userPayload.Description);
    expect(res.body.data.IsCompleted).toBe(false);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.CreatedAt).toBeDefined();
    expect(res.body.data.UpdatedAt).toBeDefined();
  });

  it("should return validation error for missing Title", async () => {
    // arrange
    const endpoint = "/api/v1/todo";
    const invalidPayload = {
      Description: "test description without title",
    };

    // act
    const res = await request(App).post(endpoint).send(invalidPayload);

    // assert
    // 1. Check status
    expect(res.status).toBe(422);
    
    // 2. Check message
    expect(res.body.message).toBe("Validation failed");
    
    // 3. Check success
    expect(res.body.success).toBe(false);
    
    // Additional assertions
    expect(res.body.errors).toBeDefined();
    expect(Array.isArray(res.body.errors)).toBe(true);
  });

  it("should return validation error for empty Title", async () => {
    // arrange
    const endpoint = "/api/v1/todo";
    const invalidPayload = {
      Title: "",
      Description: "test description with empty title",
    };

    // act
    const res = await request(App).post(endpoint).send(invalidPayload);

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

  it("should create todo with only Title (Description optional)", async () => {
    // arrange
    const endpoint = "/api/v1/todo";
    const userPayload = {
      Title: "Todo with only title",
    };

    // act
    const res = await request(App).post(endpoint).send(userPayload);

    // assert
    // 1. Check status
    expect(res.status).toBe(201);
    
    // 2. Check message
    expect(res.body.message).toBe("Todo created successfully");
    
    // 3. Check success
    expect(res.body.success).toBe(true);
    
    // Additional assertions
    expect(res.body.data.Title).toBe(userPayload.Title);
    expect(res.body.data.Description).toBeUndefined();
    expect(res.body.data.IsCompleted).toBe(false);
  });
});
