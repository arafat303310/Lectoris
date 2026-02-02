import { db } from "./db";
import { eq } from "drizzle-orm";
import { 
  universities, 
  scholarships, 
  services, 
  subscriptionPlans,
  users 
} from "@shared/schema";
import { 
  ugandaUniversitiesData, 
  ugandaScholarshipsData, 
  servicesData, 
  subscriptionPlansData 
} from "./seed-data";
import bcrypt from "bcryptjs";

export async function seed() {
  console.log("Seeding database...");

  // Seed Subscription Plans
  for (const plan of subscriptionPlansData) {
    await db.insert(subscriptionPlans).values({
      ...plan,
      monthlyPrice: plan.monthlyPrice.toString(),
      annualPrice: plan.annualPrice?.toString(),
    }).onConflictDoNothing();
  }
  console.log("Seeded subscription plans");

  // Seed Universities
  for (const uni of ugandaUniversitiesData) {
    await db.insert(universities).values({
      ...uni,
      tuitionMin: uni.tuitionMin?.toString(),
      tuitionMax: uni.tuitionMax?.toString(),
    }).onConflictDoNothing();
  }
  console.log("Seeded universities");

  // Seed Scholarships
  for (const sch of ugandaScholarshipsData) {
    await db.insert(scholarships).values({
      ...sch,
      amount: sch.amount?.toString(),
    }).onConflictDoNothing();
  }
  console.log("Seeded scholarships");

  // Seed Services
  for (const svc of servicesData) {
    await db.insert(services).values({
      ...svc,
      basePrice: svc.basePrice.toString(),
    }).onConflictDoNothing();
  }
  console.log("Seeded services");

  // Seed Admin User if not exists
  const adminUsername = "admin";
  const existingAdmin = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.username, adminUsername)
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("Admin123!", 10);
    await db.insert(users).values({
      email: "admin@lectoris.ug",
      username: adminUsername,
      password: hashedPassword,
      firstName: "System",
      lastName: "Admin",
      isAdmin: true,
      subscriptionTier: "premium",
    });
    console.log("Seeded admin user");
  } else {
    // Ensure existing admin user has the correct password and is admin
    const hashedPassword = await bcrypt.hash("Admin123!", 10);
    await db.update(users)
      .set({ 
        password: hashedPassword, 
        isAdmin: true,
        updatedAt: new Date()
      })
      .where(eq(users.id, existingAdmin.id));
    console.log("Updated admin user password and privileges");
  }

  console.log("Seeding completed successfully");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seed().catch(console.error);
}
