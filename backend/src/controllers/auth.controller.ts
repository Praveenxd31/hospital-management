import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/db'
import { jwtConfig } from '../config/jwt'
import { RegisterInput, LoginInput } from '../validators/auth.validator'

export const register = async (
    req: Request<{}, {}, RegisterInput>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email, password, role } = req.body

        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            res.status(409).json({ success: false, message: 'Email already registered' })
            return
        }

        const hashed = await bcrypt.hash(password, 12)
        const user = await prisma.user.create({
            data: { name, email, password: hashed, role: role ?? 'RECEPTIONIST' },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        })

        res.status(201).json({ success: true, message: 'User registered', data: user })
    } catch (error) {
        next(error)
    }
}

export const login = async (
    req: Request<{}, {}, LoginInput>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid credentials' })
            return
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid credentials' })
            return
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn } as jwt.SignOptions
        )

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                token,
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
            },
        })
    } catch (error) {
        next(error)
    }
}

export const getMe = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const userId = (req as any).user?.id
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, createdAt: true },
        })
        res.status(200).json({ success: true, message: 'User fetched', data: user })
    } catch (error) {
        next(error)
    }
}