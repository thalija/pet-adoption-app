-- =====================================================================
-- Dating App for Animal Adoption
-- Purpose: Create database tables (Users, Pets) and load the pet data
-- =====================================================================

-- =====================================================================
-- IMAGE CREDIT
-- Pet images used in this database are sourced from Pixabay website:
-- Pixabay ( https://pixabay.com/ )
-- License: Use Content for free without having to attribute the author
-- License Summary: https://pixabay.com/service/license-summary/
-- =====================================================================


SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Drop tables if they exist to avoid errors
DROP TABLE IF EXISTS pets;
DROP TABLE IF EXISTS users;

-- =====================================================================
-- TABLE: USERS
-- Purpose: Store account for the public users and admin
--    
-- NOTES
--    
-- users.role:
--    - 'admin'  = admin can create, edit, update, delete pet profiles
--    - 'public' = adopter, user can browse for pets
--
-- users.children ( public user only. Admins will be NULL ) 
--    - 1 = public user has children
--    - 0 = public user has no children
--
-- users.activity ( public user only. Admins will be NULL ) 
--    - 'low'    = public user has a low activity lifestyle/home
--    - 'medium' = public user has a moderate activity lifestyle/home
--    - 'high'   = public user has a high activity lifestyle/home
--    
-- dateCreated:
-- 		If there is no time create during INSERT data, the database will 
--      give the current time
--
-- =====================================================================

CREATE TABLE users ( 
	userID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(145) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    role ENUM('admin', 'public') NOT NULL,
    dateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
-- For public user profile (activity level and children) admins can ignore
	children TINYINT(1) NULL, 
    activity ENUM('low', 'medium', 'high') NULL
);

-- =====================================================================
-- TABLE: PETS
-- Purpose: Store the pet profiles.
--    
-- NOTES
--    
-- pets.createdBy:
--    - references users.userID
--    - which admin created the profile, must be ADMIN role
--
-- pets.goodWithChildren: 
--    - 1 = pet can be in a household with children
--    - 0 = pet shouldn't be in a household with children, not recommended
--
-- pets.goodWithAnimals: 
--    - 1 = pet can be in a household with other animals
--    - 0 = pet shouldn't be in a household with other animals, not recommended
--
-- pets.leashed: 
--    - 1 = pet must be leashed or restrained outside its home, or area
--    - 0 = leash is not required or not applicable to animal (other or cat)
--
-- pets.energy
--    - 'low'    = pet has minimal activity or needs
--    - 'medium' = pet has moderate activity or needs
--    - 'high'   = pet has high activity 
--
-- =====================================================================

CREATE TABLE pets ( 
	petID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
	name VARCHAR(100) NOT NULL,
	animalType ENUM('dog', 'cat', 'other') NOT NULL,
	breed VARCHAR(255) NOT NULL,
	description TEXT NOT NULL,
	availability ENUM('not_available', 'available', 'pending', 'adopted') NOT NULL,
	dateCreated DATETIME NOT NULL,
-- Which admin createed the pet profile 
	createdBy INT NOT NULL,
-- URL of an image
	petPhoto VARCHAR(500) NOT NULL,
	newsItem TEXT NULL,
-- Disposition
	goodWithChildren TINYINT(1) NOT NULL,
	goodWithAnimals TINYINT(1) NOT NULL,
	leashed TINYINT(1) NOT NULL,
	energy ENUM('low', 'medium', 'high') NOT NULL,
-- Foreign key constraints
	FOREIGN KEY (createdBy) REFERENCES users(userID)

);

-- =====================================================================
-- INSERTING DATA
-- INSERT ADMIN, PUBLIC and PETS
-- =====================================================================

-- =====================================================================
-- INSERT USERS (Admin) 
-- =====================================================================
INSERT INTO users (email, `password`, role, dateCreated, children, activity)
VALUES 
('admin1@example.com', 'examplepass1', 'admin', '2025-04-30 10:30:00', NULL, NULL ),
('admin2@example.com', 'examplepass2', 'admin', '2025-02-14 08:30:00', NULL, NULL );

-- =====================================================================
-- INSERT USERS (Public) 
-- =====================================================================
INSERT INTO users (email, `password`, role, dateCreated, children, activity)
VALUES 
-- has children (1), activity is high
('adopter1@example.com', 'examplepass33', 'public', '2025-03-15 11:30:00', 1, 'high' ),
-- no children (0), activity is low
('adopter2@example.com', 'examplepass44', 'public', '2025-07-11 14:30:00', 0, 'low' );


-- =====================================================================
-- INSERT PETS (dogs)
-- 	Purpose:
-- 	- Data for puppy, adult, senior dogs
-- 	- Available, pending and adopted scenarios
-- 	- covers different dispositions and energy levels
-- =====================================================================
INSERT INTO pets (name, animalType,breed, description, availability, dateCreated, createdBy, petPhoto, newsItem, goodWithChildren, goodWithAnimals, leashed, energy)
VALUES
(
	'Mavis',
    'dog',
    'Labrador Retriever',
-- Description has Age, Gender, personality.
    '- Age: Adult (3 years old)
	- Gender: Female
	- Spayed/Neutered: Yes
	- Personality: Friendly, energetic
    
	Mavis is a friendly and nice dog that enjoys being around people and other animals.',
    'available',
    '2026-01-03 09:30:00',
    1,
    '/petphotos/mavis.jpg',
    'Mavis is currently living in a foster home and is available to meet by a scheduled appointment.',
    1,
    1,
    1,
    'high'
),

(
	'Fluffy',
    'dog',
    'Poodle',
-- Description has Age, Gender, personality.
    '- Age: Senior (10 years old)
	- Gender: Male
	- Spayed/Neutered: Yes
	- Personality: Friendly, calm, gentle

	Fluffy is an older friendly dog that enjoys calm households and enjoys short walks.
	',
    'available',
    '2026-01-05 11:30:00',
    1,
    '/petphotos/fluffy.jpg',
    'Fluffy is currently living in a foster home and is available to meet by a scheduled appointment.',
    1,
    1,
    1,
    'low'
),

(
	'Tank',
    'dog',
    'Corgi',
-- Description has Age, Gender, personality.
    '- Age: Adult (3 years old)
	- Gender: Male
	- Spayed/Neutered: Yes
	- Personality: Friendly, intelligent

	Tank is a smart dog that enjoys his personal space. He loves people but also loves to have some personal time during the day. He would do well in an adult only home.
	',
    'available',
    '2026-01-08 11:00:00',
    1,
    '/petphotos/tank.jpg',
    'Tank is currently living in a foster home and is available to meet by a scheduled appointment.',
    0,
    1,
    1,
    'medium'
),

(
	'Bella',
    'dog',
    'Maltese',
-- Description has Age, Gender, personality.
    '- Age: Adult (4 years old)
	- Gender: Female
	- Spayed/Neutered: Yes
	- Personality: Friendly, affectionate
    
	Bella is a small dog that enjoys being around people. She loves being around other animals and is great with children.
	',
    'pending',
    '2026-01-08 11:00:00',
    2,
    '/petphotos/bella.jpg',
    'Bella is currently living in a foster home and is not available for any meet and greet appointments.',
    1,
    1,
    1,
    'medium'
),

(
	'Koda',
    'dog',
    'Husky',
-- Description has Age, Gender, personality.
    '- Age: Puppy (4 months old)
	- Gender: Male
	- Spayed/Neutered: No
	- Personality: Friendly, playful, energetic
    
	Koda is a very active puppy that enjoys playing and running around. He loves being around other animals and is great with children. He is full of energy and would need proper training.
	',
    'available',
    '2026-01-29 08:30:00',
    2,
    '/petphotos/koda.jpg',
    'Koda is currently living in a foster home and is available to meet by a scheduled appointment.',
    1,
    1,
    1,
    'high'
),

(
	'Dug',
    'dog',
    'Golden Retriever',
-- Description has Age, Gender, personality.
    '- Age: Adult (3 years old)
	- Gender: Male
	- Spayed/Neutered: Yes
	- Personality: Friendly, playful, energetic
    
	Dug is a very active dog that enjoys playing and running around. He loves being around other animals and is great with children. He is full of energy and is always a very happy dog.
	',
    'adopted',
    '2026-01-06 09:30:00',
    1,
    '/petphotos/dug.jpg',
    'Dug is adopted and is now in a loving home.',
    1,
    1,
    1,
    'medium'
);



-- =====================================================================
-- INSERT PETS (cats)
-- 	Purpose:
-- 	- Data for kitten, adult, senior cats
-- 	- Available, pending and adopted scenarios
-- 	- covers different dispositions and energy levels
-- =====================================================================
INSERT INTO pets (name, animalType,breed, description, availability, dateCreated, createdBy, petPhoto, newsItem, goodWithChildren, goodWithAnimals, leashed, energy)
VALUES
(
	'Luna',
    'cat',
    'Siamese',
-- Description has Age, Gender, personality.
    '- Age: Adult (2 years old)
	- Gender: Female
	- Spayed/Neutered: Yes
	- Personality: Friendly, social, playful
    
	Luna is a social cat that enjoys calm households and being around people.
	',
    'available',
    '2026-01-10 11:00:00',
    2,
    '/petphotos/luna.jpg',
    'Luna is currently living in a foster home and is available to meet by a scheduled appointment.',
    1,
    1,
    0,
    'medium'
),

(
	'Mitten',
    'cat',
    'Domestic Shorthair',
-- Description has Age, Gender, personality.
    '- Age: Kitten (4 months old )
	- Gender: Male
	- Spayed/Neutered: No
	- Personality: Playful, energetic
	Mitten is a happy and playful kitten that enjoys playing with toys and exploring his environment.
	',
    'available',
    '2026-01-14 14:00:00',
    2,
    '/petphotos/mitten.jpg',
    'Mitten is currently living in a foster home and is available to meet by a scheduled appointment.',
    1,
    1,
    0,
    'high'
),

(
	'Salem',
    'cat',
    'Domestic Shorthair',
-- Description has Age, Gender, personality.
    '- Age: Adult (5 years old )
	- Gender: Male
	- Spayed/Neutered: Yes
	- Personality: Curious, Friendly, Smart

	Salem is a smart cat who likes calm environments and gentle hands. He would do best in households with adults.
	',
    'available',
    '2026-01-18 08:00:00',
    1,
    '/petphotos/salem.jpg',
    'Salem is currently living in a foster home and is available to meet by a scheduled appointment.',
    0,
    1,
    0,
    'low'
),

(
	'Oliver',
    'cat',
    'Domestic Shorthair',
-- Description has Age, Gender, personality.
    '- Age: Adult (4 years old )
	- Gender: Male
	- Spayed/Neutered: Yes
	- Personality: affectionate, Friendly

	Oliver is a cat who likes relaxing in sunny spots. He would do best in households with routines.
	',
    'available',
    '2026-01-18 08:00:00',
    1,
    '/petphotos/oliver.jpg',
    'Oliver has been adopted and is loving his new home.',
    0,
    1,
    0,
    'low'
),

(
	'Maple',
    'cat',
    'Domestic Shorthair',
-- Description has Age, Gender, personality.
    '- Age: Senior (10 years old )
	- Gender: Female
	- Spayed/Neutered: Yes
	- Personality: affectionate, calm, friendly
    
	Maple is an older cat who likes relaxing in sunny spots. She would do best in households that are calm.
	',
    'pending',
    '2026-01-16 09:00:00',
    1,
    '/petphotos/maple.jpg',
    'Maple is currently pending adoption and is not available for any scheduled meetings at this time.',
    0,
    1,
    0,
    'low'
),

(
	'Molly',
    'cat',
    'Domestic Shorthair',
-- Description has Age, Gender, personality.
    '- Age: Adult (6 years old )
	- Gender: Female
	- Spayed/Neutered: Yes
	- Personality: affectionate, calm, independent
    
	Molly is a nice cat who enjoys people but enjoys her own personal time. She would do best in households that are calm.
	',
    'adopted',
    '2026-01-11 13:40:00',
    2,
    '/petphotos/molly.jpg',
    'Molly is adopted and is now in a loving home.',
    0,
    1,
    0,
    'low'
);


-- =====================================================================
-- INSERT PETS (other)
-- 	Purpose:
-- 	- Data for birds, reptiles and small mammals
-- 	- Available, pending and adopted scenarios
-- 	- covers different dispositions and energy levels
-- =====================================================================
INSERT INTO pets (name, animalType,breed, description, availability, dateCreated, createdBy, petPhoto, newsItem, goodWithChildren, goodWithAnimals, leashed, energy)
VALUES
(
	'Cookie',
    'other',
    'Hamster',
-- Description has Age, Gender, personality.
    '- Age: Adult (1 year old)
	- Gender: Male
	- Spayed/Neutered: N/A
	- Personality: Gentle, friendly
	
    Cookie is a curious hamster that enjoys playing with toys and being gently handled.
	',
    'available',
    '2026-01-25 15:00:00',
    1,
    '/petphotos/cookie.jpg',
    'Cookie is currently living in a foster home and is available to meet by a scheduled appointment.',
    1,
    0,
    0,
    'low'
),

(
	'Bun',
    'other',
    'Rabbit',
-- Description has Age, Gender, personality.
    '- Age: Adult (2 years old)
	- Gender: Female
	- Spayed/Neutered: Yes
	- Personality: Gentle, calm
    
	Bun is a calm bunny that enjoys being gently handled and loves to explore their environment. She also does well with cats.
	',
    'available',
    '2026-01-22 15:00:00',
    2,
    '/petphotos/bun.jpg',
    'Bun is currently living in a foster home and is available to meet by a scheduled appointment.',
    1,
    1,
    0,
    'low'
),

(
	'Sunny',
    'other',
    'Cockatiel',
-- Description has Age, Gender, personality.
    '- Age: Adult (3 years old)
	- Gender: Male
	- Spayed/Neutered: N/A
	- Personality: Social, curious, talkative
    
	Sunny is a very curious and happy cockatiel that enjoys being with people. He enjoys time outside his cage and would do best in a home that can provide daily activities.
	',
    'available',
    '2026-01-25 11:20:00',
    1,
    '/petphotos/sunny.jpg',
    'Sunny is currently living in a foster home and is available to meet by a scheduled appointment.',
    0,
    0,
    0,
    'low'
),

(
	'Mushu',
    'other',
    'Bearded Dragon',
-- Description has Age, Gender, personality.
    '- Age: Adult (1 year old)
	- Gender: Male
	- Spayed/Neutered: N/A
	- Personality: Gentle, calm, clever
    
	Mushu is a calm bearded dragon that enjoys being under a heat lamp and likes to roam around outside his enclosure.
	',
    'available',
    '2026-01-27 13:40:00',
    1,
    '/petphotos/mushu.jpg',
    'Mushu is currently living in a foster home and is available to meet by a scheduled appointment.',
    0,
    0,
    0,
    'low'
),

(
	'Piggy',
    'other',
    'Guinea Pig',
-- Description has Age, Gender, personality.
    '- Age: Adult (1 year old)
	- Gender: Male
	- Spayed/Neutered: N/A
	- Personality: Gentle, calm, clever

	Piggy is a spunky guinea pig that enjoys being around people. He would enjoy a home with another guinea pig to keep him company.
	',
    'pending',
    '2026-01-25 12:10:00',
    1,
    '/petphotos/piggy.jpg',
    'Piggy is currently pending adoption and is not available for any scheduled meetings at this time',
    1,
    1,
    0,
    'low'
),

(
	'Bowser',
    'other',
    'Tortoise',
-- Description has Age, Gender, personality.
    '- Age: Adult (10 year old)
	- Gender: Male
	- Spayed/Neutered: N/A
	- Personality: Calm, independant
    
	Bowser is an older tortoise who enjoys daily afternoon basks in the sun. He would best suit a household that is calm.
	',
    'pending',
    '2026-01-25 12:00:00',
    2,
    '/petphotos/bowser.jpg',
    'Bowser is currently pending adoption and is not available for any scheduled meetings at this time',
    0,
    0,
    0,
    'low'
);



-- enable foreign key check 
SET FOREIGN_KEY_CHECKS=1;
COMMIT;