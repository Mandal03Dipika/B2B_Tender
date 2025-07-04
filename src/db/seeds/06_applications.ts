import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";
import { companies } from "./02_companies";
import { tenders } from "./04_tenders";

function getRandomProposal() {
  const phrases = [
    "We offer a cost-effective solution tailored to your needs.",
    "Our team ensures high-quality deliverables.",
    "Proven track record with similar projects.",
    "Guaranteed compliance with industry standards.",
    "Flexible timeline and transparent pricing.",
  ];
  return phrases[Math.floor(Math.random() * phrases.length)];
}

export const applications: any[] = [];

for (const company of companies) {
  const eligibleTenders = tenders.filter(t => t.company_id !== company.id);
  const numApplications = Math.min(eligibleTenders.length, Math.floor(Math.random() * 4) + 2);
  const shuffled = [...eligibleTenders].sort(() => 0.5 - Math.random());
  const selectedTenders = shuffled.slice(0, numApplications);

  for (const tender of selectedTenders) {
    applications.push({
      id: uuidv4(),
      tender_id: tender.id,
      applicant_company_id: company.id,
      proposal: getRandomProposal(),
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
}

export async function seed(knex: Knex): Promise<void> {
  await knex("applications").del();
  await knex("applications").insert(applications);
}
