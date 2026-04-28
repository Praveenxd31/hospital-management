import { Request, Response, NextFunction } from 'express'
import prisma from '../config/db'
import { CreateDoctorInput, UpdateDoctorInput } from '../validators/doctor.validator'


export const createDoctor = async (
  req: Request<{}, {}, CreateDoctorInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, specialization, phone, email, available } = req.body

    const doctor = await prisma.doctor.create({
      data: {
        name,
        specialty: specialization,
        phone,
        email,
        available,
      },
    })

    res.status(201).json({
      success: true,
      message: 'Doctor created successfully',
      data: doctor,
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({
        success: false,
        message: 'Phone or email already exists',
      })
      return
    }

    next(error)
  }
}

export const getAllDoctors = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { available, search } = req.query

        const where: any = {}
        if (available !== undefined) where.available = available === 'true'

        if (search) {
            where.OR = [
                { name: { contains: String(search), mode: 'insensitive' } },
                { specialty: { contains: String(search), mode: 'insensitive' } },
                { phone: { contains: String(search) } },
                { email: { contains: String(search), mode: 'insensitive' } },
            ]
        }

        const doctors = await prisma.doctor.findMany({
            where,
            orderBy: { name: 'asc' },
        })

        res.status(200).json({ success: true, message: 'Doctors fetched', data: doctors })
    } catch (error) {
        next(error)
    }
}


export const getDoctorById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const doctor = await prisma.doctor.findUnique({
            where: { id: req.params.id },
            include: {
                appointments: {
                    include: { patient: true },
                    orderBy: { date: 'desc' },
                    take: 10,
                },
            },
        })

        if (!doctor) {
            res.status(404).json({ success: false, message: 'Doctor not found' })
            return
        }

        res.status(200).json({ success: true, message: 'Doctor fetched', data: doctor })
    } catch (error) {
        next(error)
    }
}

export const updateDoctor = async (
    req: Request<{ id: string }, {}, UpdateDoctorInput>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { specialization, ...rest } = req.body
        const doctor = await prisma.doctor.update({
            where: { id: req.params.id },
            data: {
                ...rest,
                ...(specialization && { specialty: specialization }),
            },
        })
        res.status(200).json({ success: true, message: 'Doctor updated', data: doctor })
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ success: false, message: 'Doctor not found' })
            return
        }
        next(error)
    }
}

export const deleteDoctor = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        await prisma.doctor.delete({ where: { id: req.params.id } })
        res.status(200).json({ success: true, message: 'Doctor deleted' })
    } catch (error: any) {
        if (error.code === 'P2025') {
            res.status(404).json({ success: false, message: 'Doctor not found' })
            return
        }
        next(error)
    }
}