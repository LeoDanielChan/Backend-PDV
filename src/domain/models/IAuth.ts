import * as z from 'zod';
import { UserLoginValidator, UserRegisterValidator } from '@/interfaces/validators/auth.validator';

export type ILoginRequest = z.infer<typeof UserLoginValidator>;

export type IRegisterRequest = z.infer<typeof UserRegisterValidator>;

export interface IAuthUser {
  userId: number;
  correo: string;
  tipo_usuario: number;
}

export interface IAuthResponse {
  token: string;
  user: IAuthUser;
}

export interface IHttpError extends Error {
  status: number;
  message: string;
  name: string;
}