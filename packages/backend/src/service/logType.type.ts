import { FileInfo } from './files.type';
export interface PageParams {
  page: number;
  size: number;
  id?: string;
  name?: string;
}

export type TypeStatus = 0 | 1;

export interface TypeParams {
  name: string;
  status: TypeStatus;
}

export interface UpdateParams {
  _id: string;
  status?: TypeStatus;
  name?: string;
  files: FileInfo[];
}

export interface DetailParams {
  _id: string;
}

export interface DetailResponse {
  _id: string;
  name: string;
  status: TypeStatus;
  createdAt: number;
  updatedAt: number;
}
