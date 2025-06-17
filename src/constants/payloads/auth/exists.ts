export type PostRequestPayload = {
  email: string;
};

export type PostResponsePayload = {
  doesExist: boolean;
};

export const API_PATH = '/v1/auth/exists';
