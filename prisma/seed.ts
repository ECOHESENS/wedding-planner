import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create a wedding planner user
  const hashedPassword = await bcrypt.hash('planner123', 10)
  
  const planner = await prisma.user.upsert({
    where: { email: 'planner@wedding.com' },
    update: {},
    create: {
      email: 'planner@wedding.com',
      password: hashedPassword,
      name: 'Wedding Planner Pro',
      role: 'PLANNER'
    }
  })

  // Create a couple user
  const couplePassword = await bcrypt.hash('couple123', 10)
  
  const bride = await prisma.user.upsert({
    where: { email: 'bride@example.com' },
    update: {},
    create: {
      email: 'bride@example.com',
      password: couplePassword,
      name: 'Fatima Benali',
      role: 'CLIENT'
    }
  })

  const groom = await prisma.user.upsert({
    where: { email: 'groom@example.com' },
    update: {},
    create: {
      email: 'groom@example.com',
      password: couplePassword,
      name: 'Omar Alami',
      role: 'CLIENT'
    }
  })

  // Create a couple profile
  const couple = await prisma.couple.upsert({
    where: { id: 'sample-couple-id' },
    update: {},
    create: {
      id: 'sample-couple-id',
      brideName: 'Fatima Benali',
      groomName: 'Omar Alami',
      brideId: bride.id,
      groomId: groom.id,
      plannerId: planner.id,
      culture: 'MOROCCAN',
      secondaryCulture: 'TUNISIAN',
      weddingDate: new Date('2024-09-15'),
      estimatedGuests: 200,
      totalBudget: 25000,
      phone: '+33 6 12 34 56 78',
      address: 'Paris, France',
      notes: 'Mariage traditionnel marocain avec touches tunisiennes'
    }
  })

  // Create some events
  await prisma.event.createMany({
    data: [
      {
        title: 'Khotba - Demande officielle',
        type: 'KHOTBA',
        date: new Date('2024-07-15'),
        location: 'Maison familiale',
        coupleId: couple.id,
        description: 'Rencontre des deux familles pour la demande officielle'
      },
      {
        title: 'Soirée Henné',
        type: 'HENNA',
        date: new Date('2024-09-13'),
        location: 'Salle des fêtes',
        coupleId: couple.id,
        description: 'Soirée traditionnelle avec henné et tenues marocaines'
      },
      {
        title: 'Cérémonie religieuse',
        type: 'RELIGIOUS_CEREMONY',
        date: new Date('2024-09-14'),
        location: 'Mosquée de Paris',
        coupleId: couple.id,
        description: 'Nikah selon les traditions islamiques'
      },
      {
        title: 'Réception',
        type: 'RECEPTION',
        date: new Date('2024-09-15'),
        location: 'Château de Versailles',
        coupleId: couple.id,
        description: 'Grande réception avec 200 invités'
      }
    ]
  })

  // Create budget items
  await prisma.budgetItem.createMany({
    data: [
      {
        category: 'VENUE',
        title: 'Location salle de réception',
        estimatedCost: 8000,
        actualCost: 7500,
        paidAmount: 3750,
        vendor: 'Château de Versailles Events',
        coupleId: couple.id
      },
      {
        category: 'CATERING',
        title: 'Traiteur - Menu traditionnel',
        estimatedCost: 6000,
        actualCost: 5800,
        paidAmount: 2900,
        vendor: 'Saveurs du Maghreb',
        coupleId: couple.id
      },
      {
        category: 'BRIDE_ATTIRE',
        title: 'Tenues mariée (Takchita + Robe)',
        estimatedCost: 3000,
        actualCost: 2800,
        paidAmount: 2800,
        vendor: 'Negafa Royale',
        coupleId: couple.id,
        isPaid: true
      },
      {
        category: 'PHOTOGRAPHY',
        title: 'Photographe professionnel',
        estimatedCost: 2500,
        vendor: 'Studio Lumière',
        coupleId: couple.id
      },
      {
        category: 'HENNA_SUPPLIES',
        title: 'Henné et accessoires',
        estimatedCost: 500,
        actualCost: 450,
        paidAmount: 450,
        vendor: 'Henné Tradition',
        coupleId: couple.id,
        isPaid: true
      }
    ]
  })

  console.log('Database seeded successfully!')
  console.log('Wedding Planner login: planner@wedding.com / planner123')
  console.log('Bride login: bride@example.com / couple123')
  console.log('Groom login: groom@example.com / couple123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })