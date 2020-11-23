-- IF NECESSARY

-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

-- DROP DATABASE IF EXISTS foodfy;
-- CREATE DATABASE foodfy;

CREATE TABLE "chefs" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP DEFAULT (now()),
    "file_id" INT NOT NULL
);
CREATE TABLE "files" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT,
    "path" TEXT NOT NULL
);
CREATE TABLE "recipe_files" (
    "id" SERIAL PRIMARY KEY,
    "recipe_id" INT NOT NULL, 
    "file_id" INT NOT NULL
);
CREATE TABLE "recipes" (
    "id" SERIAL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "ingredients" TEXT[] NOT NULL,
    "preparations" TEXT[] NOT NULL,
    "information" TEXT,
    "chef_id" INT NOT NULL, 
    "user_id" INT NOT NULL,
    "created_at" TIMESTAMP DEFAULT (now()),
    "updated_at" TIMESTAMP DEFAULT (now())
);
CREATE TABLE "users" (
    "id" SERIAL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "reset_token" TEXT,
    "reset_token_expires" TEXT,
    "is_admin" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP DEFAULT (now()),
    "updated_at" TIMESTAMP DEFAULT (now())
);

-- FOREIGN KEYS
-- chefs
ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");
-- recipes
ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES "chefs" ("id");
-- recipe_files
ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES "recipes" ("id");
ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES "files" ("id");

-- CREATE PROCEDURE
CREATE FUNCTION trigger_set_timestamp() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- AUTO UPDATED_AT USERS
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- AUTO UPDATED_AT RECIPES
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes 
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

-- CONNECT PG SIMPLE TABLE
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL COLLATE "default",
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session"
ADD CONSTRAINT "session_pkey"
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

-- CASCADE EFFECT WHEN DELETE USERS / RECIPES / FILES / CHEFS 
ALTER TABLE "recipes"
DROP CONSTRAINT recipes_user_id_fkey,
ADD CONSTRAINT recipes_user_id_fkey
FOREIGN KEY ("user_id")
REFERENCES "users" ("id")
ON DELETE CASCADE;

ALTER TABLE "recipe_files"
DROP CONSTRAINT recipe_files_recipe_id_fkey,
ADD CONSTRAINT recipe_files_recipe_id_fkey
FOREIGN KEY ("recipe_id")
REFERENCES "recipes" ("id")
ON DELETE CASCADE;

ALTER TABLE "recipe_files"
DROP CONSTRAINT recipe_files_file_id_fkey,
ADD CONSTRAINT recipe_files_file_id_fkey
FOREIGN KEY ("file_id")
REFERENCES "files" ("id")
ON DELETE CASCADE;

ALTER TABLE "chefs"
DROP CONSTRAINT chefs_file_id_fkey,
ADD CONSTRAINT chefs_file_id_fkey
FOREIGN KEY ("file_id")
REFERENCES "files" ("id")
ON DELETE CASCADE;

-- -- TO RUN SEEDS
-- DELETE FROM recipes;
-- DELETE FROM chefs;
-- DELETE FROM files;
-- DELETE FROM recipe_files;
-- DELETE FROM users;

-- -- RESTART SEQUENCE AUTO_INCREMENT FROM TABLES IDS
-- ALTER SEQUENCE chefs_id_seq RESTART WITH 1;
-- ALTER SEQUENCE files_id_seq RESTART WITH 1;
-- ALTER SEQUENCE recipe_files_id_seq RESTART WITH 1;
-- ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
-- ALTER SEQUENCE users_id_seq RESTART WITH 1;