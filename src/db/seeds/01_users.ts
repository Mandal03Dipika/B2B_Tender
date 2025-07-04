import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";

export const users = Array.from({ length: 5 }, (_, i) => ({
  id: uuidv4(),
  email: `user${i + 1}@example.com`,
  password: `hashedpassword${i + 1}`,
  created_at: new Date(),
  updated_at: new Date(),
}));

export async function seed(knex: Knex): Promise<void> {
  await knex("users").del();
  await knex("users").insert(users);
}
