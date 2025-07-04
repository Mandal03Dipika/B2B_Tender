import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tender_services", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("tender_id")
      .notNullable()
      .references("id")
      .inTable("tenders")
      .onDelete("CASCADE");
    table
      .uuid("goods_service_id")
      .notNullable()
      .references("id")
      .inTable("goods_services")
      .onDelete("CASCADE");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("tender_services");
}
