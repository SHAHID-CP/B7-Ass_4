import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";
import { PaymentStatus, RentalStatus, Role, UserStatus } from "../generated/prisma/enums";

async function main() {
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.rentalRequest.deleteMany();
  await prisma.property.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("12345678", 10);

  const admin = await prisma.user.create({
    data: {
      name: "System Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const landlord = await prisma.user.create({
    data: {
      name: "John Landlord",
      email: "landlord@gmail.com",
      password: hashedPassword,
      role: Role.LANDLORD,
      status: UserStatus.ACTIVE,
    },
  });

  const tenant = await prisma.user.create({
    data: {
      name: "Rahim Tenant",
      email: "tenant@gmail.com",
      password: hashedPassword,
      role: Role.TENANT,
      status: UserStatus.ACTIVE,
    },
  });

  const category = await prisma.category.create({
    data: {
      name: "Apartment",
    },
  });


  const property = await prisma.property.create({
    data: {
      title: "Luxury 3BHK Apartment in Gulshan",
      description: "Modern fully furnished apartment with city view.",
      location: "Gulshan 2, Dhaka",
      price: 35000,
      isAvailable: true,
      landlordId: landlord.id,
      categoryId: category.id,
    },
  });


  const rentalRequest = await prisma.rentalRequest.create({
    data: {
      tenantId: tenant.id,
      propertyId: property.id,
      status: RentalStatus.PAID,
    },
  });


  await prisma.payment.create({
    data: {
      rentalRequestId: rentalRequest.id,
      transactionId: "txn_seed_demo_123456",
      amount: property.price,
      provider: "stripe",
      status: PaymentStatus.COMPLETED,
      paidAt: new Date(),
    },
  });


  await prisma.review.create({
    data: {
      rentalRequestId: rentalRequest.id,
      propertyId: property.id,
      tenantId: tenant.id,
      rating: 5,
      comment: "Excellent experience! The flat was clean and payment process was smooth.",
    },
  });

  console.log("✅ Database Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error while seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });