export const httpStatusCodes = {
  //success codes
  OK: 200,
  CREATED: 201,
  DELETED: 204,

  //client errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  PAYLOAD_TOO_LARGE: 413,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  //server errors
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  INSUFFICIENT_STORAGE: 507,
} as const;

export type HttpStatusCodes =
  (typeof httpStatusCodes)[keyof typeof httpStatusCodes];
