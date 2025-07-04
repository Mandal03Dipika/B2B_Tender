import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("applications", (table) => {
    table.uuid("id").primary().defaultTo(knex.raw("gen_random_uuid()"));
    table
      .uuid("tender_id")
      .notNullable()
      .references("id")
      .inTable("tenders")
      .onDelete("CASCADE");
    table
      .uuid("applicant_company_id")
      .notNullable()
      .references("id")
      .inTable("companies")
      .onDelete("CASCADE");
    table.text("proposal").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTableIfExists("applications");
}
