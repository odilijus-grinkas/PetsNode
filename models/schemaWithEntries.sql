CREATE DATABASE IF NOT EXISTS petsnode;
USE petsnode;
DROP TABLE IF EXISTS votes;
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS species;
CREATE TABLE IF NOT EXISTS species(
  `id` INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(10) NOT NULL
);
CREATE TABLE IF NOT EXISTS pets (
  id INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  species_id INT(10) NOT NULL,
  `name` VARCHAR(10) NOT NULL,
  foto VARCHAR(50) NULL,
  email VARCHAR(50) NULL,
  created_at DATE NOT NULL,
  FOREIGN KEY (species_id) REFERENCES species (`id`) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS votes(
id INT(10) NOT NULL AUTO_INCREMENT PRIMARY KEY,
pet1_id INT(10) NOT NULL,
pet2_id INT(10) NOT NULL,
`result` INT(10) NOT NULL,
created_at DATE NOT NULL,
FOREIGN KEY (pet1_id) REFERENCES pets (id) ON DELETE CASCADE,
FOREIGN KEY (pet2_id) REFERENCES pets (id) ON DELETE CASCADE
);

/* TEST ENTRIES */
INSERT INTO species (name) VALUES ('cat');
INSERT INTO pets (species_id, name, foto, email, created_at) VALUES
(1,'tom','asd','ssss@gmail','2010-11-11'),
(1,'bop','dsa','pppp@gmail.com','2022-10-19');
INSERT INTO votes (pet1_id, pet2_id, result, created_at) VALUES
(1,2,1,'2023-12-18');