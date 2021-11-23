CREATE DATABASE mydb;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username VARCHAR (255),
    password VARCHAR(255)
    roles VARCHAR(255)
);

CREATE TABLE dataOne(
    id SERIAL PRIMARY KEY,
    identifier VARCHAR (255) UNIQUE,
    info jsonb NOT NULL
);

CREATE TABLE dataTwo(
    id SERIAL PRIMARY KEY,
    identifier VARCHAR (255) UNIQUE,
    info jsonb NOT NULL
);

CREATE TABLE dataThree(
    id SERIAL PRIMARY KEY,
    identifier VARCHAR (255) UNIQUE,
    info jsonb NOT NULL
);

CREATE TABLE dataFour(
    id SERIAL PRIMARY KEY,
    identifier VARCHAR (255) UNIQUE,
    info jsonb NOT NULL
);

