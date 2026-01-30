import { PrismaClient, Role, FabricType } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
    throw new Error('DATABASE_URL is not defined in environment variables')
}

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false,
    },
})
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
    console.log('Start seeding...')

    // Clean up existing data
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.product.deleteMany()
    await prisma.user.deleteMany()

    // Create an Admin User
    const hashedPassword = await bcrypt.hash('admin123', 10)
    const admin = await prisma.user.create({
        data: {
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: Role.ADMIN,
        },
    } as any)

    // Create some Products
    const products = [
        {
            name: 'Premium Muslin Saree',
            description: 'Handwoven 100 count muslin saree with intricate designs.',
            price: 15000.00,
            fabricType: FabricType.MUSLIN,
            fabricCount: 100,
            stock: 5,
            featured: true,
            images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
        },
        {
            name: 'Pure Silk Saree',
            description: 'Elegant pure silk saree for special occasions.',
            price: 8500.00,
            fabricType: FabricType.SILK_SAREE,
            stock: 10,
            featured: true,
            images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80'],
        },
        {
            name: 'Silk Than Material',
            description: 'High quality silk than material for custom tailoring.',
            price: 1200.00,
            fabricType: FabricType.SILK_THAN,
            stock: 50,
            images: ['https://images.unsplash.com/photo-1590674033314-14221da0c997?auto=format&fit=crop&w=800&q=80'],
        },
        {
            name: 'Regular Muslin Fabric',
            description: 'Breathable 80 count muslin fabric.',
            price: 2500.00,
            fabricType: FabricType.MUSLIN,
            fabricCount: 80,
            stock: 20,
            images: ['https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80'],
        },
    ]

    for (const product of products) {
        await prisma.product.create({
            data: product,
        })
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
