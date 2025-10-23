CREATE TABLE properties (
    id BINARY(16) NOT NULL,
    location_id BIGINT NOT NULL,
    owner_id BINARY(16),
    title VARCHAR(150) NOT NULL,
    description VARCHAR(500),
    type ENUM('House','Land') NOT NULL,
    status ENUM('Available','Rented','Sold') NOT NULL,
    approval_status ENUM(
        'draft',
        'pending_approval',
        'approved',
        'rejected',
        'archived'
    ) NOT NULL DEFAULT 'draft',
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT UK_location_id UNIQUE (location_id),
    CONSTRAINT FK_location FOREIGN KEY (location_id) REFERENCES locations(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;