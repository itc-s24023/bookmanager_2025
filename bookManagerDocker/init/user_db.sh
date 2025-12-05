#!/bin/bash
set -e

psql - v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER book_manager ENCRYPTED PASSWORD 'book_manager';
    CREATE DATABASE book_manager OWNER book_manager;
    GRANT ALL PRIVILEGES ON DATABASE book_manager TO book_manager;

    CREATE DATABASE _book_manager OWNER book_manager;
    GRANT ALL PRIVILEGES ON DATABASE _book_manager TO book_manager;
EOSQL