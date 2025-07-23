// prisma/seed.ts
import { prisma } from "../src/lib/prisma";
import { faker } from "@faker-js/faker";

async function main() {
  // 1️⃣ Create Games + Services + Subpackages
  const gamesData = [
    { name: "Valorant", icon: "🎯" },
    { name: "Fortnite", icon: "🏆" },
    { name: "Gamer Girl", icon: "👾" },
    { name: "Marvel Rivals", icon: "🦸" },
    { name: "CS2", icon: "🔫" },
    { name: "League of Legends", icon: "🧙‍♂️" },
  ];

  for (const g of gamesData) {
    const game = await prisma.game.create({
      data: {
        name: g.name,
        image: `/images/${g.name.toLowerCase()}.png`,
        isEloBased: false,
      },
    });

    // 2–3 Services per game
    for (let i = 1; i <= 2; i++) {
      const service = await prisma.service.create({
        data: {
          name: `${g.name} Service ${i}`,
          description: `Top-tier ${g.name} service #${i}`,
          gameId: game.id,
        },
      });

      // 3 Subpackages per service
      for (let h = 1; h <= 3; h++) {
        await prisma.subpackage.create({
          data: {
            name: `Package ${h}`,
            description: `${h * 3}h session for ${g.name}`,
            price: 10 * h,
            duration: `${3 * h}h`,
            serviceId: service.id,
          },
        });
      }
    }
  }

  // 2️⃣ Create Users & Wallets
  const users = [];
  for (let i = 1; i <= 3; i++) {
    // Customers
    const cust = await prisma.user.create({
      data: {
        username: `cust${i}`,
        email: `cust${i}@example.com`,
        password: "password",
        role: "customer",
        status: "active",
        wallet: {
          create: { balance: faker.number.int({ min: 20, max: 200 }) },
        },
      },
      include: { wallet: true },
    });
    users.push(cust);

    // Providers
    const prov = await prisma.user.create({
      data: {
        username: `prov${i}`,
        email: `prov${i}@example.com`,
        password: "password",
        role: "provider",
        status: "active",
        wallet: {
          create: { balance: faker.number.int({ min: 0, max: 50 }) },
        },
      },
      include: {
        wallet: true,
      },
    });
    users.push(prov);
  }

  // 3️⃣ Create Transactions for each wallet
  for (const u of users) {
    // top-up of $50
    await prisma.transaction.create({
      data: {
        walletId: u.wallet!.id,
        type: "deposit",
        amount: 50,
        status: "completed",
      },
    });
  }

  // 4️⃣ Example Orders
  const allSubpkgs = await prisma.subpackage.findMany({ take: 2 });
  for (let idx = 0; idx < 2; idx++) {
    const customer = users[idx * 2]; // cust1, cust2
    const subpkg = allSubpkgs[idx];

    const order = await prisma.order.create({
      data: {
        customerId: customer.id,
        subpackageId: subpkg.id,
        price: subpkg.price,
        requiredCount: 1,
        notes: `Please handle my ${subpkg.name}`,
      },
    });

    // Assign first provider
    const provider = users[idx * 2 + 1]; // prov1, prov2
    const assign = await prisma.orderAssignment.create({
      data: {
        orderId: order.id,
        providerId: provider.id,
        approved: true,
        completed: true,
        progress: 100,
        proofUrl: `/proofs/${idx}.png`,
        reviewRating: 5,
        reviewText: "Excellent service!",
      },
    });

    // Chat example
    await prisma.chat.createMany({
      data: [
        { orderId: order.id, senderId: customer.id, message: "Hi there!" },
        { orderId: order.id, senderId: provider.id, message: "On it!" },
        { orderId: order.id, senderId: customer.id, message: "how's going!" },
        { orderId: order.id, senderId: provider.id, message: "good" },
        { orderId: order.id, senderId: customer.id, message: "let's go!" },
        { orderId: order.id, senderId: provider.id, message: "awright" },
        {
          orderId: order.id,
          senderId: customer.id,
          message: "what are you into",
        },
        {
          orderId: order.id,
          senderId: provider.id,
          message: "improving aiming",
        },
      ],
    });
  }

  console.log("✅ Seeding complete");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
