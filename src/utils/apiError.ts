import { httpStatusCodes } from "./httpCodes.js";

export class ApiError extends Error {
  statusCode: number;
  errors: any[];
  success: boolean;
  isOperational: boolean;

  constructor(
    statusCode: number = httpStatusCodes.INTERNAL_SERVER_ERROR,
    message: string = "Something went wrong",
    errors: any[] = [],
    isOperational: boolean = true,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }

  // Ensure message is included in JSON serialization
  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors,
      success: this.success,
      isOperational: this.isOperational,
    };
  }

  // Static factory methods for common errors
  static badRequest(
    message: string = "Bad request",
    errors: any[] = [],
  ): ApiError {
    return new ApiError(httpStatusCodes.BAD_REQUEST, message, errors);
  }

  static unauthorized(message: string = "Unauthorized access"): ApiError {
    return new ApiError(httpStatusCodes.UNAUTHORIZED, message);
  }

  static forbidden(message: string = "Access forbidden"): ApiError {
    return new ApiError(httpStatusCodes.FORBIDDEN, message);
  }

  static notFound(message: string = "Resource not found"): ApiError {
    return new ApiError(httpStatusCodes.NOT_FOUND, message);
  }

  static conflict(
    message: string = "Resource conflict",
    errors: any[] = [],
  ): ApiError {
    return new ApiError(httpStatusCodes.CONFLICT, message, errors);
  }

  static validationError(
    message: string = "Validation failed",
    errors: any[] = [],
  ): ApiError {
    return new ApiError(httpStatusCodes.UNPROCESSABLE_ENTITY, message, errors);
  }

  static tooManyRequests(message: string = "Too many requests"): ApiError {
    return new ApiError(httpStatusCodes.TOO_MANY_REQUESTS, message);
  }

  static serverError(message: string = "Internal server error"): ApiError {
    return new ApiError(
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      message,
      [],
      false,
    );
  }

  static serviceUnavailable(
    message: string = "Service temporarily unavailable",
  ): ApiError {
    return new ApiError(
      httpStatusCodes.SERVICE_UNAVAILABLE,
      message,
      [],
      false,
    );
  }

  static payloadTooLarge(message: string = "File too large"): ApiError {
    return new ApiError(httpStatusCodes.PAYLOAD_TOO_LARGE, message);
  }

  static insufficientStorage(
    message: string = "Insufficient storage space",
  ): ApiError {
    return new ApiError(httpStatusCodes.INSUFFICIENT_STORAGE, message);
  }
}
