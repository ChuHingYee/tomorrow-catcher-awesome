// src/error/custom.error.ts
import { HttpStatus, MidwayHttpError } from '@midwayjs/core';

export class CustomHttpError extends MidwayHttpError {
  constructor(messate: string, status = HttpStatus.BAD_REQUEST) {
    super(messate, status);
  }
}
