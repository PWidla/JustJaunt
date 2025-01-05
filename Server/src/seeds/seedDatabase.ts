import { seedUsers } from "./seerUsers";

export const seedDatabase = async () => {
  console.log("Starting database seeding...");

  await seedUsers();
  console.log("Database seeding complete.");
};
