import { Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { jwtConfig } from '../config/jwt'
import { AuthRequest } from '../types'

export const protect = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'No token provided' })
        return
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, jwtConfig.secret) as {
            id: string
            email: string
            role: "ADMIN" | "DOCTOR" | "NURSE" | "RECEPTIONIST" | "PATIENT"
        }
        req.user = decoded
        next()
    } catch {
        res.status(401).json({ success: false, message: 'Invalid or expired token' })
    }
}

export const authorize = (...roles: Array<'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'PATIENT'>) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' })
            return
        }
        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: `Access denied. Required roles: ${roles.join(', ')}`,
            })
            return
        }
        next()
    }
}