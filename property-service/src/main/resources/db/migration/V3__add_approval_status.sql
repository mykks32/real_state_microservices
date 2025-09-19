ALTER TABLE properties
ADD COLUMN approval_status ENUM(
    'draft',
    'pending_approval',
    'approved',
    'rejected',
    'archived'
) NOT NULL DEFAULT 'draft' AFTER location_id;