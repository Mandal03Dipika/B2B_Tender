import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";
import { companies } from "./02_companies";

function getRandomServiceName() {
  const adjectives = ["Smart", "Eco", "Advanced", "Secure", "Cloud", "Dynamic"];
  const nouns = ["Platform", "Tool", "Service", "API", "Device", "Solution"];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
}

export const goods_services: any[] = [];

for (const company of companies) {
  const numServices = Math.floor(Math.random() * 4) + 2;
  for (let i = 0; i < numServices; i++) {
    goods_services.push({
      id: uuidv4(),
      company_id: company.id,
      name: getRandomServiceName(),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
}

export async function seed(knex: Knex): Promise<void> {
  await knex("goods_services").del();
  await knex("goods_services").insert(goods_services);
}
