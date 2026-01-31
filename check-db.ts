import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const count = await prisma.product.count()
    console.log('Total products:', count)
    if (count > 0) {
        const products = await prisma.product.findMany({ take: 5 })
        console.log('Sample IDs:', products.map(p => p.id))
    }
}

main().finally(() => prisma.$disconnect())
