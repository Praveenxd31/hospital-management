import { Request } from 'express';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        role: "ADMIN" | "DOCTOR" | "NURSE" | "RECEPTIONIST" | "PATIENT";
        email: string;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message: string;
    error?: string;
}