import { Request, Response, NextFunction } from 'express'
import prisma from '../config/db'
import {
    CreateAppointmentInput,
    UpdateAppointmentInput,
} from '../validators/appointment.validator'

export const createAppointment = async (
    req: Request<{}, {}, CreateAppointmentInput>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { patientId, doctorId, date, timeSlot, notes } = req.body

        const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } })
        if (!doctor) {
            res.status(404).json({ success: false, message: 'Doctor not found' })
            return
        }

        const patient = await prisma.patient.findUnique({ where: { id: patientId } })
        if (!patient) {
            res.status(404).json({ success: false, message: 'Patient not found' })
            return
        }

        const appointmentDate = new Date(date)

        const conflict = await prisma.appointment.findFirst({
            where: { doctorId, date: appointmentDate, timeSlot },
        })
        if (conflict) {
            res.status(409).json({
                success: false,
                message: 'Doctor already has an appointment at this time slot',
            })
            return
        }

        const appointment = await prisma.appointment.create({
            data: { patientId, doctorId, date: appointmentDate, timeSlot, notes },
            include: { patient: true, doctor: true },
        })

        res.status(201).json({
            success: true,
            message: 'Appointment created successfully',
            data: appointment,
        })
    } catch (error: any) {
        if (error.code === 'P2002') {
            res.status(409).json({
                success: false,
                message: 'Doctor already has an appointment at this time slot',
            })
            return
        }
        next(error)
    }
}

export const getAllAppointments = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { date, doctorId, patientId, status, search, page = '1', limit = '10' } = req.query

        const where: any = {}
        if (doctorId) where.doctorId = String(doctorId)
        if (patientId) where.patientId = String(patientId)
        if (status) where.status = String(status)
        if (date) {
            const start = new Date(String(date))
            const end = new Date(start)
            end.setDate(end.getDate() + 1)
            where.date = { gte: start, lt: end }
        }

        if (search) {
            where.OR = [
                { patient: { name: { contains: String(search), mode: 'insensitive' } } },
                { patient: { phone: { contains: String(search) } } },
                { doctor: { name: { contains: String(search), mode: 'insensitive' } } },
                { doctor: { specialty: { contains: String(search), mode: 'insensitive' } } },
                { notes: { contains: String(search), mode: 'insensitive' } },
                { timeSlot: { contains: String(search) } },
            ]
        }

        const skip = (Number(page) - 1) * Number(limit)

        const [appointments, total] = await Promise.all([
            prisma.appointment.findMany({
                where,
                skip,
                take: Number(limit),
                include: { patient: true, doctor: true },
                orderBy: { date: 'desc' },
            }),
            prisma.appointment.count({ where }),
        ])

        res.status(200).json({
            success: true,
            message: 'Appointments fetched',
            data: { appointments, total, page: Number(page), limit: Number(limit) },
        })
    } catch (error) {
        next(error)
    }
}

export const getAppointmentById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const appointment = await prisma.appointment.findUnique({
            where: { id: req.params.id },
            include: { patient: true, doctor: true },
        })

        if (!appointment) {
            res.status(404).json({ success: false, message: 'Appointment not found' })
            return
        }

        res.status(200).json({ success: true, message: 'Appointment fetched', data: appointment })
    } catch (error) {
        next(error)
    }
}

export const updateAppointment = async (
    req: Request<{ id: string }, {}, UpdateAppointmentInput>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const data: any = { ...req.body }
        if (data.date) data.date = new Date(data.date)

        const appointment = await prisma.appointment.update({
            where: { id: req.params.id },
            data,
            include: { patient: true, doctor: true },
        })

        res.status(200).json({ success: true, message: 'Appointment updated', data: appointment })
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ success: false, message: 'Appointment not found' })
            return
        }
        next(error)
    }
}

export const deleteAppointment = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await prisma.appointment.delete({ where: { id: req.params.id } })
        res.status(200).json({ success: true, message: 'Appointment deleted' })
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ success: false, message: 'Appointment not found' })
            return
        }
        next(error)
    }
}