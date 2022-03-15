import { resolve } from 'path';

export const jwtSecretPath = resolve(__dirname, '../secrets/jwt.key');
export const appSecretPath = resolve(__dirname, '../secrets/app.key');
