export interface LoginParams {
  account: string;
  password: string;
}

export interface GetUserParams {
  _id: string;
}

export interface AddUserParams {
  name: string;
  account: string;
  type: (0 | 1)[];
}

export interface UpdateInfoParams {
  _id: string;
  name: string;
}

export interface UpdatePasswordParams {
  oldPassword: string;
  newPassword: string;
  _id: string;
}

export interface UpdatePasswordByAdminParams {
  _id: string;
}

export interface UpdateStatusParams {
  status: 0 | 1;
  ids: string[];
}

export interface PageParams {
  page: number;
  size: number;
  name?: string;
}

export interface RefreshTokenParams {
  _id: string;
  token: string;
}
