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
INSERT INTO species (name) VALUES ('cat'), ('dog');
INSERT INTO pets (species_id, name, foto, email, created_at) VALUES
(1,'Tom','images/pet1.png','tommy@gmail','2012-11-11'),
(1,'Joe','images/pet2.png','boppy@gmail.com','2022-10-19'),
(1,'Scarlet','images/pet3.png','scarly@gmail.com','2022-12-19'),
(1,'Johanson','images/pet4.png','Johan@gmail.com','2022-12-12'),
(1,'Tony','images/pet5.png','Tony@gmail.com','2022-12-13'),
(1,'Stark','images/pet6.png','starky@gmail.com','2022-12-14'),
(2,'Hawk','images/pet7.png','eye@gmail.com','2022-12-15'),
(2,'Reed','images/pet8.png','richard@gmail.com','2022-12-16'),
(2,'Johnny','images/pet9.png','storm2@gmail.com','2022-12-16'),
(2,'Sue','images/pet10.png','storm@gmail.com','2022-12-16'),
(2,'Scooby','images/pet11.png','doo@gmail.com','2022-12-19'),
(2,'Scrappy','images/pet12.png','dooby@gmail.com','2022-12-22');
