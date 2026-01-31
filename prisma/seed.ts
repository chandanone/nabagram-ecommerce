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
            id: '1',
            name: 'Premium Muslin Saree (100 Count)',
            description: 'Handwoven 100 count muslin saree with intricate designs.',
            price: 15000.00,
            fabricType: FabricType.MUSLIN,
            fabricCount: 100,
            stock: 5,
            featured: true,
            images: ['https://images.unsplash.com/photo-1558171813-4c088753af8f?auto=format&fit=crop&w=800&q=80'],
        },
        {
            id: '2',
            name: 'Pure Silk Saree - Paisley',
            description: 'Elegant pure silk saree for special occasions.',
            price: 18500.00,
            fabricType: FabricType.SILK_SAREE,
            stock: 10,
            featured: true,
            images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80'],
        },
        {
            id: '3',
            name: 'Heritage Muslin 80s',
            description: 'Traditional 80 count muslin fabric with natural texture.',
            price: 9500.00,
            fabricType: FabricType.MUSLIN,
            fabricCount: 80,
            stock: 20,
            featured: true,
            images: ['https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80'],
        },
        {
            id: '4',
            name: 'Artisan Silk Than',
            description: 'High quality silk than material for custom tailoring.',
            price: 22000.00,
            fabricType: FabricType.SILK_THAN,
            stock: 15,
            featured: true,
            images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80'],
        },
        {
            id: '5',
            name: 'Regular Muslin Fabric',
            description: 'Breathable 60 count muslin fabric.',
            price: 2500.00,
            fabricType: FabricType.MUSLIN,
            fabricCount: 60,
            stock: 50,
            featured: true,
            images: ['https://images.unsplash.com/photo-1594040226829-7f251ab46d80?auto=format&fit=crop&w=800&q=80'],
        },
        {
            id: '6',
            name: 'Artisan Silk Than - Gold',
            description: 'Premium gold silk material.',
            price: 24000.00,
            fabricType: FabricType.SILK_THAN,
            stock: 12,
            featured: true,
            images: ['https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=800&h=1000&fit=crop'],
        },
        {
            id: '7',
            name: 'Premium Muslin 60s',
            description: 'Quality 60 count muslin.',
            price: 6500.00,
            fabricType: FabricType.MUSLIN,
            fabricCount: 60,
            stock: 30,
            featured: true,
            images: ['https://images.unsplash.com/photo-1585128903994-9788298932a6?w=600&h=800&fit=crop'],
        },
        {
            id: '8',
            name: 'Bridal Silk Saree',
            description: 'Exquisite bridal collection.',
            price: 45000.00,
            fabricType: FabricType.SILK_SAREE,
            stock: 5,
            featured: true,
            images: ['https://images.unsplash.com/photo-1583391733975-9e4e8a4c0a28?w=600&h=800&fit=crop'],
        },
        {
            id: '9',
            name: 'Festive Collection',
            description: 'Natural dyed festive wear.',
            price: 15500.00,
            fabricType: FabricType.SILK_SAREE,
            stock: 15,
            featured: true,
            images: ['https://images.unsplash.com/photo-1617627143233-46df7b95c6ff?w=600&h=800&fit=crop'],
        },
        {
            id: '10',
            name: 'Daily Wear Muslin',
            description: 'Comfortable daily wear muslin.',
            price: 4500.00,
            fabricType: FabricType.MUSLIN,
            fabricCount: 40,
            stock: 100,
            featured: false,
            images: ['https://images.unsplash.com/photo-1558171813-4c088753af8f?w=600&h=800&fit=crop'],
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
