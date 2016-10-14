CREATE DATABASE todolist;

CREATE TABLE todos (
	id SERIAL PRIMARY KEY,
	list_item varchar(80),
	crossed_off boolean
);

INSERT INTO todos (list_item, crossed_off)
VALUES
('clean bathroom', true),
('shovel snow', false),
('dishes', true),
('create todo list', false);
