import { Response, NextFunction } from 'express'
import prisma from '../config/db'
import { AuthRequest } from '../types'

export const getDashboardStats = async (
    req: AuthRequest,    
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)

        const [
            totalPatients,
            totalDoctors,
            totalAppointments,
            todayAppointments,
            scheduledAppointments,
            completedAppointments,
            cancelledAppointments,
            recentAppointments,
        ] = await Promise.all([
            prisma.patient.count(),
            prisma.doctor.count(),
            prisma.appointment.count(),
            prisma.appointment.count({
                where: { date: { gte: today, lt: tomorrow } },
            }),
            prisma.appointment.count({ where: { status: 'SCHEDULED' } }),
            prisma.appointment.count({ where: { status: 'COMPLETED' } }),
            prisma.appointment.count({ where: { status: 'CANCELLED' } }),
            prisma.appointment.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { patient: true, doctor: true },
            }),
        ])

        res.status(200).json({
            success: true,
            message: 'Dashboard stats fetched',
            data: {
                totalPatients,
                totalDoctors,
                totalAppointments,
                todayAppointments,
                appointmentsByStatus: {
                    scheduled: scheduledAppointments,
                    completed: completedAppointments,
                    cancelled: cancelledAppointments,
                },
                recentAppointments,
            },
        })
    } catch (error) {
        next(error)
    }
}