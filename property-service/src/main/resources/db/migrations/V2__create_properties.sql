CREATE TABLE IF NOT EXISTS properties (
    id BINARY(16) NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    description VARCHAR(500),
    status ENUM('Available','Rented','Sold') NOT NULL,
    title VARCHAR(150) NOT NULL,
    type ENUM('House','Land') NOT NULL,
    location_id BIGINT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;

ALTER TABLE properties
ADD CONSTRAINT UK_location_id UNIQUE (location_id);

ALTER TABLE properties
ADD CONSTRAINT FK_location FOREIGN KEY (location_id) REFERENCES locations(id);