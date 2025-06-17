interface ErrorObject {
  statusCode?: number;
  message?: string;
}

// Helper function to add CORS headers
const addCorsHeaders = (headers: Headers) => {
  headers.set('Access-Control-Allow-Origin', '*'); // Or your specific origins
  headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return headers;
};

export const createErrorObject = (errorObject: ErrorObject) => errorObject;

export const response400BadRequestError = (message: string) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  addCorsHeaders(headers);

  return new Response(JSON.stringify({ message }), {
    status: 400,
    headers,
  });
};

export const response401UnauthorizedError = (message: string) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  addCorsHeaders(headers);

  return new Response(JSON.stringify({ message }), {
    status: 401,
    headers,
  });
};

export const response403ForbiddenError = (message: string) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  addCorsHeaders(headers);

  return new Response(JSON.stringify({ message }), {
    status: 403,
    headers,
  });
};

export const response405InvalidMethodError = (message: string) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  addCorsHeaders(headers);

  return new Response(JSON.stringify({ message }), {
    status: 405,
    headers,
  });
};

export const response500ServerError = (message: string) => {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  addCorsHeaders(headers);

  return new Response(JSON.stringify({ message }), {
    status: 500,
    headers,
  });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function responseJson200Success<T = any>(data: T) {
  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  addCorsHeaders(headers);

  return new Response(JSON.stringify(data), {
    status: 200,
    headers,
  });
}
