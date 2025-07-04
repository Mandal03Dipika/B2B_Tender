import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";
import { users } from "./01_users";

const industries = [
  "Construction",
  "IT Services",
  "Healthcare",
  "Manufacturing",
  "Finance",
  "Logistics",
  "Retail",
  "Telecom",
];

function getRandomIndustry() {
  return industries[Math.floor(Math.random() * industries.length)];
}

function getRandomCompanyName() {
  const prefixes = [
    "Tech",
    "Global",
    "Prime",
    "NextGen",
    "Quantum",
    "Infinity",
  ];
  const suffixes = ["Solutions", "Industries", "Group", "Systems", "Holdings"];
  return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${
    suffixes[Math.floor(Math.random() * suffixes.length)]
  }`;
}

export const companies: any[] = [];

for (const user of users) {
  const numCompanies = Math.floor(Math.random() * 6) + 5;
  for (let i = 0; i < numCompanies; i++) {
    companies.push({
      id: uuidv4(),
      name: getRandomCompanyName(),
      industry: getRandomIndustry(),
      description: "Lorem ipsum dolor sit amet.",
      logo_url: "https://dummyimage.com/200x100",
      created_by: user.id,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
}

export async function seed(knex: Knex): Promise<void> {
  await knex("companies").del();
  await knex("companies").insert(companies);
}
