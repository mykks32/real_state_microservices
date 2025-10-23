ALTER TABLE properties
ADD COLUMN IF NOT EXISTS owner_id BINARY(16) AFTER location_id;