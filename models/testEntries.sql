USE PetsNode;
INSERT INTO species (name) VALUES ('cat');
INSERT INTO pets (species_id, name, foto, email, created_at) VALUES
(1,'tom','asd','ssss@gmail','2010-11-11'),
(1,'bop','dsa','pppp@gmail.com','2022-10-19');
INSERT INTO votes (pet1_id, pet2_id, result, created_at) VALUES
(1,2,1,'2023-12-18');