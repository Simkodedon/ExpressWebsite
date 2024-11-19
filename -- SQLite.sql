-- SQLite
DROP TABLE IF EXISTS users;
CREATE TABLE IF NOT EXISTS users (
email varchar(32) UNIQUE NOT NULL,
firstname varchar(32) NOT NULL,
lastname varchar(32) NOT NULL,
password varchar(128) NOT NULL,
id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT NOT NULL);


DROP TABLE IF EXISTS consumer;
CREATE TABLE IF NOT EXISTS consumer(
email varchar(32) UNIQUE NOT NULL,
firstname varchar(32) UNIQUE NOT NULL,
lastname varchar(32) UNIQUE NOT NULL,
password varchar(32) NOT NULL,
blockStatus varchar(32) DEFAULT 'Has Access',
verify varchar(32) DEFAULT 'Consumer',
id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT NOT NULL);


DROP TABLE IF EXISTS superadmin;
CREATE TABLE IF NOT EXISTS superadmin(
email varchar(32) UNIQUE NOT NULL,
firstname varchar(32),
lastname varchar(32),
password varchar(32) NOT NULL,
id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT NOT NULL);

INSERT INTO superadmin (email, firstname, lastname, password) VALUES
('superadmin@test.se','SuperAdmin','Account', 'superadminpassword');

DROP TABLE IF EXISTS contributor;
CREATE TABLE IF NOT EXISTS contributor(
email varchar(32) UNIQUE NOT NULL,
firstname varchar(32),
lastname varchar(32),
password varchar(32) NOT NULL,
blockStatus varchar(32) DEFAULT 'Has Access',
verify varchar(32) DEFAULT 'Contributor',
id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT NOT NULL);


DROP TABLE IF EXISTS question;
CREATE TABLE IF NOT EXISTS question (
title varchar(32),
description varchar(128),
category varchar(32),
answer varchar(128) DEFAULT 'No Answer yet',
username varchar(32) DEFAULT 'No username yet',
uploaded TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
qid INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT NOT NULL);



INSERT INTO question(title, category, description, uploaded, answer, username) VALUES
('Distans', 'General', 'Hur långt är det till er affär?','2020-11-03 17:29:50.150', 'No answer yet','No username yet'),
('TV', 'Electronics', 'Vad är eran största TV?','2020-11-03 17:29:50.150', 'No answer yet', 'No username yet'),
('Dolma', 'Food ', 'Hur mycket kostar en halv dolma?','2021-01-06 17:29:50.150', 'No answer yet','No username yet');


INSERT INTO users (email, firstname, lastname, password) VALUES
('h19simgh@du.se','Simko','Ghaderi', '112233'),
('h02oldschoolbandit@du.se','Fjäll','Räven', 'Ravarebest');

DROP TABLE IF EXISTS products;
CREATE TABLE IF NOT EXISTS products (
name varchar(32),
description varchar(128),
image varchar(128),
price varchar(32),
id INTEGER UNIQUE PRIMARY KEY AUTOINCREMENT NOT NULL);


INSERT INTO products(name,description,image,price) VALUES
('Red Wine', 'Red Wine directly from Paris', 'ProduktVin.jpg', '1500'),
('Kurdish Dolma', 'Home-Made Kurdish Dolma', 'ProduktDolma.jpg', '1000'),
('TV', 'Flat-Screen TV', 'ProduktTV.jpg', '10000');
