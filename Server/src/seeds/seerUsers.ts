import { User } from "../models/user";

export const seedUsers = async () => {
  try {
    const existingUsers = await User.find();
    if (existingUsers.length > 0) {
      console.log("Users already seeded");
      return;
    }

    const users = [
      {
        username: "testuser1",
        password: "password1",
      },
      {
        username: "testuser2",
        password: "password2",
      },
    ];

    await User.insertMany(users);
    console.log("Users seeded successfully");
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};
