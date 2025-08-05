// prisma/seed.ts
import { faker } from "@faker-js/faker";
import { prisma } from "../src/lib/prisma";

async function main() {
  const mainCustomerId = "cmdy8qyhw0009v088p0say9hl";
  const mainCustomerWalletId = "cmdy8qyyx000bv088z703tl61";

  // Create games with services and subpackages
  const games = await Promise.all(
    [
      `Valorant  ${Math.random()}`,
      `CS2  ${Math.random()}`,
      `LOL  ${Math.random()}`,
      `Apex Legends ${Math.random()}`,
    ].map(async (name) => {
      const game = await prisma.game.create({
        data: {
          name,
          image: `/images/${name.toLowerCase().replace(/\s/g, "-")}.png`,
          isEloBased: Math.random() > 0.5,
        },
      });

      for (let i = 0; i < 2; i++) {
        const service = await prisma.service.create({
          data: {
            name: `${name} Service ${i + 1}`,
            description: `Service for ${name} tier ${i + 1}`,
            gameId: game.id,
          },
        });

        for (let j = 0; j < 2; j++) {
          await prisma.subpackage.create({
            data: {
              name: `SubPkg ${j + 1}`,
              description: `Boost level ${j + 1} in ${name}`,
              price: (j + 1) * 15,
              duration: `${2 + j}h`,
              serviceId: service.id,
              requiredProviders: j + 1,
            },
          });
        }
      }

      return game;
    })
  );

  const allSubpackages = await prisma.subpackage.findMany();
  const allProviders = [];

  // Create multiple providers
  for (let i = 0; i < 7; i++) {
    const provider = await prisma.user.create({
      data: {
        username: `prov${Math.random()}`,
        email: `prov${Math.random()}@example.com`,
        password: "password",
        role: "provider",
        status: i % 2 === 0 ? "active" : "inactive",
        wallet: {
          create: {
            balance: faker.number.int({ min: 0, max: 100 }),
          },
        },
      },
      include: { wallet: true },
    });

    allProviders.push(provider);
  }

  // Generate multiple orders for main customer
  for (let i = 0; i < 5; i++) {
    const subpackage = allSubpackages[i % allSubpackages.length];

    const order = await prisma.order.create({
      data: {
        customerId: mainCustomerId,
        subpackageId: subpackage.id,
        price: subpackage.price,
        requiredCount: subpackage.requiredProviders,
        discordTag: `#12314${i}`,
        discordUsername: `uzairkhan${i}`,
        notes: Math.random() > 0.5 ? faker.lorem.sentence() : null,
      },
    });

    // Assign 1–2 providers randomly
    const assignedProviders = faker.helpers.arrayElements(
      allProviders,
      faker.number.int({ min: 1, max: 2 })
    );

    for (const provider of assignedProviders) {
      await prisma.orderAssignment.create({
        data: {
          orderId: order.id,
          providerId: provider.id,
          approved: Math.random() > 0.3,
          completed: Math.random() > 0.5,
          progress: faker.number.int({ min: 0, max: 100 }),
          proofUrl:
            Math.random() > 0.5 ? `/proofs/${faker.string.uuid()}.png` : null,
          reviewRating:
            Math.random() > 0.6 ? faker.number.int({ min: 3, max: 5 }) : null,
          reviewText: Math.random() > 0.6 ? faker.lorem.sentence() : null,
        },
      });
    }

    // Chat examples
    await prisma.chat.createMany({
      data: [
        {
          orderId: order.id,
          senderId: mainCustomerId,
          message: faker.lorem.words({ min: 2, max: 6 }),
        },
        {
          orderId: order.id,
          senderId: assignedProviders[0].id,
          message: faker.lorem.words({ min: 2, max: 6 }),
        },

        {
          orderId: order.id,
          senderId: mainCustomerId,
          message: faker.lorem.words({ min: 2, max: 6 }),
        },
        {
          orderId: order.id,
          senderId: assignedProviders[0].id,
          message: faker.lorem.words({ min: 2, max: 6 }),
        },
        {
          orderId: order.id,
          senderId: mainCustomerId,
          message: faker.lorem.words({ min: 2, max: 6 }),
        },
        {
          orderId: order.id,
          senderId: assignedProviders[0].id,
          message: faker.lorem.words({ min: 2, max: 6 }),
        },
        {
          orderId: order.id,
          senderId: mainCustomerId,
          message: faker.lorem.words({ min: 2, max: 6 }),
        },
        {
          orderId: order.id,
          senderId: assignedProviders[0].id,
          message: faker.lorem.words({ min: 2, max: 6 }),
        },
      ],
    });

    // Transactions for main user
    await prisma.transaction.create({
      data: {
        walletId: mainCustomerWalletId,
        type: Math.random() > 0.5 ? "deposit" : "withdrawal",
        amount: faker.number.int({ min: 10, max: 100 }),
        status: "completed",
      },
    });
  }

  console.log("✅ Rich data seeding complete for main customer.");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
