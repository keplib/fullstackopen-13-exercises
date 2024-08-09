CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes int DEFAULT 0,
);

insert into blogs (author, url, title) values ('Dan Abramov','www.example.com', 'Let vs const');
insert into blogs (author, url, title) values ('Laurenz Albe','www.dev.io', 'Gaps in sequences in PostgreSQL');