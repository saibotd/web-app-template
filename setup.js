import "dotenv/config";
import db from "./src/db.js";
import { Role, User } from "./app/models.js";

await db.sync({ force: true });

const [adminRole] = await Role.findOrCreate({
  where: { name: "admin" },
  defaults: {},
});

console.log("Created role", adminRole.toJSON());

const [user] = await User.findOrCreate({
  where: { username: process.env.ADMIN_USER },
  defaults: {
    email: process.env.ADMIN_EMAIL,
    emailVerified: true,
    password: process.env.ADMIN_PASS,
    roleId: adminRole.id,
  },
});

console.log("Created user", user.toJSON());
