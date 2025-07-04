import { Knex } from "knex";
import { v4 as uuidv4 } from "uuid";
import { tenders } from "./04_tenders";
import { goods_services } from "./03_goods_services";

export const tender_services: any[] = [];

for (const tender of tenders) {
  const availableServices = goods_services.filter(gs => gs.company_id === tender.company_id);
  const shuffled = [...availableServices].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, Math.min(3, shuffled.length));

  for (const service of selected) {
    tender_services.push({
      id: uuidv4(),
      tender_id: tender.id,
      goods_service_id: service.id,
      created_at: new Date(),
      updated_at: new Date(),
    });
  }
}

export async function seed(knex: Knex): Promise<void> {
  await knex("tender_services").del();
  await knex("tender_services").insert(tender_services);
}
