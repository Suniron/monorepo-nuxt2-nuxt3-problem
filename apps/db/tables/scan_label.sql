CREATE TABLE IF NOT EXISTS public.scan_label (
	"type" varchar NOT NULL, "label" varchar NOT NULL
);

COMMENT ON COLUMN public.scan_label."type" IS 'The scan type';
COMMENT ON COLUMN public.scan_label."label" IS 'The label to display';

