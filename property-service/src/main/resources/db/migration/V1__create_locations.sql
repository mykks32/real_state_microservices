CREATE TABLE IF NOT EXISTS locations (
    id BIGINT NOT NULL AUTO_INCREMENT,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    lattitude FLOAT(23),
    longitude FLOAT(23),
    state ENUM('Bagmati','Gandaki','Karnali','Koshi','Lumbini','Madhesh','Sudurpashchim') NOT NULL,
    zipcode INT NOT NULL,
    PRIMARY KEY (id)
) ENGINE=InnoDB;