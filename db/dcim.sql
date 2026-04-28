-- ** Database generated with pgModeler (PostgreSQL Database Modeler).
-- ** pgModeler version: 1.2.3
-- ** PostgreSQL version: 18.0
-- ** Project Site: pgmodeler.io
-- ** Model Author: ---

-- object: core | type: SCHEMA --
-- DROP SCHEMA IF EXISTS core CASCADE;
CREATE SCHEMA core;
-- ddl-end --
ALTER SCHEMA core OWNER TO dcim_owner;
-- ddl-end --

SET search_path TO pg_catalog,public,core;
-- ddl-end --

-- object: core.sites | type: TABLE --
-- DROP TABLE IF EXISTS core.sites CASCADE;
CREATE TABLE core.sites (
	id uuid NOT NULL DEFAULT uuidv7(),
	name text NOT NULL,
	address text,
	created timestamptz NOT NULL DEFAULT now(),
	deleted timestamptz,
	CONSTRAINT sites_pk PRIMARY KEY (id),
	CONSTRAINT sites_uq_name UNIQUE NULLS NOT DISTINCT (name,deleted)
);
-- ddl-end --
ALTER TABLE core.sites OWNER TO dcim_owner;
-- ddl-end --

-- object: core.rooms | type: TABLE --
-- DROP TABLE IF EXISTS core.rooms CASCADE;
CREATE TABLE core.rooms (
	id uuid NOT NULL DEFAULT uuidv7(),
	site_id uuid NOT NULL,
	name text NOT NULL,
	created timestamptz NOT NULL DEFAULT now(),
	deleted timestamptz,
	CONSTRAINT rooms_pk PRIMARY KEY (id),
	CONSTRAINT rooms_uq_site_name UNIQUE NULLS NOT DISTINCT (site_id,name,deleted)
);
-- ddl-end --
ALTER TABLE core.rooms OWNER TO dcim_owner;
-- ddl-end --

-- object: core.rack_rows | type: TABLE --
-- DROP TABLE IF EXISTS core.rack_rows CASCADE;
CREATE TABLE core.rack_rows (
	id uuid NOT NULL DEFAULT uuidv7(),
	room_id uuid NOT NULL,
	name text NOT NULL,
	position_x integer,
	position_y integer,
	created timestamptz NOT NULL DEFAULT now(),
	deleted timestamptz,
	CONSTRAINT rack_rows_pk PRIMARY KEY (id),
	CONSTRAINT rack_rows_uq_room_name UNIQUE NULLS NOT DISTINCT (room_id,name,deleted)
);
-- ddl-end --
ALTER TABLE core.rack_rows OWNER TO dcim_owner;
-- ddl-end --

-- object: core.racks | type: TABLE --
-- DROP TABLE IF EXISTS core.racks CASCADE;
CREATE TABLE core.racks (
	id uuid NOT NULL DEFAULT uuidv7(),
	rack_row_id uuid NOT NULL,
	name text NOT NULL,
	total_units integer NOT NULL,
	position_in_row integer NOT NULL,
	created timestamptz NOT NULL DEFAULT now(),
	deleted timestamptz,
	CONSTRAINT racks_pk PRIMARY KEY (id),
	CONSTRAINT racks_uq_rack_row_name UNIQUE NULLS NOT DISTINCT (rack_row_id,name,deleted)
);
-- ddl-end --
ALTER TABLE core.racks OWNER TO dcim_owner;
-- ddl-end --

-- object: core.device_catalogs | type: TABLE --
-- DROP TABLE IF EXISTS core.device_catalogs CASCADE;
CREATE TABLE core.device_catalogs (
	id uuid NOT NULL DEFAULT uuidv7(),
	manufacturer text NOT NULL,
	model text NOT NULL,
	part_number text,
	category text NOT NULL,
	form_factor text,
	rack_units integer,
	weight_kg numeric,
	power_draw_w numeric,
	specs jsonb,
	created timestamptz NOT NULL DEFAULT now(),
	deleted timestamptz,
	CONSTRAINT device_catalogs_pk PRIMARY KEY (id),
	CONSTRAINT device_catalogs_uq_manufacturer_model UNIQUE NULLS NOT DISTINCT (manufacturer,model,deleted),
	CONSTRAINT device_catalogs_ck_category CHECK (category IN ('server','switch','pdu','patch_panel','sfp','nic','cpu','dimm','disk','cable','adapter','power_supply','cable_manager','console_server'))
);
-- ddl-end --
ALTER TABLE core.device_catalogs OWNER TO dcim_owner;
-- ddl-end --

-- object: core.port_definitions | type: TABLE --
-- DROP TABLE IF EXISTS core.port_definitions CASCADE;
CREATE TABLE core.port_definitions (
	id uuid NOT NULL DEFAULT uuidv7(),
	device_catalog_id uuid NOT NULL,
	name text NOT NULL,
	port_type text NOT NULL,
	media_type text,
	speed text,
	max_power_w numeric,
	direction text NOT NULL,
	ordinal integer NOT NULL,
	created timestamptz NOT NULL DEFAULT now(),
	deleted timestamptz,
	CONSTRAINT port_definitions_pk PRIMARY KEY (id),
	CONSTRAINT port_definitions_uq_catalog_name UNIQUE NULLS NOT DISTINCT (device_catalog_id,name,deleted),
	CONSTRAINT port_definitions_ck_port_type CHECK (port_type IN ('network','power_in','power_out','slot','bay','console')),
	CONSTRAINT port_definitions_ck_direction CHECK (direction IN ('in','out','bidir'))
);
-- ddl-end --
ALTER TABLE core.port_definitions OWNER TO dcim_owner;
-- ddl-end --

-- object: core.port_compatibilities | type: TABLE --
-- DROP TABLE IF EXISTS core.port_compatibilities CASCADE;
CREATE TABLE core.port_compatibilities (
	id uuid NOT NULL DEFAULT uuidv7(),
	port_definition_id uuid NOT NULL,
	compatible_category text NOT NULL,
	compatible_catalog_id uuid,
	created timestamptz NOT NULL DEFAULT now(),
	deleted timestamptz,
	CONSTRAINT port_compatibilities_pk PRIMARY KEY (id),
	CONSTRAINT port_compatibilities_ck_compatible_category CHECK (compatible_category IN ('server','switch','pdu','patch_panel','sfp','nic','cpu','dimm','disk','cable','adapter','power_supply','cable_manager','console_server'))
);
-- ddl-end --
ALTER TABLE core.port_compatibilities OWNER TO dcim_owner;
-- ddl-end --

-- object: core.assets | type: TABLE --
-- DROP TABLE IF EXISTS core.assets CASCADE;
CREATE TABLE core.assets (
	id uuid NOT NULL DEFAULT uuidv7(),
	device_catalog_id uuid NOT NULL,
	serial_number text,
	asset_tag text,
	purchase_date date,
	warranty_expiry date,
	status text NOT NULL DEFAULT 'in_stock',
	created timestamptz NOT NULL DEFAULT now(),
	deleted timestamptz,
	CONSTRAINT assets_pk PRIMARY KEY (id),
	CONSTRAINT assets_uq_serial_number UNIQUE NULLS NOT DISTINCT (serial_number,deleted),
	CONSTRAINT assets_uq_asset_tag UNIQUE NULLS NOT DISTINCT (asset_tag,deleted),
	CONSTRAINT assets_ck_status CHECK (status IN ('in_stock','deployed','rma','decommissioned','in_transit','reserved'))
);
-- ddl-end --
ALTER TABLE core.assets OWNER TO dcim_owner;
-- ddl-end --

-- object: core.asset_events | type: TABLE --
-- DROP TABLE IF EXISTS core.asset_events CASCADE;
CREATE TABLE core.asset_events (
	id uuid NOT NULL DEFAULT uuidv7(),
	asset_id uuid NOT NULL,
	event_type text NOT NULL,
	description text,
	created timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT asset_events_pk PRIMARY KEY (id),
	CONSTRAINT asset_events_ck_event_type CHECK (event_type IN ('received','deployed','moved','rma_sent','rma_received','decommissioned','reserved','note'))
);
-- ddl-end --
ALTER TABLE core.asset_events OWNER TO dcim_owner;
-- ddl-end --

-- object: core.logical_designs | type: TABLE --
-- DROP TABLE IF EXISTS core.logical_designs CASCADE;
CREATE TABLE core.logical_designs (
	id uuid NOT NULL DEFAULT uuidv7(),
	name text NOT NULL,
	version integer NOT NULL DEFAULT 1,
	status text NOT NULL DEFAULT 'draft',
	created timestamptz NOT NULL DEFAULT now(),
	deleted timestamptz,
	CONSTRAINT logical_designs_pk PRIMARY KEY (id),
	CONSTRAINT logical_designs_uq_name UNIQUE NULLS NOT DISTINCT (name,deleted),
	CONSTRAINT logical_designs_ck_status CHECK (status IN ('draft','active','archived'))
);
-- ddl-end --
ALTER TABLE core.logical_designs OWNER TO dcim_owner;
-- ddl-end --

-- object: core.logical_devices | type: TABLE --
-- DROP TABLE IF EXISTS core.logical_devices CASCADE;
CREATE TABLE core.logical_devices (
	id uuid NOT NULL DEFAULT uuidv7(),
	logical_design_id uuid NOT NULL,
	name text NOT NULL,
	role text NOT NULL,
	device_catalog_id uuid,
	created timestamptz NOT NULL DEFAULT now(),
	deleted timestamptz,
	CONSTRAINT logical_devices_pk PRIMARY KEY (id),
	CONSTRAINT logical_devices_uq_design_name UNIQUE NULLS NOT DISTINCT (logical_design_id,name,deleted),
	CONSTRAINT logical_devices_ck_role CHECK (role IN ('compute','tor','spine','core','pdu','patch_panel','storage','firewall','load_balancer','console_server','cable_manager','adapter'))
);
-- ddl-end --
ALTER TABLE core.logical_devices OWNER TO dcim_owner;
-- ddl-end --

-- object: core.logical_connections | type: TABLE --
-- DROP TABLE IF EXISTS core.logical_connections CASCADE;
CREATE TABLE core.logical_connections (
	id uuid NOT NULL DEFAULT uuidv7(),
	logical_design_id uuid NOT NULL,
	a_logical_device_id uuid NOT NULL,
	b_logical_device_id uuid NOT NULL,
	connection_type text NOT NULL,
	created timestamptz NOT NULL DEFAULT now(),
	deleted timestamptz,
	CONSTRAINT logical_connections_pk PRIMARY KEY (id),
	CONSTRAINT logical_connections_ck_connection_type CHECK (connection_type IN ('network','power','console'))
);
-- ddl-end --
ALTER TABLE core.logical_connections OWNER TO dcim_owner;
-- ddl-end --

-- object: core.logical_device_layouts | type: TABLE --
-- DROP TABLE IF EXISTS core.logical_device_layouts CASCADE;
CREATE TABLE core.logical_device_layouts (
	id uuid NOT NULL DEFAULT uuidv7(),
	logical_device_id uuid NOT NULL,
	position_x numeric NOT NULL,
	position_y numeric NOT NULL,
	created timestamptz NOT NULL DEFAULT now(),
	updated timestamptz NOT NULL DEFAULT now(),
	CONSTRAINT logical_device_layouts_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE core.logical_device_layouts OWNER TO dcim_owner;
-- ddl-end --

-- object: core.placements | type: TABLE --
-- DROP TABLE IF EXISTS core.placements CASCADE;
CREATE TABLE core.placements (
	id uuid NOT NULL DEFAULT uuidv7(),
	asset_id uuid NOT NULL,
	rack_id uuid,
	start_unit integer,
	slot_type text,
	parent_placement_id uuid,
	port_definition_id uuid,
	logical_device_id uuid,
	created timestamptz NOT NULL DEFAULT now(),
	deleted timestamptz,
	CONSTRAINT placements_pk PRIMARY KEY (id),
	CONSTRAINT placements_ck_slot_type CHECK (slot_type IS NULL OR slot_type IN ('unit','power','zero_u')),
	CONSTRAINT placements_ck_exclusive_arc CHECK ((rack_id IS NOT NULL AND start_unit IS NOT NULL AND slot_type IS NOT NULL AND parent_placement_id IS NULL AND port_definition_id IS NULL) OR (rack_id IS NULL AND start_unit IS NULL AND slot_type IS NULL AND parent_placement_id IS NOT NULL AND port_definition_id IS NOT NULL))
);
-- ddl-end --
ALTER TABLE core.placements OWNER TO dcim_owner;
-- ddl-end --

-- object: core.physical_connections | type: TABLE --
-- DROP TABLE IF EXISTS core.physical_connections CASCADE;
CREATE TABLE core.physical_connections (
	id uuid NOT NULL DEFAULT uuidv7(),
	a_placement_id uuid NOT NULL,
	a_port_definition_id uuid NOT NULL,
	b_placement_id uuid NOT NULL,
	b_port_definition_id uuid NOT NULL,
	cable_asset_id uuid,
	logical_connection_id uuid,
	created timestamptz NOT NULL DEFAULT now(),
	deleted timestamptz,
	CONSTRAINT physical_connections_pk PRIMARY KEY (id)
);
-- ddl-end --
ALTER TABLE core.physical_connections OWNER TO dcim_owner;
-- ddl-end --

-- object: core.notes | type: TABLE --
-- DROP TABLE IF EXISTS core.notes CASCADE;
CREATE TABLE core.notes (
	id uuid NOT NULL DEFAULT uuidv7(),
	body text NOT NULL,
	device_catalog_id uuid,
	port_definition_id uuid,
	asset_id uuid,
	site_id uuid,
	room_id uuid,
	rack_row_id uuid,
	rack_id uuid,
	placement_id uuid,
	physical_connection_id uuid,
	logical_design_id uuid,
	logical_device_id uuid,
	logical_connection_id uuid,
	created timestamptz NOT NULL DEFAULT now(),
	deleted timestamptz,
	CONSTRAINT notes_pk PRIMARY KEY (id),
	CONSTRAINT notes_ck_single_ref CHECK (num_nonnulls(device_catalog_id, port_definition_id, asset_id, site_id, room_id, rack_row_id, rack_id, placement_id, physical_connection_id, logical_design_id, logical_device_id, logical_connection_id) = 1)
);
-- ddl-end --
ALTER TABLE core.notes OWNER TO dcim_owner;
-- ddl-end --

-- object: rooms_fk_site | type: CONSTRAINT --
-- ALTER TABLE core.rooms DROP CONSTRAINT IF EXISTS rooms_fk_site CASCADE;
ALTER TABLE core.rooms ADD CONSTRAINT rooms_fk_site FOREIGN KEY (site_id)
REFERENCES core.sites (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: rack_rows_fk_room | type: CONSTRAINT --
-- ALTER TABLE core.rack_rows DROP CONSTRAINT IF EXISTS rack_rows_fk_room CASCADE;
ALTER TABLE core.rack_rows ADD CONSTRAINT rack_rows_fk_room FOREIGN KEY (room_id)
REFERENCES core.rooms (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: racks_fk_rack_row | type: CONSTRAINT --
-- ALTER TABLE core.racks DROP CONSTRAINT IF EXISTS racks_fk_rack_row CASCADE;
ALTER TABLE core.racks ADD CONSTRAINT racks_fk_rack_row FOREIGN KEY (rack_row_id)
REFERENCES core.rack_rows (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: port_definitions_fk_device_catalog | type: CONSTRAINT --
-- ALTER TABLE core.port_definitions DROP CONSTRAINT IF EXISTS port_definitions_fk_device_catalog CASCADE;
ALTER TABLE core.port_definitions ADD CONSTRAINT port_definitions_fk_device_catalog FOREIGN KEY (device_catalog_id)
REFERENCES core.device_catalogs (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: port_compatibilities_fk_port_definition | type: CONSTRAINT --
-- ALTER TABLE core.port_compatibilities DROP CONSTRAINT IF EXISTS port_compatibilities_fk_port_definition CASCADE;
ALTER TABLE core.port_compatibilities ADD CONSTRAINT port_compatibilities_fk_port_definition FOREIGN KEY (port_definition_id)
REFERENCES core.port_definitions (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: port_compatibilities_fk_catalog | type: CONSTRAINT --
-- ALTER TABLE core.port_compatibilities DROP CONSTRAINT IF EXISTS port_compatibilities_fk_catalog CASCADE;
ALTER TABLE core.port_compatibilities ADD CONSTRAINT port_compatibilities_fk_catalog FOREIGN KEY (compatible_catalog_id)
REFERENCES core.device_catalogs (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: assets_fk_device_catalog | type: CONSTRAINT --
-- ALTER TABLE core.assets DROP CONSTRAINT IF EXISTS assets_fk_device_catalog CASCADE;
ALTER TABLE core.assets ADD CONSTRAINT assets_fk_device_catalog FOREIGN KEY (device_catalog_id)
REFERENCES core.device_catalogs (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: asset_events_fk_asset | type: CONSTRAINT --
-- ALTER TABLE core.asset_events DROP CONSTRAINT IF EXISTS asset_events_fk_asset CASCADE;
ALTER TABLE core.asset_events ADD CONSTRAINT asset_events_fk_asset FOREIGN KEY (asset_id)
REFERENCES core.assets (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: logical_devices_fk_design | type: CONSTRAINT --
-- ALTER TABLE core.logical_devices DROP CONSTRAINT IF EXISTS logical_devices_fk_design CASCADE;
ALTER TABLE core.logical_devices ADD CONSTRAINT logical_devices_fk_design FOREIGN KEY (logical_design_id)
REFERENCES core.logical_designs (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: logical_devices_fk_catalog | type: CONSTRAINT --
-- ALTER TABLE core.logical_devices DROP CONSTRAINT IF EXISTS logical_devices_fk_catalog CASCADE;
ALTER TABLE core.logical_devices ADD CONSTRAINT logical_devices_fk_catalog FOREIGN KEY (device_catalog_id)
REFERENCES core.device_catalogs (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: logical_connections_fk_design | type: CONSTRAINT --
-- ALTER TABLE core.logical_connections DROP CONSTRAINT IF EXISTS logical_connections_fk_design CASCADE;
ALTER TABLE core.logical_connections ADD CONSTRAINT logical_connections_fk_design FOREIGN KEY (logical_design_id)
REFERENCES core.logical_designs (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: logical_connections_fk_a_device | type: CONSTRAINT --
-- ALTER TABLE core.logical_connections DROP CONSTRAINT IF EXISTS logical_connections_fk_a_device CASCADE;
ALTER TABLE core.logical_connections ADD CONSTRAINT logical_connections_fk_a_device FOREIGN KEY (a_logical_device_id)
REFERENCES core.logical_devices (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: logical_connections_fk_b_device | type: CONSTRAINT --
-- ALTER TABLE core.logical_connections DROP CONSTRAINT IF EXISTS logical_connections_fk_b_device CASCADE;
ALTER TABLE core.logical_connections ADD CONSTRAINT logical_connections_fk_b_device FOREIGN KEY (b_logical_device_id)
REFERENCES core.logical_devices (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: logical_device_layouts_fk_device | type: CONSTRAINT --
-- ALTER TABLE core.logical_device_layouts DROP CONSTRAINT IF EXISTS logical_device_layouts_fk_device CASCADE;
ALTER TABLE core.logical_device_layouts ADD CONSTRAINT logical_device_layouts_fk_device FOREIGN KEY (logical_device_id)
REFERENCES core.logical_devices (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: placements_fk_asset | type: CONSTRAINT --
-- ALTER TABLE core.placements DROP CONSTRAINT IF EXISTS placements_fk_asset CASCADE;
ALTER TABLE core.placements ADD CONSTRAINT placements_fk_asset FOREIGN KEY (asset_id)
REFERENCES core.assets (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: placements_fk_rack | type: CONSTRAINT --
-- ALTER TABLE core.placements DROP CONSTRAINT IF EXISTS placements_fk_rack CASCADE;
ALTER TABLE core.placements ADD CONSTRAINT placements_fk_rack FOREIGN KEY (rack_id)
REFERENCES core.racks (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: placements_fk_parent | type: CONSTRAINT --
-- ALTER TABLE core.placements DROP CONSTRAINT IF EXISTS placements_fk_parent CASCADE;
ALTER TABLE core.placements ADD CONSTRAINT placements_fk_parent FOREIGN KEY (parent_placement_id)
REFERENCES core.placements (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: placements_fk_port_definition | type: CONSTRAINT --
-- ALTER TABLE core.placements DROP CONSTRAINT IF EXISTS placements_fk_port_definition CASCADE;
ALTER TABLE core.placements ADD CONSTRAINT placements_fk_port_definition FOREIGN KEY (port_definition_id)
REFERENCES core.port_definitions (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: placements_fk_logical_device | type: CONSTRAINT --
-- ALTER TABLE core.placements DROP CONSTRAINT IF EXISTS placements_fk_logical_device CASCADE;
ALTER TABLE core.placements ADD CONSTRAINT placements_fk_logical_device FOREIGN KEY (logical_device_id)
REFERENCES core.logical_devices (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: physical_connections_fk_a_placement | type: CONSTRAINT --
-- ALTER TABLE core.physical_connections DROP CONSTRAINT IF EXISTS physical_connections_fk_a_placement CASCADE;
ALTER TABLE core.physical_connections ADD CONSTRAINT physical_connections_fk_a_placement FOREIGN KEY (a_placement_id)
REFERENCES core.placements (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: physical_connections_fk_a_port | type: CONSTRAINT --
-- ALTER TABLE core.physical_connections DROP CONSTRAINT IF EXISTS physical_connections_fk_a_port CASCADE;
ALTER TABLE core.physical_connections ADD CONSTRAINT physical_connections_fk_a_port FOREIGN KEY (a_port_definition_id)
REFERENCES core.port_definitions (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: physical_connections_fk_b_placement | type: CONSTRAINT --
-- ALTER TABLE core.physical_connections DROP CONSTRAINT IF EXISTS physical_connections_fk_b_placement CASCADE;
ALTER TABLE core.physical_connections ADD CONSTRAINT physical_connections_fk_b_placement FOREIGN KEY (b_placement_id)
REFERENCES core.placements (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: physical_connections_fk_b_port | type: CONSTRAINT --
-- ALTER TABLE core.physical_connections DROP CONSTRAINT IF EXISTS physical_connections_fk_b_port CASCADE;
ALTER TABLE core.physical_connections ADD CONSTRAINT physical_connections_fk_b_port FOREIGN KEY (b_port_definition_id)
REFERENCES core.port_definitions (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: physical_connections_fk_cable_asset | type: CONSTRAINT --
-- ALTER TABLE core.physical_connections DROP CONSTRAINT IF EXISTS physical_connections_fk_cable_asset CASCADE;
ALTER TABLE core.physical_connections ADD CONSTRAINT physical_connections_fk_cable_asset FOREIGN KEY (cable_asset_id)
REFERENCES core.assets (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: physical_connections_fk_logical_connection | type: CONSTRAINT --
-- ALTER TABLE core.physical_connections DROP CONSTRAINT IF EXISTS physical_connections_fk_logical_connection CASCADE;
ALTER TABLE core.physical_connections ADD CONSTRAINT physical_connections_fk_logical_connection FOREIGN KEY (logical_connection_id)
REFERENCES core.logical_connections (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: notes_fk_device_catalog | type: CONSTRAINT --
-- ALTER TABLE core.notes DROP CONSTRAINT IF EXISTS notes_fk_device_catalog CASCADE;
ALTER TABLE core.notes ADD CONSTRAINT notes_fk_device_catalog FOREIGN KEY (device_catalog_id)
REFERENCES core.device_catalogs (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: notes_fk_port_definition | type: CONSTRAINT --
-- ALTER TABLE core.notes DROP CONSTRAINT IF EXISTS notes_fk_port_definition CASCADE;
ALTER TABLE core.notes ADD CONSTRAINT notes_fk_port_definition FOREIGN KEY (port_definition_id)
REFERENCES core.port_definitions (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: notes_fk_asset | type: CONSTRAINT --
-- ALTER TABLE core.notes DROP CONSTRAINT IF EXISTS notes_fk_asset CASCADE;
ALTER TABLE core.notes ADD CONSTRAINT notes_fk_asset FOREIGN KEY (asset_id)
REFERENCES core.assets (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: notes_fk_site | type: CONSTRAINT --
-- ALTER TABLE core.notes DROP CONSTRAINT IF EXISTS notes_fk_site CASCADE;
ALTER TABLE core.notes ADD CONSTRAINT notes_fk_site FOREIGN KEY (site_id)
REFERENCES core.sites (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: notes_fk_room | type: CONSTRAINT --
-- ALTER TABLE core.notes DROP CONSTRAINT IF EXISTS notes_fk_room CASCADE;
ALTER TABLE core.notes ADD CONSTRAINT notes_fk_room FOREIGN KEY (room_id)
REFERENCES core.rooms (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: notes_fk_rack_row | type: CONSTRAINT --
-- ALTER TABLE core.notes DROP CONSTRAINT IF EXISTS notes_fk_rack_row CASCADE;
ALTER TABLE core.notes ADD CONSTRAINT notes_fk_rack_row FOREIGN KEY (rack_row_id)
REFERENCES core.rack_rows (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: notes_fk_rack | type: CONSTRAINT --
-- ALTER TABLE core.notes DROP CONSTRAINT IF EXISTS notes_fk_rack CASCADE;
ALTER TABLE core.notes ADD CONSTRAINT notes_fk_rack FOREIGN KEY (rack_id)
REFERENCES core.racks (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: notes_fk_placement | type: CONSTRAINT --
-- ALTER TABLE core.notes DROP CONSTRAINT IF EXISTS notes_fk_placement CASCADE;
ALTER TABLE core.notes ADD CONSTRAINT notes_fk_placement FOREIGN KEY (placement_id)
REFERENCES core.placements (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: notes_fk_physical_connection | type: CONSTRAINT --
-- ALTER TABLE core.notes DROP CONSTRAINT IF EXISTS notes_fk_physical_connection CASCADE;
ALTER TABLE core.notes ADD CONSTRAINT notes_fk_physical_connection FOREIGN KEY (physical_connection_id)
REFERENCES core.physical_connections (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: notes_fk_logical_design | type: CONSTRAINT --
-- ALTER TABLE core.notes DROP CONSTRAINT IF EXISTS notes_fk_logical_design CASCADE;
ALTER TABLE core.notes ADD CONSTRAINT notes_fk_logical_design FOREIGN KEY (logical_design_id)
REFERENCES core.logical_designs (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: notes_fk_logical_device | type: CONSTRAINT --
-- ALTER TABLE core.notes DROP CONSTRAINT IF EXISTS notes_fk_logical_device CASCADE;
ALTER TABLE core.notes ADD CONSTRAINT notes_fk_logical_device FOREIGN KEY (logical_device_id)
REFERENCES core.logical_devices (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --

-- object: notes_fk_logical_connection | type: CONSTRAINT --
-- ALTER TABLE core.notes DROP CONSTRAINT IF EXISTS notes_fk_logical_connection CASCADE;
ALTER TABLE core.notes ADD CONSTRAINT notes_fk_logical_connection FOREIGN KEY (logical_connection_id)
REFERENCES core.logical_connections (id) MATCH SIMPLE
ON DELETE NO ACTION ON UPDATE NO ACTION;
-- ddl-end --


