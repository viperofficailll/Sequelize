import { httpStatusCodes } from "./httpCodes.js";

export class ApiResponse<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;

  constructor(statusCode: number, data: T, message: string = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < httpStatusCodes.BAD_REQUEST;
  }

  // Static factory methods for common responses
  static ok<T>(data: T, message: string = "Success"): ApiResponse<T> {
    return new ApiResponse(httpStatusCodes.OK, data, message);
  }

  static created<T>(
    data: T,
    message: string = "Created successfully",
  ): ApiResponse<T> {
    return new ApiResponse(httpStatusCodes.CREATED, data, message);
  }

  static badRequest<T>(
    data: T,
    message: string = "Bad request",
  ): ApiResponse<T> {
    return new ApiResponse(httpStatusCodes.BAD_REQUEST, data, message);
  }

  static unauthorized<T>(
    data: T,
    message: string = "Unauthorized",
  ): ApiResponse<T> {
    return new ApiResponse(httpStatusCodes.UNAUTHORIZED, data, message);
  }

  static notFound<T>(data: T, message: string = "Not found"): ApiResponse<T> {
    return new ApiResponse(httpStatusCodes.NOT_FOUND, data, message);
  }

  static conflict<T>(data: T, message: string = "Conflict"): ApiResponse<T> {
    return new ApiResponse(httpStatusCodes.CONFLICT, data, message);
  }

  static serverError<T>(
    data: T,
    message: string = "Internal server error",
  ): ApiResponse<T> {
    return new ApiResponse(
      httpStatusCodes.INTERNAL_SERVER_ERROR,
      data,
      message,
    );
  }

  // Method to send response
  send(res: any): void {
    res.status(this.statusCode).json(this);
  }
}
