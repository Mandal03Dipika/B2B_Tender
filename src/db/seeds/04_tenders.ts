import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";
import { companies } from "./02_companies";

function getRandomTitle() {
  const verbs = ["Develop", "Supply", "Install", "Upgrade", "Maintain", "Design"];
  const objects = ["Software", "Network", "Infrastructure", "System", "Product", "Application"];
  return `${verbs[Math.floor(Math.random() * verbs.length)]} ${objects[Math.floor(Math.random() * objects.length)]}`;
}

function getRandomBudget() {
  return (Math.floor(Math.random() * 490000) + 10000).toFixed(2);
}

function getRandomDeadline() {
  const today = new Date();
  const days = Math.floor(Math.random() * 61) + 30;
  return new Date(today.getTime() + days * 86400000);
}

export const tenders: any[] = [];

for (const company of companies) {
  const numTenders = Math.floor(Math.random() * 3) + 5;
  for (let i = 0; i < numTenders; i++) {
    tenders.push({
      id: uuidv4(),
      company_id: company.id,
      title: getRandomTitle(),
      description: "Detailed scope of work and expectations.",
      deadline: getRandomDeadline(),
      budget: getRandomBudget(),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
}

export async function seed(knex: Knex): Promise<void> {
  await knex("tenders").del();
  await knex("tenders").insert(tenders);
}
