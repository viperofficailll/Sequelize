# Testing nodejs application

## Database Configuration for Testing

### 🎯 Overview

Our application uses **separate databases** for development and testing to ensure:
- Tests don't interfere with development data
- Clean test environment for each test run
- Safe parallel development and testing

### 🔧 How Configuration Works

#### The Magic Line
```typescript
const isTest = process.env.NODE_ENV === 'test';
const config = isTest ? testConfig : devConfig;
```

#### Configuration Flow

**Development Mode (`npm run dev`):**
```
NODE_ENV = undefined → isTest = false → devConfig → 'todos' database
```

**Test Mode (`npm test`):**
```
NODE_ENV = 'test' → isTest = true → testConfig → 'todos_test' database
```

### 📁 Key Files

#### 1. `src/config/dbconn.ts` - Database Connection Logic
```typescript
// Simple config based on NODE_ENV
const isTest = process.env.NODE_ENV === 'test';

// Dev config
const devConfig = {
  database: process.env.DATABASE_NAME || 'todos',
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  host: 'localhost',
  dialect: 'mysql' as const,
};

// Test config (separate test database)
const testConfig = {
  database: process.env.TEST_DATABASE_NAME || 'todos_test',
  username: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  host: 'localhost',
  dialect: 'mysql' as const,
};

// Choose config based on environment
const config = isTest ? testConfig : devConfig;
```

#### 2. `package.json` - Scripts Control Environment
```json
{
  "scripts": {
    "dev": "tsc -b && node --env-file=config.env dist/server.js",
    "test": "cross-env NODE_ENV=test vitest --run",
    "test:watch": "cross-env NODE_ENV=test vitest",
    "test:post": "cross-env NODE_ENV=test vitest run tests/post-todo/post.test.ts"
  }
}
```

#### 3. `config.env` - Environment Variables
```env
PORT=5000
DATABASE_NAME=todos
TEST_DATABASE_NAME=todos_test
DATABASE_USER=root
DATABASE_PASSWORD=your_password
```

#### 4. `tests/setup.ts` - Test Environment Setup
```typescript
import { config } from 'dotenv';

// Load environment variables for testing
config({ path: './config.env' });

console.log('Test environment loaded - using test database');
```

#### 5. `vitest.config.ts` - Vitest Configuration
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    env: {
      NODE_ENV: 'test'
    }
  },
});
```

### 🚀 Usage

#### Running Development Server
```bash
npm run dev
# Uses: todos database
# Logging: enabled
```

#### Running Tests
```bash
npm test
# Uses: todos_test database  
# Logging: disabled (cleaner output)
```

#### Running Tests in Watch Mode
```bash
npm run test:watch
# Uses: todos_test database
# Watches for file changes
```

#### Running Specific Test Files
```bash
npm run test:post    # Runs only POST todo tests
npm run test:update  # Runs only UPDATE todo tests  
npm run test:delete  # Runs only DELETE todo tests
```

### 🗄️ Database Setup

#### Create Test Database
```bash
npx sequelize db:create --env test
```

#### Run Migrations for Test Database
```bash
npx sequelize db:migrate --env test
```

### ✅ Benefits

- **Data Safety**: Tests never touch your development data
- **Clean Testing**: Each test run starts with a clean database
- **Parallel Development**: Develop while tests run simultaneously
- **Environment Isolation**: Different settings for different purposes
- **Simple Logic**: Just one boolean check controls everything

---

## API Testing with Supertest

### 🧪 Testing HTTP Endpoints

We use **Supertest** to test our Express.js API endpoints. Supertest allows us to make HTTP requests to our application and test the responses.

### Installation

```bash
npm install supertest @types/supertest --save-dev
npm install vitest --save-dev
npm install cross-env --save-dev
```

### Basic API Test Structure

```typescript
import { it, describe, expect } from "vitest";
import request from "supertest";
import { App } from "../../src/app.js";

describe("Test the post Todos functionality", () => {
  it("should post the todo", async () => {
    // Arrange - Set up test data
    const endpoint = "/api/v1/todo";
    const userPayload = {
      Title: "test for test",
      Description: "test for description",
    };

    // Act - Execute the request
    const res = await request(App).post(endpoint).send(userPayload);

    // Assert - Verify the results
    expect(res.status).toBe(201);
    expect(res.body.message).toBe("Todo created successfully");
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });
});
```

### 🎯 Complete Test Suite Example

Our todo API tests cover multiple scenarios for all CRUD operations:

#### 1. POST - Successful Creation Test

#### 1. Successful Creation Test
```typescript
it("should post the todo", async () => {
  const endpoint = "/api/v1/todo";
  const userPayload = {
    Title: "test for test",
    Description: "test for description",
  };

  const res = await request(App).post(endpoint).send(userPayload);

  // Test the 3 required fields
  expect(res.status).toBe(201);                                    // 1. Status
  expect(res.body.message).toBe("Todo created successfully");      // 2. Message
  expect(res.body.success).toBe(true);                            // 3. Success

  // Additional data validation
  expect(res.body.data.Title).toBe(userPayload.Title);
  expect(res.body.data.Description).toBe(userPayload.Description);
  expect(res.body.data.IsCompleted).toBe(false);
  expect(res.body.data.id).toBeDefined();
  expect(res.body.data.CreatedAt).toBeDefined();
  expect(res.body.data.UpdatedAt).toBeDefined();
});
```

#### 2. POST - Validation Error Tests
```typescript
it("should return validation error for missing Title", async () => {
  const endpoint = "/api/v1/todo";
  const invalidPayload = {
    Description: "test description without title",
  };

  const res = await request(App).post(endpoint).send(invalidPayload);

  // Test error response structure
  expect(res.status).toBe(422);                           // 1. Status
  expect(res.body.message).toBe("Validation failed");    // 2. Message
  expect(res.body.success).toBe(false);                  // 3. Success
  expect(res.body.errors).toBeDefined();
  expect(Array.isArray(res.body.errors)).toBe(true);
});

it("should return validation error for empty Title", async () => {
  const endpoint = "/api/v1/todo";
  const invalidPayload = {
    Title: "",
    Description: "test description with empty title",
  };

  const res = await request(App).post(endpoint).send(invalidPayload);

  expect(res.status).toBe(422);
  expect(res.body.message).toBe("Validation failed");
  expect(res.body.success).toBe(false);
  expect(res.body.errors.length).toBeGreaterThan(0);
});
```

#### 3. POST - Optional Fields Test
```typescript
it("should create todo with only Title (Description optional)", async () => {
  const endpoint = "/api/v1/todo";
  const userPayload = {
    Title: "Todo with only title",
  };

  const res = await request(App).post(endpoint).send(userPayload);

  expect(res.status).toBe(201);
  expect(res.body.message).toBe("Todo created successfully");
  expect(res.body.success).toBe(true);
  expect(res.body.data.Title).toBe(userPayload.Title);
  expect(res.body.data.Description).toBeUndefined();
  expect(res.body.data.IsCompleted).toBe(false);
});
```

#### 4. UPDATE - Successful Update Test
```typescript
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
  expect(res.body.data.Title).toBe(updatePayload.Title);
  expect(res.body.data.Description).toBe(updatePayload.Description);
  expect(res.body.data.IsCompleted).toBe(updatePayload.IsCompleted);
});
```

#### 5. UPDATE - Partial Update Test
```typescript
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
  expect(res.status).toBe(200);
  expect(res.body.message).toBe("Todo updated successfully");
  expect(res.body.success).toBe(true);
  expect(res.body.data.Title).toBe(updatePayload.Title);
  expect(res.body.data.Description).toBe("This todo will be updated"); // Original value
});
```

#### 6. UPDATE - Validation Error Test
```typescript
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
  expect(res.status).toBe(422);
  expect(res.body.message).toBe("Validation failed");
  expect(res.body.success).toBe(false);
  expect(res.body.errors).toBeDefined();
});
```

#### 7. DELETE - Successful Deletion Test
```typescript
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
```

#### 8. DELETE - Verification Test
```typescript
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
```

#### 9. DELETE - Error Handling Test
```typescript
it("should return 404 for non-existent todo", async () => {
  // arrange
  const nonExistentId = 99999;
  const endpoint = `/api/v1/todo/${nonExistentId}`;

  // act
  const res = await request(App).delete(endpoint);

  // assert
  expect(res.status).toBe(404);
  expect(res.body.message).toBe("Todo not found");
  expect(res.body.success).toBe(false);
});
```

### 🔧 Test Helper Functions

Our tests use helper functions to reduce code duplication and improve maintainability:

#### Creating Test Data
```typescript
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
```

#### Usage in Tests
```typescript
describe("Test the PUT Todos functionality", () => {
  let createdTodoId: number;

  it("should update a todo successfully", async () => {
    // arrange - use helper to create test data
    createdTodoId = await createTestTodo();
    const endpoint = `/api/v1/todo/${createdTodoId}`;
    
    // ... rest of test
  });
});
```

### 🧪 Test Coverage Summary

Our comprehensive test suite covers:

#### POST Todos (4 tests)
- ✅ Successful creation with all fields
- ✅ Successful creation with only required fields
- ✅ Validation error for missing Title
- ✅ Validation error for empty Title

#### UPDATE Todos (8 tests)
- ✅ Successful full update
- ✅ Partial updates (Title only, IsCompleted only)
- ✅ Empty payload handling
- ✅ Validation errors (empty Title, invalid types)
- ✅ Error handling (404 for non-existent, 422 for invalid ID)

#### DELETE Todos (8 tests)
- ✅ Successful deletion
- ✅ Verification of actual deletion
- ✅ Multiple deletion attempts
- ✅ Error handling (404 for non-existent, 422 for invalid ID)
- ✅ Edge cases (zero ID, negative ID, non-numeric ID)

**Total: 20 tests covering all CRUD operations**

---

Our API follows a consistent response structure:

#### Success Response
```json
{
  "statusCode": 201,
  "data": {
    "id": 1,
    "Title": "test for test",
    "Description": "test for description",
    "IsCompleted": false,
    "CreatedAt": "2024-01-01T00:00:00.000Z",
    "UpdatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Todo created successfully",
  "success": true
}
```

#### Error Response
```json
{
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [
    {
      "field": "Title",
      "message": "Title is required"
    }
  ],
  "success": false,
  "isOperational": true
}
```

### 🛡️ Validation Testing with Zod

We use **Zod** for request validation. Our tests verify that validation works correctly:

#### Schema Definition
```typescript
// src/schemas/todo.schema.ts
import { z } from "zod";

export const createTodoSchema = z.object({
  Title: z.string()
    .min(1, "Title is required")
    .max(255, "Title must be less than 255 characters"),
  Description: z.string().optional(),
});
```

#### Testing Validation
- ✅ **Required fields**: Title must be provided
- ✅ **Field types**: Title must be string
- ✅ **Field lengths**: Title max 255 characters
- ✅ **Optional fields**: Description can be omitted

---

## AAA Pattern in Testing (Arrange, Act, Assert)

```js
import { describe, it, expect } from 'vitest'

function add(a, b) {
  return a + b
}

describe('add function', () => {
  it('adds two numbers correctly', () => {
    // Arrange
    const a = 2
    const b = 3

    // Act
    const result = add(a, b)

    // Assert
    expect(result).toBe(5)
  })
})
```

### Explanation

The **AAA pattern** is a common way to structure tests so they are easy to read and understand. It consists of three steps:

#### Arrange
* Prepare everything needed for the test.
* This includes creating variables, objects, or setting up the environment.

Example:
```js
const endpoint = "/api/v1/todo";
const userPayload = {
  Title: "test for test",
  Description: "test for description",
};
```

#### Act
* Execute the code you want to test.

Example:
```js
const res = await request(App).post(endpoint).send(userPayload);
```

#### Assert
* Verify that the result matches what you expect.

Example:
```js
expect(res.status).toBe(201);
expect(res.body.message).toBe("Todo created successfully");
expect(res.body.success).toBe(true);
```

### Why use the AAA Pattern

* Makes tests **clear and readable**
* Separates setup, execution, and verification
* Helps maintain consistent test structure across a project
* Makes debugging easier when tests fail

### Summary

The **AAA pattern** organizes tests into three parts:

1. **Arrange** – set up test data and environment
2. **Act** – run the function or behavior being tested
3. **Assert** – check that the result is correct

---

## Testing Framework Setup

### Required Dependencies

```bash
# Testing framework
npm install vitest --save-dev

# HTTP testing
npm install supertest @types/supertest --save-dev

# Environment variables
npm install cross-env --save-dev

# Validation (already installed)
npm install zod
```

### Project Structure

```
project/
├── src/
│   ├── controllers/
│   │   └── todo.controller.ts
│   ├── models/
│   │   └── todo.model.ts
│   ├── schemas/
│   │   └── todo.schema.ts
│   └── config/
│       └── dbconn.ts
├── tests/
│   ├── setup.ts
│   ├── TESTREADME.md
│   └── post-todo/
│       └── post.test.ts
├── vitest.config.ts
└── package.json
```

### TypeScript Configuration

Update `tsconfig.json`:
```json
{
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

---

## Using Vitest Testing Framework

### Basic Imports

```js
import { it, describe, expect } from "vitest";
```

### Using `it` from Vitest

```js
import { it, expect } from 'vitest'

it('adds two numbers correctly', () => {
  expect(1 + 2).toBe(3)
})
```

#### Explanation

* `import { it, expect } from 'vitest'`
  * Imports testing utilities from the **Vitest** testing framework.
  * `it` is used to define a single test case.
  * `expect` is used to create assertions (checks that your code behaves correctly).

* `it('adds two numbers correctly', () => { ... })`
  * Defines a test case.
  * The string description explains what the test should do.
  * It reads like a sentence: **"It adds two numbers correctly."**

* `expect(1 + 2).toBe(3)`
  * This is an assertion.
  * It checks that `1 + 2` equals `3`.
  * If the condition is false, the test fails.

#### Summary

`it()` is used to define an individual test, and `expect()` verifies that the result of your code matches the expected outcome.

### Using `describe` from Vitest

```js
import { describe, it, expect } from 'vitest'

describe('math utilities', () => {
  it('adds two numbers correctly', () => {
    expect(1 + 2).toBe(3)
  })

  it('multiplies two numbers correctly', () => {
    expect(2 * 3).toBe(6)
  })
})
```

#### Explanation

* `import { describe, it, expect } from 'vitest'`
  * Imports testing helpers from the **Vitest** testing framework.
  * `describe` groups related tests together.
  * `it` defines an individual test.
  * `expect` is used for assertions.

* `describe('math utilities', () => { ... })`
  * Creates a **test suite** (a group of related tests).
  * The string describes what functionality is being tested.
  * All tests inside the block belong to this group.

* `it('adds two numbers correctly', () => { ... })`
  * Defines a single test case inside the test suite.

* `expect(1 + 2).toBe(3)`
  * Assertion that checks whether the result matches the expected value.

#### Why use `describe`

* Organizes tests into logical groups.
* Makes test output easier to read.
* Helps structure large test files.

#### Summary

`describe()` groups related tests into a test suite, while `it()` defines the individual test cases inside that group.

---

## Common Vitest Assertions

### Equality Assertions
```js
expect(value).toBe(expected)           // Strict equality (===)
expect(value).toEqual(expected)        // Deep equality
expect(value).not.toBe(expected)       // Not equal
```

### Truthiness
```js
expect(value).toBeTruthy()             // Truthy value
expect(value).toBeFalsy()              // Falsy value
expect(value).toBeDefined()            // Not undefined
expect(value).toBeUndefined()          // Is undefined
expect(value).toBeNull()               // Is null
```

### Numbers
```js
expect(value).toBeGreaterThan(3)       // > 3
expect(value).toBeGreaterThanOrEqual(3) // >= 3
expect(value).toBeLessThan(5)          // < 5
expect(value).toBeCloseTo(0.3)         // Floating point
```

### Strings
```js
expect('hello world').toMatch(/world/) // Regex match
expect('hello').toContain('ell')       // Contains substring
```

### Arrays
```js
expect(['a', 'b', 'c']).toContain('b') // Contains item
expect(array).toHaveLength(3)          // Array length
```

### Objects
```js
expect(obj).toHaveProperty('name')     // Has property
expect(obj).toMatchObject({id: 1})     // Partial match
```

---

## Best Practices

### 1. Test Organization
- Group related tests with `describe()`
- Use descriptive test names
- Follow the AAA pattern consistently

### 2. Database Testing
- Use separate test database
- Clean up data between tests if needed
- Test both success and error scenarios

### 3. API Testing
- Test all HTTP status codes
- Validate response structure
- Test edge cases and validation

### 4. Error Testing
- Test validation errors
- Test server errors
- Verify error message format

### 5. Async Testing
- Always use `async/await` for database operations
- Handle promises properly
- Test timeout scenarios

### 6. Environment Isolation
- Never test against production data
- Use environment variables for configuration
- Ensure tests can run independently

---

## Running Tests

### All Tests
```bash
npm test
```

### Specific Test Files
```bash
npm run test:post    # POST todo tests
npm run test:update  # UPDATE todo tests
npm run test:delete  # DELETE todo tests
```

### Watch Mode (Re-run on file changes)
```bash
npm run test:watch
```

### With Coverage
```bash
npx vitest --coverage
```

---

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Ensure test database exists
   - Check environment variables
   - Verify database credentials

2. **Environment Variable Issues**
   - Check `NODE_ENV` is set to 'test'
   - Verify `config.env` file exists
   - Ensure dotenv is loading correctly

3. **Import Errors**
   - Check file extensions (.js for imports)
   - Verify TypeScript compilation
   - Check module resolution

4. **Test Timeouts**
   - Increase timeout for database operations
   - Check for hanging connections
   - Ensure proper cleanup

### Debug Tips

1. **Add Console Logs**
   ```js
   console.log('Response:', res.body);
   ```

2. **Check Environment**
   ```js
   console.log('NODE_ENV:', process.env.NODE_ENV);
   ```

3. **Verify Database Connection**
   ```js
   console.log('Database:', config.database);
   ```

---

## Summary

This testing setup provides:

- ✅ **Isolated test environment** with separate database
- ✅ **Comprehensive API testing** with Supertest for all CRUD operations
- ✅ **Validation testing** with Zod schemas
- ✅ **Structured test organization** with AAA pattern
- ✅ **Multiple test scenarios** (success, validation, edge cases, error handling)
- ✅ **Easy test execution** with npm scripts for individual test suites
- ✅ **Environment configuration** for development and testing
- ✅ **Helper functions** for test data creation and code reuse

Your tests now validate the three key requirements across all operations:
1. **Status** - HTTP status codes (200, 201, 404, 422, etc.)
2. **Message** - Response messages ("Todo created successfully", "Validation failed", etc.)
3. **Success** - Boolean success indicators (true/false)

**Complete test coverage**: 20 tests across POST, UPDATE, and DELETE operations ensuring robust API functionality.
