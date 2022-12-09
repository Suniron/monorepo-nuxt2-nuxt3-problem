
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.up = async (knex) => {
  if (knex.userParams.isSetup) {
    return Promise.resolve()
  }

  await knex.raw(`CREATE TABLE IF NOT EXISTS public.scan_label (
    "type" varchar NOT NULL, "label" varchar NOT NULL, CONSTRAINT scan_label_pk PRIMARY KEY ("type")
  );
  
  COMMENT ON COLUMN public.scan_label."type" IS 'The scan type';
  COMMENT ON COLUMN public.scan_label."label" IS 'The label to display';
  
  INSERT INTO public.scan_label ("type","label") VALUES
	 ('nessus','vulnerability'),
	 ('nessus_hardening','hardening'),
	 ('phish','phishing'),
	 ('nmap','discovery');
  `)
}
/**
 *
 * @param {import('knex').Knex} knex
 */
exports.down = async (knex) => {
  // NEW TABLES
  await knex.raw('DROP TABLE IF EXISTS scan_label CASCADE;')
}
