SET SESSION statement_timeout = 3000;
SET SESSION lock_timeout = 3000;

CREATE SCHEMA "core";

CREATE TABLE "core"."asset_events" (
	"id" uuid DEFAULT uuidv7() NOT NULL,
	"asset_id" uuid NOT NULL,
	"event_type" text COLLATE "pg_catalog"."default" NOT NULL,
	"details" text COLLATE "pg_catalog"."default",
	"performed_by" text COLLATE "pg_catalog"."default",
	"created" timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE "core"."asset_events" ADD CONSTRAINT "asset_events_ck_event_type" CHECK((event_type = ANY (ARRAY['received'::text, 'deployed'::text, 'moved'::text, 'rma_sent'::text, 'rma_received'::text, 'decommissioned'::text, 'reserved'::text, 'note'::text])));

CREATE UNIQUE INDEX asset_events_pk ON core.asset_events USING btree (id);

ALTER TABLE "core"."asset_events" ADD CONSTRAINT "asset_events_pk" PRIMARY KEY USING INDEX "asset_events_pk";

CREATE TABLE "core"."assets" (
	"id" uuid DEFAULT uuidv7() NOT NULL,
	"device_catalog_id" uuid NOT NULL,
	"serial_number" text COLLATE "pg_catalog"."default",
	"asset_tag" text COLLATE "pg_catalog"."default",
	"purchase_date" date,
	"purchase_order" text COLLATE "pg_catalog"."default",
	"warranty_expiry" date,
	"status" text COLLATE "pg_catalog"."default" DEFAULT 'in_stock'::text NOT NULL,
	"notes" text COLLATE "pg_catalog"."default",
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp with time zone
);

ALTER TABLE "core"."assets" ADD CONSTRAINT "assets_ck_status" CHECK((status = ANY (ARRAY['in_stock'::text, 'deployed'::text, 'rma'::text, 'decommissioned'::text, 'in_transit'::text, 'reserved'::text])));

CREATE UNIQUE INDEX assets_pk ON core.assets USING btree (id);

ALTER TABLE "core"."assets" ADD CONSTRAINT "assets_pk" PRIMARY KEY USING INDEX "assets_pk";

CREATE UNIQUE INDEX assets_uq_asset_tag ON core.assets USING btree (asset_tag, deleted);

ALTER TABLE "core"."assets" ADD CONSTRAINT "assets_uq_asset_tag" UNIQUE USING INDEX "assets_uq_asset_tag";

CREATE UNIQUE INDEX assets_uq_serial_number ON core.assets USING btree (serial_number, deleted);

ALTER TABLE "core"."assets" ADD CONSTRAINT "assets_uq_serial_number" UNIQUE USING INDEX "assets_uq_serial_number";

ALTER TABLE "core"."asset_events" ADD CONSTRAINT "asset_events_fk_asset" FOREIGN KEY (asset_id) REFERENCES core.assets(id) NOT VALID;

ALTER TABLE "core"."asset_events" VALIDATE CONSTRAINT "asset_events_fk_asset";

CREATE TABLE "core"."device_catalogs" (
	"id" uuid DEFAULT uuidv7() NOT NULL,
	"manufacturer" text COLLATE "pg_catalog"."default" NOT NULL,
	"model" text COLLATE "pg_catalog"."default" NOT NULL,
	"part_number" text COLLATE "pg_catalog"."default",
	"category" text COLLATE "pg_catalog"."default" NOT NULL,
	"form_factor" text COLLATE "pg_catalog"."default",
	"rack_units" integer,
	"weight_kg" numeric,
	"power_draw_w" numeric,
	"specs" jsonb,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp with time zone
);

ALTER TABLE "core"."device_catalogs" ADD CONSTRAINT "device_catalogs_ck_category" CHECK((category = ANY (ARRAY['server'::text, 'switch'::text, 'pdu'::text, 'patch_panel'::text, 'sfp'::text, 'nic'::text, 'cpu'::text, 'dimm'::text, 'disk'::text, 'cable'::text, 'adapter'::text, 'power_supply'::text, 'cable_manager'::text, 'console_server'::text])));

CREATE UNIQUE INDEX device_catalogs_pk ON core.device_catalogs USING btree (id);

ALTER TABLE "core"."device_catalogs" ADD CONSTRAINT "device_catalogs_pk" PRIMARY KEY USING INDEX "device_catalogs_pk";

CREATE UNIQUE INDEX device_catalogs_uq_manufacturer_model ON core.device_catalogs USING btree (manufacturer, model, deleted) NULLS NOT DISTINCT;

ALTER TABLE "core"."device_catalogs" ADD CONSTRAINT "device_catalogs_uq_manufacturer_model" UNIQUE USING INDEX "device_catalogs_uq_manufacturer_model";

ALTER TABLE "core"."assets" ADD CONSTRAINT "assets_fk_device_catalog" FOREIGN KEY (device_catalog_id) REFERENCES core.device_catalogs(id) NOT VALID;

ALTER TABLE "core"."assets" VALIDATE CONSTRAINT "assets_fk_device_catalog";

CREATE TABLE "core"."logical_connections" (
	"id" uuid DEFAULT uuidv7() NOT NULL,
	"logical_design_id" uuid NOT NULL,
	"a_logical_device_id" uuid NOT NULL,
	"a_port_role" text COLLATE "pg_catalog"."default",
	"b_logical_device_id" uuid NOT NULL,
	"b_port_role" text COLLATE "pg_catalog"."default",
	"connection_type" text COLLATE "pg_catalog"."default" NOT NULL,
	"requirements" text COLLATE "pg_catalog"."default",
	"label" text COLLATE "pg_catalog"."default",
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp with time zone
);

ALTER TABLE "core"."logical_connections" ADD CONSTRAINT "logical_connections_ck_connection_type" CHECK((connection_type = ANY (ARRAY['network'::text, 'power'::text, 'console'::text])));

CREATE UNIQUE INDEX logical_connections_pk ON core.logical_connections USING btree (id);

ALTER TABLE "core"."logical_connections" ADD CONSTRAINT "logical_connections_pk" PRIMARY KEY USING INDEX "logical_connections_pk";

CREATE TABLE "core"."logical_designs" (
	"id" uuid DEFAULT uuidv7() NOT NULL,
	"name" text COLLATE "pg_catalog"."default" NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"description" text COLLATE "pg_catalog"."default",
	"status" text COLLATE "pg_catalog"."default" DEFAULT 'draft'::text NOT NULL,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp with time zone
);

ALTER TABLE "core"."logical_designs" ADD CONSTRAINT "logical_designs_ck_status" CHECK((status = ANY (ARRAY['draft'::text, 'active'::text, 'archived'::text])));

CREATE UNIQUE INDEX logical_designs_pk ON core.logical_designs USING btree (id);

ALTER TABLE "core"."logical_designs" ADD CONSTRAINT "logical_designs_pk" PRIMARY KEY USING INDEX "logical_designs_pk";

CREATE UNIQUE INDEX logical_designs_uq_name ON core.logical_designs USING btree (name, deleted) NULLS NOT DISTINCT;

ALTER TABLE "core"."logical_designs" ADD CONSTRAINT "logical_designs_uq_name" UNIQUE USING INDEX "logical_designs_uq_name";

ALTER TABLE "core"."logical_connections" ADD CONSTRAINT "logical_connections_fk_design" FOREIGN KEY (logical_design_id) REFERENCES core.logical_designs(id) NOT VALID;

ALTER TABLE "core"."logical_connections" VALIDATE CONSTRAINT "logical_connections_fk_design";

CREATE TABLE "core"."logical_device_layouts" (
	"id" uuid DEFAULT uuidv7() NOT NULL,
	"logical_device_id" uuid NOT NULL,
	"position_x" numeric NOT NULL,
	"position_y" numeric NOT NULL,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"updated" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX logical_device_layouts_pk ON core.logical_device_layouts USING btree (id);

ALTER TABLE "core"."logical_device_layouts" ADD CONSTRAINT "logical_device_layouts_pk" PRIMARY KEY USING INDEX "logical_device_layouts_pk";

CREATE TABLE "core"."logical_devices" (
	"id" uuid DEFAULT uuidv7() NOT NULL,
	"logical_design_id" uuid NOT NULL,
	"label" text COLLATE "pg_catalog"."default" NOT NULL,
	"role" text COLLATE "pg_catalog"."default" NOT NULL,
	"device_catalog_id" uuid,
	"requirements" text COLLATE "pg_catalog"."default",
	"notes" text COLLATE "pg_catalog"."default",
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp with time zone
);

ALTER TABLE "core"."logical_devices" ADD CONSTRAINT "logical_devices_ck_role" CHECK((role = ANY (ARRAY['compute'::text, 'tor'::text, 'spine'::text, 'core'::text, 'pdu'::text, 'patch_panel'::text, 'storage'::text, 'firewall'::text, 'load_balancer'::text, 'console_server'::text, 'cable_manager'::text, 'adapter'::text])));

ALTER TABLE "core"."logical_devices" ADD CONSTRAINT "logical_devices_fk_catalog" FOREIGN KEY (device_catalog_id) REFERENCES core.device_catalogs(id) NOT VALID;

ALTER TABLE "core"."logical_devices" VALIDATE CONSTRAINT "logical_devices_fk_catalog";

ALTER TABLE "core"."logical_devices" ADD CONSTRAINT "logical_devices_fk_design" FOREIGN KEY (logical_design_id) REFERENCES core.logical_designs(id) NOT VALID;

ALTER TABLE "core"."logical_devices" VALIDATE CONSTRAINT "logical_devices_fk_design";

CREATE UNIQUE INDEX logical_devices_pk ON core.logical_devices USING btree (id);

ALTER TABLE "core"."logical_devices" ADD CONSTRAINT "logical_devices_pk" PRIMARY KEY USING INDEX "logical_devices_pk";

CREATE UNIQUE INDEX logical_devices_uq_design_label ON core.logical_devices USING btree (logical_design_id, label, deleted) NULLS NOT DISTINCT;

ALTER TABLE "core"."logical_devices" ADD CONSTRAINT "logical_devices_uq_design_label" UNIQUE USING INDEX "logical_devices_uq_design_label";

ALTER TABLE "core"."logical_connections" ADD CONSTRAINT "logical_connections_fk_a_device" FOREIGN KEY (a_logical_device_id) REFERENCES core.logical_devices(id) NOT VALID;

ALTER TABLE "core"."logical_connections" VALIDATE CONSTRAINT "logical_connections_fk_a_device";

ALTER TABLE "core"."logical_connections" ADD CONSTRAINT "logical_connections_fk_b_device" FOREIGN KEY (b_logical_device_id) REFERENCES core.logical_devices(id) NOT VALID;

ALTER TABLE "core"."logical_connections" VALIDATE CONSTRAINT "logical_connections_fk_b_device";

ALTER TABLE "core"."logical_device_layouts" ADD CONSTRAINT "logical_device_layouts_fk_device" FOREIGN KEY (logical_device_id) REFERENCES core.logical_devices(id) NOT VALID;

ALTER TABLE "core"."logical_device_layouts" VALIDATE CONSTRAINT "logical_device_layouts_fk_device";

CREATE TABLE "core"."notes" (
	"id" uuid DEFAULT uuidv7() NOT NULL,
	"body" text COLLATE "pg_catalog"."default" NOT NULL,
	"created_by" text COLLATE "pg_catalog"."default",
	"device_catalog_id" uuid,
	"port_definition_id" uuid,
	"asset_id" uuid,
	"site_id" uuid,
	"room_id" uuid,
	"rack_row_id" uuid,
	"rack_id" uuid,
	"placement_id" uuid,
	"physical_connection_id" uuid,
	"logical_design_id" uuid,
	"logical_device_id" uuid,
	"logical_connection_id" uuid,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp with time zone
);

ALTER TABLE "core"."notes" ADD CONSTRAINT "notes_ck_single_ref" CHECK((num_nonnulls(device_catalog_id, port_definition_id, asset_id, site_id, room_id, rack_row_id, rack_id, placement_id, physical_connection_id, logical_design_id, logical_device_id, logical_connection_id) = 1));

ALTER TABLE "core"."notes" ADD CONSTRAINT "notes_fk_asset" FOREIGN KEY (asset_id) REFERENCES core.assets(id) NOT VALID;

ALTER TABLE "core"."notes" VALIDATE CONSTRAINT "notes_fk_asset";

ALTER TABLE "core"."notes" ADD CONSTRAINT "notes_fk_device_catalog" FOREIGN KEY (device_catalog_id) REFERENCES core.device_catalogs(id) NOT VALID;

ALTER TABLE "core"."notes" VALIDATE CONSTRAINT "notes_fk_device_catalog";

ALTER TABLE "core"."notes" ADD CONSTRAINT "notes_fk_logical_connection" FOREIGN KEY (logical_connection_id) REFERENCES core.logical_connections(id) NOT VALID;

ALTER TABLE "core"."notes" VALIDATE CONSTRAINT "notes_fk_logical_connection";

ALTER TABLE "core"."notes" ADD CONSTRAINT "notes_fk_logical_design" FOREIGN KEY (logical_design_id) REFERENCES core.logical_designs(id) NOT VALID;

ALTER TABLE "core"."notes" VALIDATE CONSTRAINT "notes_fk_logical_design";

ALTER TABLE "core"."notes" ADD CONSTRAINT "notes_fk_logical_device" FOREIGN KEY (logical_device_id) REFERENCES core.logical_devices(id) NOT VALID;

ALTER TABLE "core"."notes" VALIDATE CONSTRAINT "notes_fk_logical_device";

CREATE UNIQUE INDEX notes_pk ON core.notes USING btree (id);

ALTER TABLE "core"."notes" ADD CONSTRAINT "notes_pk" PRIMARY KEY USING INDEX "notes_pk";

CREATE TABLE "core"."physical_connections" (
	"id" uuid DEFAULT uuidv7() NOT NULL,
	"a_placement_id" uuid NOT NULL,
	"a_port_definition_id" uuid NOT NULL,
	"b_placement_id" uuid NOT NULL,
	"b_port_definition_id" uuid NOT NULL,
	"cable_asset_id" uuid,
	"logical_connection_id" uuid,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp with time zone
);

ALTER TABLE "core"."physical_connections" ADD CONSTRAINT "physical_connections_fk_cable_asset" FOREIGN KEY (cable_asset_id) REFERENCES core.assets(id) NOT VALID;

ALTER TABLE "core"."physical_connections" VALIDATE CONSTRAINT "physical_connections_fk_cable_asset";

ALTER TABLE "core"."physical_connections" ADD CONSTRAINT "physical_connections_fk_logical_connection" FOREIGN KEY (logical_connection_id) REFERENCES core.logical_connections(id) NOT VALID;

ALTER TABLE "core"."physical_connections" VALIDATE CONSTRAINT "physical_connections_fk_logical_connection";

CREATE UNIQUE INDEX physical_connections_pk ON core.physical_connections USING btree (id);

ALTER TABLE "core"."physical_connections" ADD CONSTRAINT "physical_connections_pk" PRIMARY KEY USING INDEX "physical_connections_pk";

ALTER TABLE "core"."notes" ADD CONSTRAINT "notes_fk_physical_connection" FOREIGN KEY (physical_connection_id) REFERENCES core.physical_connections(id) NOT VALID;

ALTER TABLE "core"."notes" VALIDATE CONSTRAINT "notes_fk_physical_connection";

CREATE TABLE "core"."placements" (
	"id" uuid DEFAULT uuidv7() NOT NULL,
	"asset_id" uuid NOT NULL,
	"rack_id" uuid,
	"start_unit" integer,
	"slot_type" text COLLATE "pg_catalog"."default",
	"parent_placement_id" uuid,
	"port_definition_id" uuid,
	"logical_device_id" uuid,
	"external_ref" text COLLATE "pg_catalog"."default",
	"notes" text COLLATE "pg_catalog"."default",
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp with time zone
);

ALTER TABLE "core"."placements" ADD CONSTRAINT "placements_ck_exclusive_arc" CHECK((((rack_id IS NOT NULL) AND (slot_type IS NOT NULL) AND (parent_placement_id IS NULL) AND (port_definition_id IS NULL)) OR ((rack_id IS NULL) AND (start_unit IS NULL) AND (slot_type IS NULL) AND (parent_placement_id IS NOT NULL) AND (port_definition_id IS NOT NULL))));

ALTER TABLE "core"."placements" ADD CONSTRAINT "placements_ck_slot_type" CHECK(((slot_type IS NULL) OR (slot_type = ANY (ARRAY['unit'::text, 'power'::text, 'zero_u'::text]))));

ALTER TABLE "core"."placements" ADD CONSTRAINT "placements_ck_unit_start" CHECK(((slot_type <> 'unit'::text) OR (start_unit IS NOT NULL)));

ALTER TABLE "core"."placements" ADD CONSTRAINT "placements_fk_asset" FOREIGN KEY (asset_id) REFERENCES core.assets(id) NOT VALID;

ALTER TABLE "core"."placements" VALIDATE CONSTRAINT "placements_fk_asset";

ALTER TABLE "core"."placements" ADD CONSTRAINT "placements_fk_logical_device" FOREIGN KEY (logical_device_id) REFERENCES core.logical_devices(id) NOT VALID;

ALTER TABLE "core"."placements" VALIDATE CONSTRAINT "placements_fk_logical_device";

CREATE UNIQUE INDEX placements_pk ON core.placements USING btree (id);

ALTER TABLE "core"."placements" ADD CONSTRAINT "placements_pk" PRIMARY KEY USING INDEX "placements_pk";

ALTER TABLE "core"."notes" ADD CONSTRAINT "notes_fk_placement" FOREIGN KEY (placement_id) REFERENCES core.placements(id) NOT VALID;

ALTER TABLE "core"."notes" VALIDATE CONSTRAINT "notes_fk_placement";

ALTER TABLE "core"."physical_connections" ADD CONSTRAINT "physical_connections_fk_a_placement" FOREIGN KEY (a_placement_id) REFERENCES core.placements(id) NOT VALID;

ALTER TABLE "core"."physical_connections" VALIDATE CONSTRAINT "physical_connections_fk_a_placement";

ALTER TABLE "core"."physical_connections" ADD CONSTRAINT "physical_connections_fk_b_placement" FOREIGN KEY (b_placement_id) REFERENCES core.placements(id) NOT VALID;

ALTER TABLE "core"."physical_connections" VALIDATE CONSTRAINT "physical_connections_fk_b_placement";

ALTER TABLE "core"."placements" ADD CONSTRAINT "placements_fk_parent" FOREIGN KEY (parent_placement_id) REFERENCES core.placements(id) NOT VALID;

ALTER TABLE "core"."placements" VALIDATE CONSTRAINT "placements_fk_parent";

CREATE TABLE "core"."port_compatibilities" (
	"id" uuid DEFAULT uuidv7() NOT NULL,
	"port_definition_id" uuid NOT NULL,
	"compatible_category" text COLLATE "pg_catalog"."default" NOT NULL,
	"compatible_catalog_id" uuid,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp with time zone
);

ALTER TABLE "core"."port_compatibilities" ADD CONSTRAINT "port_compatibilities_ck_compatible_category" CHECK((compatible_category = ANY (ARRAY['server'::text, 'switch'::text, 'pdu'::text, 'patch_panel'::text, 'sfp'::text, 'nic'::text, 'cpu'::text, 'dimm'::text, 'disk'::text, 'cable'::text, 'adapter'::text, 'power_supply'::text, 'cable_manager'::text, 'console_server'::text])));

ALTER TABLE "core"."port_compatibilities" ADD CONSTRAINT "port_compatibilities_fk_catalog" FOREIGN KEY (compatible_catalog_id) REFERENCES core.device_catalogs(id) NOT VALID;

ALTER TABLE "core"."port_compatibilities" VALIDATE CONSTRAINT "port_compatibilities_fk_catalog";

CREATE UNIQUE INDEX port_compatibilities_pk ON core.port_compatibilities USING btree (id);

ALTER TABLE "core"."port_compatibilities" ADD CONSTRAINT "port_compatibilities_pk" PRIMARY KEY USING INDEX "port_compatibilities_pk";

CREATE TABLE "core"."port_definitions" (
	"id" uuid DEFAULT uuidv7() NOT NULL,
	"device_catalog_id" uuid NOT NULL,
	"name" text COLLATE "pg_catalog"."default" NOT NULL,
	"port_type" text COLLATE "pg_catalog"."default" NOT NULL,
	"media_type" text COLLATE "pg_catalog"."default",
	"speed" text COLLATE "pg_catalog"."default",
	"max_power_w" numeric,
	"direction" text COLLATE "pg_catalog"."default" NOT NULL,
	"ordinal" integer NOT NULL,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp with time zone
);

ALTER TABLE "core"."port_definitions" ADD CONSTRAINT "port_definitions_ck_direction" CHECK((direction = ANY (ARRAY['in'::text, 'out'::text, 'bidir'::text])));

ALTER TABLE "core"."port_definitions" ADD CONSTRAINT "port_definitions_ck_port_type" CHECK((port_type = ANY (ARRAY['network'::text, 'power_in'::text, 'power_out'::text, 'slot'::text, 'bay'::text, 'console'::text])));

ALTER TABLE "core"."port_definitions" ADD CONSTRAINT "port_definitions_fk_device_catalog" FOREIGN KEY (device_catalog_id) REFERENCES core.device_catalogs(id) NOT VALID;

ALTER TABLE "core"."port_definitions" VALIDATE CONSTRAINT "port_definitions_fk_device_catalog";

CREATE UNIQUE INDEX port_definitions_pk ON core.port_definitions USING btree (id);

ALTER TABLE "core"."port_definitions" ADD CONSTRAINT "port_definitions_pk" PRIMARY KEY USING INDEX "port_definitions_pk";

CREATE UNIQUE INDEX port_definitions_uq_catalog_name ON core.port_definitions USING btree (device_catalog_id, name, deleted) NULLS NOT DISTINCT;

ALTER TABLE "core"."port_definitions" ADD CONSTRAINT "port_definitions_uq_catalog_name" UNIQUE USING INDEX "port_definitions_uq_catalog_name";

ALTER TABLE "core"."notes" ADD CONSTRAINT "notes_fk_port_definition" FOREIGN KEY (port_definition_id) REFERENCES core.port_definitions(id) NOT VALID;

ALTER TABLE "core"."notes" VALIDATE CONSTRAINT "notes_fk_port_definition";

ALTER TABLE "core"."physical_connections" ADD CONSTRAINT "physical_connections_fk_a_port" FOREIGN KEY (a_port_definition_id) REFERENCES core.port_definitions(id) NOT VALID;

ALTER TABLE "core"."physical_connections" VALIDATE CONSTRAINT "physical_connections_fk_a_port";

ALTER TABLE "core"."physical_connections" ADD CONSTRAINT "physical_connections_fk_b_port" FOREIGN KEY (b_port_definition_id) REFERENCES core.port_definitions(id) NOT VALID;

ALTER TABLE "core"."physical_connections" VALIDATE CONSTRAINT "physical_connections_fk_b_port";

ALTER TABLE "core"."placements" ADD CONSTRAINT "placements_fk_port_definition" FOREIGN KEY (port_definition_id) REFERENCES core.port_definitions(id) NOT VALID;

ALTER TABLE "core"."placements" VALIDATE CONSTRAINT "placements_fk_port_definition";

ALTER TABLE "core"."port_compatibilities" ADD CONSTRAINT "port_compatibilities_fk_port_definition" FOREIGN KEY (port_definition_id) REFERENCES core.port_definitions(id) NOT VALID;

ALTER TABLE "core"."port_compatibilities" VALIDATE CONSTRAINT "port_compatibilities_fk_port_definition";

CREATE TABLE "core"."rack_rows" (
	"id" uuid DEFAULT uuidv7() NOT NULL,
	"room_id" uuid NOT NULL,
	"name" text COLLATE "pg_catalog"."default" NOT NULL,
	"position_x" double precision,
	"position_y" double precision,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp with time zone
);

CREATE UNIQUE INDEX rack_rows_pk ON core.rack_rows USING btree (id);

ALTER TABLE "core"."rack_rows" ADD CONSTRAINT "rack_rows_pk" PRIMARY KEY USING INDEX "rack_rows_pk";

CREATE UNIQUE INDEX rack_rows_uq_room_name ON core.rack_rows USING btree (room_id, name, deleted) NULLS NOT DISTINCT;

ALTER TABLE "core"."rack_rows" ADD CONSTRAINT "rack_rows_uq_room_name" UNIQUE USING INDEX "rack_rows_uq_room_name";

ALTER TABLE "core"."notes" ADD CONSTRAINT "notes_fk_rack_row" FOREIGN KEY (rack_row_id) REFERENCES core.rack_rows(id) NOT VALID;

ALTER TABLE "core"."notes" VALIDATE CONSTRAINT "notes_fk_rack_row";

CREATE TABLE "core"."racks" (
	"id" uuid DEFAULT uuidv7() NOT NULL,
	"rack_row_id" uuid NOT NULL,
	"name" text COLLATE "pg_catalog"."default" NOT NULL,
	"total_units" integer NOT NULL,
	"position_in_row" integer NOT NULL,
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp with time zone
);

ALTER TABLE "core"."racks" ADD CONSTRAINT "racks_fk_rack_row" FOREIGN KEY (rack_row_id) REFERENCES core.rack_rows(id) NOT VALID;

ALTER TABLE "core"."racks" VALIDATE CONSTRAINT "racks_fk_rack_row";

CREATE UNIQUE INDEX racks_pk ON core.racks USING btree (id);

ALTER TABLE "core"."racks" ADD CONSTRAINT "racks_pk" PRIMARY KEY USING INDEX "racks_pk";

CREATE UNIQUE INDEX racks_uq_rack_row_name ON core.racks USING btree (rack_row_id, name, deleted) NULLS NOT DISTINCT;

ALTER TABLE "core"."racks" ADD CONSTRAINT "racks_uq_rack_row_name" UNIQUE USING INDEX "racks_uq_rack_row_name";

ALTER TABLE "core"."notes" ADD CONSTRAINT "notes_fk_rack" FOREIGN KEY (rack_id) REFERENCES core.racks(id) NOT VALID;

ALTER TABLE "core"."notes" VALIDATE CONSTRAINT "notes_fk_rack";

ALTER TABLE "core"."placements" ADD CONSTRAINT "placements_fk_rack" FOREIGN KEY (rack_id) REFERENCES core.racks(id) NOT VALID;

ALTER TABLE "core"."placements" VALIDATE CONSTRAINT "placements_fk_rack";

CREATE TABLE "core"."rooms" (
	"id" uuid DEFAULT uuidv7() NOT NULL,
	"site_id" uuid NOT NULL,
	"name" text COLLATE "pg_catalog"."default" NOT NULL,
	"floor" text COLLATE "pg_catalog"."default",
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp with time zone
);

CREATE UNIQUE INDEX rooms_pk ON core.rooms USING btree (id);

ALTER TABLE "core"."rooms" ADD CONSTRAINT "rooms_pk" PRIMARY KEY USING INDEX "rooms_pk";

CREATE UNIQUE INDEX rooms_uq_site_name ON core.rooms USING btree (site_id, name, deleted) NULLS NOT DISTINCT;

ALTER TABLE "core"."rooms" ADD CONSTRAINT "rooms_uq_site_name" UNIQUE USING INDEX "rooms_uq_site_name";

ALTER TABLE "core"."notes" ADD CONSTRAINT "notes_fk_room" FOREIGN KEY (room_id) REFERENCES core.rooms(id) NOT VALID;

ALTER TABLE "core"."notes" VALIDATE CONSTRAINT "notes_fk_room";

ALTER TABLE "core"."rack_rows" ADD CONSTRAINT "rack_rows_fk_room" FOREIGN KEY (room_id) REFERENCES core.rooms(id) NOT VALID;

ALTER TABLE "core"."rack_rows" VALIDATE CONSTRAINT "rack_rows_fk_room";

CREATE TABLE "core"."sites" (
	"id" uuid DEFAULT uuidv7() NOT NULL,
	"name" text COLLATE "pg_catalog"."default" NOT NULL,
	"address" text COLLATE "pg_catalog"."default",
	"created" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted" timestamp with time zone
);

CREATE UNIQUE INDEX sites_pk ON core.sites USING btree (id);

ALTER TABLE "core"."sites" ADD CONSTRAINT "sites_pk" PRIMARY KEY USING INDEX "sites_pk";

CREATE UNIQUE INDEX sites_uq_name ON core.sites USING btree (name, deleted) NULLS NOT DISTINCT;

ALTER TABLE "core"."sites" ADD CONSTRAINT "sites_uq_name" UNIQUE USING INDEX "sites_uq_name";

ALTER TABLE "core"."notes" ADD CONSTRAINT "notes_fk_site" FOREIGN KEY (site_id) REFERENCES core.sites(id) NOT VALID;

ALTER TABLE "core"."notes" VALIDATE CONSTRAINT "notes_fk_site";

ALTER TABLE "core"."rooms" ADD CONSTRAINT "rooms_fk_site" FOREIGN KEY (site_id) REFERENCES core.sites(id) NOT VALID;

ALTER TABLE "core"."rooms" VALIDATE CONSTRAINT "rooms_fk_site";


-- Statements generated automatically, please review:
ALTER SCHEMA core OWNER TO dcim_owner;
ALTER TABLE core.asset_events OWNER TO dcim_owner;
ALTER TABLE core.assets OWNER TO dcim_owner;
ALTER TABLE core.device_catalogs OWNER TO dcim_owner;
ALTER TABLE core.logical_connections OWNER TO dcim_owner;
ALTER TABLE core.logical_designs OWNER TO dcim_owner;
ALTER TABLE core.logical_device_layouts OWNER TO dcim_owner;
ALTER TABLE core.logical_devices OWNER TO dcim_owner;
ALTER TABLE core.notes OWNER TO dcim_owner;
ALTER TABLE core.physical_connections OWNER TO dcim_owner;
ALTER TABLE core.placements OWNER TO dcim_owner;
ALTER TABLE core.port_compatibilities OWNER TO dcim_owner;
ALTER TABLE core.port_definitions OWNER TO dcim_owner;
ALTER TABLE core.rack_rows OWNER TO dcim_owner;
ALTER TABLE core.racks OWNER TO dcim_owner;
ALTER TABLE core.rooms OWNER TO dcim_owner;
ALTER TABLE core.sites OWNER TO dcim_owner;
