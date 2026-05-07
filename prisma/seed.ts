import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  const category = await prisma.category.create({
    data: { name: "Delivery Bags" },
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Standard Bag S",
        sku: "BAG-STD-S",
        description: "Small standard delivery bag (20×15×10 cm)",
        price: 50,
        stock: 100,
        isActive: true,
        categoryId: category.id,
      },
      {
        name: "Standard Bag M",
        sku: "BAG-STD-M",
        description: "Medium standard delivery bag (30×25×15 cm)",
        price: 80,
        stock: 100,
        isActive: true,
        categoryId: category.id,
      },
      {
        name: "Standard Bag L",
        sku: "BAG-STD-L",
        description: "Large standard delivery bag (40×35×20 cm)",
        price: 120,
        stock: 100,
        isActive: true,
        categoryId: category.id,
      },
      {
        name: "Standard Bag XL",
        sku: "BAG-STD-XL",
        description: "Extra-large standard delivery bag (55×45×30 cm)",
        price: 180,
        stock: 100,
        isActive: true,
        categoryId: category.id,
      },
      {
        name: "Insulated Bag S",
        sku: "BAG-INS-S",
        description: "Small insulated bag — keeps food hot/cold up to 4 hours (20×15×10 cm)",
        price: 150,
        stock: 60,
        isActive: true,
        categoryId: category.id,
      },
      {
        name: "Insulated Bag M",
        sku: "BAG-INS-M",
        description: "Medium insulated bag — keeps food hot/cold up to 4 hours (30×25×15 cm)",
        price: 220,
        stock: 60,
        isActive: true,
        categoryId: category.id,
      },
      {
        name: "Insulated Bag L",
        sku: "BAG-INS-L",
        description: "Large insulated bag — keeps food hot/cold up to 6 hours (40×35×20 cm)",
        price: 350,
        stock: 60,
        isActive: true,
        categoryId: category.id,
      },
      {
        name: "Insulated Bag XL",
        sku: "BAG-INS-XL",
        description: "Extra-large insulated bag — keeps food hot/cold up to 6 hours (55×45×30 cm)",
        price: 500,
        stock: 60,
        isActive: true,
        categoryId: category.id,
      },
    ],
  });

  console.log(`Seeded 8 products in category "${category.name}"`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
