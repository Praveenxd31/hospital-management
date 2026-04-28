import { Request, Response, NextFunction } from 'express'
import prisma from '../config/db'
import { CreatePatientInput, UpdatePatientInput } from '../validators/patient.validator'

export const createPatient = async (
    req: Request<{}, {}, CreatePatientInput>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const patient = await prisma.patient.create({ data: req.body })
        res.status(201).json({ success: true, message: 'Patient created', data: patient })
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(409).json({ success: false, message: 'Phone or email already exists' })
            return
        }
        next(error)
    }
}

export const getAllPatients = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { search, page = '1', limit = '10' } = req.query

        const skip = (Number(page) - 1) * Number(limit)

        const validGenders = ['MALE', 'FEMALE', 'OTHER']
        const searchStr = String(search || '')
        const upperSearch = searchStr.toUpperCase()
        const isValidGender = validGenders.includes(upperSearch)
        const isNumeric = !isNaN(Number(searchStr)) && searchStr.trim() !== ''

        const where = searchStr
            ? {
                OR: [
                    { name: { contains: searchStr, mode: 'insensitive' as const } },
                    { phone: { contains: searchStr } },
                    { email: { contains: searchStr, mode: 'insensitive' as const } },
                    { address: { contains: searchStr, mode: 'insensitive' as const } },
                    ...(isValidGender ? [{ gender: { equals: upperSearch as 'MALE' | 'FEMALE' | 'OTHER' } }] : []),
                    ...(isNumeric ? [{ age: { equals: Number(searchStr) } }] : []),
                ],
            }
            : {}

        const [patients, total] = await Promise.all([
            prisma.patient.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
            }),
            prisma.patient.count({ where }),
        ])

        res.status(200).json({
            success: true,
            message: 'Patients fetched',
            data: { patients, total, page: Number(page), limit: Number(limit) },
        })
    } catch (error) {
        next(error)
    }
}

export const getPatientById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const patient = await prisma.patient.findUnique({
            where: { id: req.params.id },
            include: {
                appointments: {
                    include: { doctor: true },
                    orderBy: { date: 'desc' },
                },
            },
        })

        if (!patient) {
            res.status(404).json({ success: false, message: 'Patient not found' })
            return
        }

        res.status(200).json({ success: true, message: 'Patient fetched', data: patient })
    } catch (error) {
        next(error)
    }
}

export const updatePatient = async (
    req: Request<{ id: string }, {}, UpdatePatientInput>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const patient = await prisma.patient.update({
            where: { id: req.params.id },
            data: req.body,
        })
        res.status(200).json({ success: true, message: 'Patient updated', data: patient })
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ success: false, message: 'Patient not found' })
            return
        }
        next(error)
    }
}

export const deletePatient1 = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await prisma.patient.delete({ where: { id: req.params.id } })
        res.status(200).json({ success: true, message: 'Patient deleted' })
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ success: false, message: 'Patient not found' })
            return
        }
        next(error)
    }
}

export const deletePatient = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { id } = req.params

        const patient = await prisma.patient.findUnique({ where: { id } })
        if (!patient) {
            res.status(404).json({ success: false, message: 'Patient not found' })
            return
        }

        await prisma.$transaction([
            prisma.appointment.deleteMany({ where: { patientId: id } }),
            prisma.patient.delete({ where: { id } }),
        ])

        res.status(200).json({ success: true, message: 'Patient deleted' })
    } catch (error: any) {
        next(error)
    }
}