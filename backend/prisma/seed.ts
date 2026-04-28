import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...')

    const hashedPassword = await bcrypt.hash('admin123', 12)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@gmail.com' },
        update: {},
        create: {
            name: 'Admin User',
            email: 'admin@gmail.com',
            password: hashedPassword,
            role: 'ADMIN',
        },
    })
    console.log('Admin created:', admin.email)

    const doctors = await Promise.all([
        prisma.doctor.upsert({
            where: { email: 'john@gmail.com' },
            update: {},
            create: {
                name: 'John Smith',
                specialty: 'Cardiology',
                phone: '9876543210',
                email: 'john@gmail.com',
            },
        }),
        prisma.doctor.upsert({
            where: { email: 'sara@gmail.com' },
            update: {},
            create: {
                name: 'Sara Lee',
                specialty: 'Neurology',
                phone: '9876543211',
                email: 'sara@gmail.com',
            },
        }),
        prisma.doctor.upsert({
            where: { email: 'raj@gmail.com' },
            update: {},
            create: {
                name: 'Raj Patel',
                specialty: 'Orthopedics',
                phone: '9876543212',
                email: 'raj@gmail.com',
            },
        }),
    ])
    console.log(`${doctors.length} doctors created`)

    const patients = await Promise.all([
        prisma.patient.upsert({
            where: { email: 'alice@example.com' },
            update: {},
            create: {
                name: 'Alice Johnson',
                age: 34,
                gender: 'FEMALE',
                phone: '9000000001',
                email: 'alice@example.com',
                address: '12 Oak Street, Chennai',
            },
        }),
        prisma.patient.upsert({
            where: { email: 'bob@example.com' },
            update: {},
            create: {
                name: 'Bob Williams',
                age: 52,
                gender: 'MALE',
                phone: '9000000002',
                email: 'bob@example.com',
                address: '45 Pine Avenue, Chennai',
            },
        }),
        prisma.patient.upsert({
            where: { email: 'carol@example.com' },
            update: {},
            create: {
                name: 'Carol Davis',
                age: 28,
                gender: 'FEMALE',
                phone: '9000000003',
                email: 'carol@example.com',
                address: '78 Elm Road, Chennai',
            },
        }),
    ])
    console.log(`${patients.length} patients created`)

    console.log('Seeding completed...')

}

main()
    .catch((e) => {
        console.error('Seed failed:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })